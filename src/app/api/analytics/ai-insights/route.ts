import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkUserQuota, incrementUserUsage } from "@/lib/ai-quota"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AIInsight {
  type: "opportunity" | "warning" | "action" | "achievement"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

interface AIInsightsResponse {
  summary: string
  insights: AIInsight[]
  cachedAt: string
  expiresAt: string
  fromCache: boolean
}

// ─── In-memory cache (5-minute TTL, per-user) ────────────────────────────────
//
// Note: this cache is per-process. On Vercel serverless, different instances
// won't share the cache, but the same instance typically handles the same
// user's recent traffic (warm lambdas), so it still significantly cuts LLM
// calls. For local dev and single-instance deployments it's perfect.

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: AIInsightsResponse
  expiresAt: number
}

const insightsCache = new Map<string, CacheEntry>()

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetch a compact, LLM-friendly snapshot of the user's analytics.
 *
 * Deliberately leaner than the /api/analytics GET handler, we only pull
 * what the AI needs to generate useful, grounded insights (no charts, no
 * notifications, no full task list).
 */
async function buildAnalyticsSnapshot(userId: string): Promise<AnalyticsSnapshot> {
  const [startup, tasks, appointments, resourceViews] = await Promise.all([
    db.startup.findUnique({ where: { userId } }),
    db.task.findMany({ where: { startup: { userId } } }),
    db.appointment.findMany({ where: { userId } }),
    db.resourceView.findMany({
      where: { userId },
      include: { resource: { select: { type: true, title: true } } },
    }),
  ])

  // Roadmap depends on startup id, fetch in a second round.
  const roadmapItems = startup?.id
    ? await db.roadmapItem.findMany({ where: { startupId: startup.id } })
    : []

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length
  const todoTasks = tasks.filter((t) => t.status === "TODO").length
  const completedRoadmapItems = roadmapItems.filter((r) => r.isCompleted).length
  const totalRoadmapItems = roadmapItems.length

  const totalTasksCompleted = completedTasks + completedRoadmapItems
  const totalTasksCount = tasks.length + totalRoadmapItems

  const completedAppointments = appointments.filter((a) => a.status === "COMPLETED").length
  const scheduledAppointments = appointments.filter((a) => a.status === "SCHEDULED").length

  const uniqueResourcesViewed = new Set(resourceViews.map((rv) => rv.resourceId)).size

  // Startup score (same algorithm as /api/analytics)
  const taskScore = totalTasksCount > 0 ? Math.round((totalTasksCompleted / totalTasksCount) * 25) : 0
  const appointmentScore = Math.min(completedAppointments * 5, 25)
  const resourceScore = Math.min(uniqueResourcesViewed * 3, 25)
  const profileScore =
    (startup?.vision ? 5 : 0) +
    (startup?.goals ? 5 : 0) +
    (startup?.industry ? 5 : 0) +
    (startup?.website ? 5 : 0) +
    (startup?.name && startup.name !== "My Startup" ? 5 : 0)
  const startupScore = Math.min(taskScore + appointmentScore + resourceScore + profileScore, 100)

  // Resource type breakdown
  const resourceByType: Record<string, number> = {}
  resourceViews.forEach((rv) => {
    const type = rv.resource?.type || "OTHER"
    resourceByType[type] = (resourceByType[type] || 0) + 1
  })

  // Upcoming appointments
  const now = new Date()
  const upcoming = appointments
    .filter((a) => a.status === "SCHEDULED" && new Date(a.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    .map((a) => ({
      type: a.type,
      date: new Date(a.date).toISOString(),
      duration: a.duration,
    }))

  // Recent roadmap items (first few pending, first few completed)
  const pendingRoadmap = roadmapItems
    .filter((r) => !r.isCompleted)
    .slice(0, 4)
    .map((r) => ({ title: r.title, phase: r.phase }))
  const recentCompleted = roadmapItems
    .filter((r) => r.isCompleted)
    .slice(-3)
    .map((r) => ({ title: r.title, phase: r.phase }))

  return {
    startup: startup
      ? {
          name: startup.name,
          industry: startup.industry,
          businessStage: startup.businessStage,
          revenueStage: startup.revenueStage,
          teamSize: startup.teamSize,
          hasVision: !!startup.vision,
          hasGoals: !!startup.goals,
          hasWebsite: !!startup.website,
          progress: startup.progress,
        }
      : null,
    startupScore,
    scoreBreakdown: {
      tasks: taskScore,
      appointments: appointmentScore,
      resources: resourceScore,
      profile: profileScore,
    },
    tasks: {
      completed: totalTasksCompleted,
      inProgress: inProgressTasks,
      todo: todoTasks + (totalRoadmapItems - completedRoadmapItems),
      total: totalTasksCount,
    },
    appointments: {
      completed: completedAppointments,
      scheduled: scheduledAppointments,
      upcoming,
    },
    resources: {
      uniqueViewed: uniqueResourcesViewed,
      byType: resourceByType,
    },
    roadmap: {
      completed: completedRoadmapItems,
      total: totalRoadmapItems,
      pending: pendingRoadmap,
      recentCompleted,
    },
  }
}

interface AnalyticsSnapshot {
  startup: {
    name: string
    industry: string | null
    businessStage: string | null
    revenueStage: string | null
    teamSize: string | null
    hasVision: boolean
    hasGoals: boolean
    hasWebsite: boolean
    progress: number
  } | null
  startupScore: number
  scoreBreakdown: { tasks: number; appointments: number; resources: number; profile: number }
  tasks: { completed: number; inProgress: number; todo: number; total: number }
  appointments: {
    completed: number
    scheduled: number
    upcoming: Array<{ type: string; date: string; duration: number }>
  }
  resources: { uniqueViewed: number; byType: Record<string, number> }
  roadmap: {
    completed: number
    total: number
    pending: Array<{ title: string; phase: string }>
    recentCompleted: Array<{ title: string; phase: string }>
  }
}

/**
 * Render the snapshot into a compact text block for the LLM.
 * We keep this short to conserve tokens, only what the AI needs to reason.
 */
function renderSnapshot(snapshot: AnalyticsSnapshot): string {
  const lines: string[] = []
  lines.push("USER ANALYTICS SNAPSHOT:")
  lines.push(`Startup score: ${snapshot.startupScore}/100`)
  lines.push(
    `Score breakdown, tasks: ${snapshot.scoreBreakdown.tasks}/25, appointments: ${snapshot.scoreBreakdown.appointments}/25, resources: ${snapshot.scoreBreakdown.resources}/25, profile: ${snapshot.scoreBreakdown.profile}/25`
  )

  if (snapshot.startup) {
    const s = snapshot.startup
    lines.push("")
    lines.push("STARTUP PROFILE:")
    lines.push(`Name: ${s.name}`)
    if (s.industry) lines.push(`Industry: ${s.industry}`)
    if (s.businessStage) lines.push(`Business stage: ${s.businessStage}`)
    if (s.revenueStage) lines.push(`Revenue stage: ${s.revenueStage}`)
    if (s.teamSize) lines.push(`Team size: ${s.teamSize}`)
    lines.push(
      `Profile completeness: vision=${s.hasVision}, goals=${s.hasGoals}, website=${s.hasWebsite}, progress=${s.progress}%`
    )
  } else {
    lines.push("")
    lines.push("STARTUP PROFILE: not set up yet")
  }

  lines.push("")
  lines.push(
    `TASKS: ${snapshot.tasks.completed} completed, ${snapshot.tasks.inProgress} in progress, ${snapshot.tasks.todo} to do (total ${snapshot.tasks.total})`
  )

  lines.push("")
  lines.push(
    `APPOINTMENTS: ${snapshot.appointments.completed} completed, ${snapshot.appointments.scheduled} scheduled`
  )
  if (snapshot.appointments.upcoming.length > 0) {
    lines.push("Upcoming appointments:")
    snapshot.appointments.upcoming.forEach((a) => {
      lines.push(`  - ${a.type} on ${a.date} (${a.duration}min)`)
    })
  }

  lines.push("")
  lines.push(`RESOURCES VIEWED: ${snapshot.resources.uniqueViewed} unique`)
  const types = Object.entries(snapshot.resources.byType)
  if (types.length > 0) {
    lines.push(`By type: ${types.map(([t, n]) => `${t}=${n}`).join(", ")}`)
  }

  lines.push("")
  lines.push(
    `ROADMAP: ${snapshot.roadmap.completed}/${snapshot.roadmap.total} items completed`
  )
  if (snapshot.roadmap.pending.length > 0) {
    lines.push("Pending items:")
    snapshot.roadmap.pending.forEach((r) => {
      lines.push(`  - ${r.title} (${r.phase})`)
    })
  }
  if (snapshot.roadmap.recentCompleted.length > 0) {
    lines.push("Recently completed:")
    snapshot.roadmap.recentCompleted.forEach((r) => {
      lines.push(`  - ${r.title} (${r.phase})`)
    })
  }

  return lines.join("\n")
}

const SYSTEM_PROMPT = `You are an expert startup advisor analyzing a founder's dashboard analytics. Your job is to generate 3-5 concise, actionable insights grounded in the SPECIFIC numbers in the snapshot, not generic advice.

RULES:
1. Every insight MUST reference a concrete data point from the snapshot (a score, a count, a specific roadmap item, a missing profile field, etc.). If you can't tie an insight to a specific number or fact in the snapshot, don't include it.
2. Be honest. If the founder is struggling (low completion rate, no appointments booked, no profile), say so directly but constructively.
3. Vary the insight types: include at least one "action" (next best step), at least one "opportunity" or "warning" if the data supports it, and at least one "achievement" if they've actually earned it (e.g. completed > 50% of tasks).
4. Each title should be 4-8 words, punchy. Each description should be 1-2 sentences referencing the specific data.
5. actionLabel (if any) should be 2-4 words like "Book a call" or "Update profile". actionHref should be a real dashboard path like "/dashboard/startup" or "/dashboard/appointments".
6. Return EXACTLY this JSON shape, no markdown fences, no commentary:
{
  "summary": "1-2 sentence honest assessment of where the founder is right now",
  "insights": [
    {
      "type": "opportunity" | "warning" | "action" | "achievement",
      "priority": "high" | "medium" | "low",
      "title": "Short headline",
      "description": "1-2 sentences grounded in their data",
      "actionLabel": "optional CTA",
      "actionHref": "optional path"
    }
  ]
}`

/**
 * Parse the LLM response into a validated AIInsightsResponse.
 * Falls back to a minimal valid response if parsing fails so the UI never
 * gets a malformed payload.
 */
function parseInsightsResponse(raw: string): { summary: string; insights: AIInsight[] } {
  // Try direct parse first
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.summary === "string" && Array.isArray(parsed.insights)) {
      return {
        summary: parsed.summary,
        insights: parsed.insights.slice(0, 5).map((i: any) => ({
          type: ["opportunity", "warning", "action", "achievement"].includes(i.type)
            ? i.type
            : "action",
          priority: ["high", "medium", "low"].includes(i.priority) ? i.priority : "medium",
          title: String(i.title || "Insight").slice(0, 120),
          description: String(i.description || "").slice(0, 400),
          actionLabel: i.actionLabel ? String(i.actionLabel).slice(0, 40) : undefined,
          actionHref: i.actionHref ? String(i.actionHref).slice(0, 200) : undefined,
        })),
      }
    }
  } catch {
    // not pure JSON
  }

  // Try to extract JSON from a markdown-fenced block
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch && fenceMatch[1]) {
    try {
      const parsed = JSON.parse(fenceMatch[1])
      if (parsed && typeof parsed.summary === "string" && Array.isArray(parsed.insights)) {
        return {
          summary: parsed.summary,
          insights: parsed.insights.slice(0, 5).map((i: any) => ({
            type: ["opportunity", "warning", "action", "achievement"].includes(i.type)
              ? i.type
              : "action",
            priority: ["high", "medium", "low"].includes(i.priority) ? i.priority : "medium",
            title: String(i.title || "Insight").slice(0, 120),
            description: String(i.description || "").slice(0, 400),
            actionLabel: i.actionLabel ? String(i.actionLabel).slice(0, 40) : undefined,
            actionHref: i.actionHref ? String(i.actionHref).slice(0, 200) : undefined,
          })),
        }
      }
    } catch {
      // give up
    }
  }

  // Fallback, return a generic safe insight so the UI isn't broken
  return {
    summary: "We couldn't generate AI insights right now. Try refreshing in a moment.",
    insights: [
      {
        type: "action",
        priority: "medium",
        title: "Refresh for fresh insights",
        description:
          "We had trouble generating personalized insights. Click refresh to try again.",
        actionLabel: "Refresh",
        actionHref: undefined,
      },
    ],
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const forceRefresh = req.nextUrl.searchParams.get("refresh") === "true"

    // ── Check cache first ───────────────────────────────────────────────
    if (!forceRefresh) {
      const cached = insightsCache.get(userId)
      const now = Date.now()
      if (cached && cached.expiresAt > now) {
        return NextResponse.json<AIInsightsResponse>({
          ...cached.data,
          fromCache: true,
        })
      }
    }

    // ── Enforce AI quota (counts as one AI message) ─────────────────────
    // We check BEFORE the LLM call. Only increment AFTER success.
    const quota = await checkUserQuota(userId, session.user.role)
    if (!quota.allowed) {
      // Don't blow away a valid cached entry if quota is exhausted, return
      // the stale cache instead of an error so the UI keeps working.
      const cached = insightsCache.get(userId)
      if (cached) {
        return NextResponse.json<AIInsightsResponse>({
          ...cached.data,
          fromCache: true,
        })
      }
      return NextResponse.json(
        { error: quota.message || "AI quota exhausted" },
        { status: 429 }
      )
    }

    // ── Build snapshot & call LLM ───────────────────────────────────────
    const snapshot = await buildAnalyticsSnapshot(userId)
    const snapshotText = renderSnapshot(snapshot)

    const userMessage = `Here is the founder's current analytics:\n\n${snapshotText}\n\nGenerate 3-5 personalized insights now. Return ONLY the JSON object.`

    let aiResponse: string
    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default
      const zai = await ZAI.create()
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      })
      aiResponse = completion.choices?.[0]?.message?.content || ""
    } catch (err) {
      console.error("AI insights LLM call failed:", err)
      // If we have a stale cache, return it rather than failing
      const cached = insightsCache.get(userId)
      if (cached) {
        return NextResponse.json<AIInsightsResponse>({
          ...cached.data,
          fromCache: true,
        })
      }
      return NextResponse.json(
        { error: "Failed to generate AI insights. Please try again." },
        { status: 502 }
      )
    }

    // ── Parse & validate ────────────────────────────────────────────────
    const { summary, insights } = parseInsightsResponse(aiResponse)

    // ── Increment quota only after success ──────────────────────────────
    await incrementUserUsage(userId)

    // ── Cache the result ────────────────────────────────────────────────
    const now = Date.now()
    const data: AIInsightsResponse = {
      summary,
      insights,
      cachedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + CACHE_TTL_MS).toISOString(),
      fromCache: false,
    }

    insightsCache.set(userId, {
      data,
      expiresAt: now + CACHE_TTL_MS,
    })

    return NextResponse.json<AIInsightsResponse>(data)
  } catch (error) {
    console.error("AI insights GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
