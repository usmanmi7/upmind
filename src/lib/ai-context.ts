import { db } from "@/lib/db"
import { AI_SYSTEM_PROMPT } from "@/lib/ai-prompt"

/**
 * User-specific context builder for the authenticated AI route.
 *
 * Pulls the logged-in user's profile, startup, subscription plan, recent
 * roadmap progress, and last conversation topic, then formats it as a
 * compact block injected into the system prompt.
 *
 * Why this matters: the AI stops giving generic advice and starts saying
 * things like "Since you're pre-revenue with a 4-person team in fintech…"
 * which makes it feel like a real advisor who knows the founder.
 *
 * All fetches are wrapped so a missing piece (no Startup yet, etc.) just
 * gets skipped instead of breaking the whole prompt.
 */

export interface UserContext {
  name: string
  email: string
  role: string
  country?: string | null
  bio?: string | null
  plan?: string
  subscriptionStatus?: string
  startup?: {
    name: string
    industry?: string | null
    teamSize?: string | null
    businessStage?: string | null
    revenueStage?: string | null
    vision?: string | null
    goals?: string | null
    website?: string | null
    progress?: number
  }
  roadmap?: {
    completedCount: number
    totalCount: number
    currentPhase?: string
    recentItems: Array<{ title: string; phase: string; isCompleted: boolean }>
  }
  recentChatTopic?: string
}

/**
 * Fetch everything we know about the user that's relevant to giving them
 * tailored startup advice. Returns null if the user lookup itself fails
 * (caller should fall back to the generic system prompt in that case).
 */
export async function fetchUserContext(
  userId: string
): Promise<UserContext | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        country: true,
        bio: true,
        startup: {
          select: {
            id: true,
            name: true,
            industry: true,
            teamSize: true,
            businessStage: true,
            revenueStage: true,
            vision: true,
            goals: true,
            website: true,
            progress: true,
            roadmapItems: {
              select: {
                id: true,
                title: true,
                phase: true,
                isCompleted: true,
                order: true,
              },
              orderBy: [{ isCompleted: "asc" }, { order: "asc" }],
              take: 6,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
      },
    })

    if (!user) return null

    // Compute roadmap progress
    let roadmap: UserContext["roadmap"] | undefined
    if (user.startup) {
      const allItems = user.startup.roadmapItems || []
      const completed = allItems.filter((i) => i.isCompleted)
      const firstIncomplete = allItems.find((i) => !i.isCompleted)
      roadmap = {
        completedCount: completed.length,
        totalCount: allItems.length,
        currentPhase: firstIncomplete?.phase,
        recentItems: allItems.slice(0, 5).map((i) => ({
          title: i.title,
          phase: i.phase,
          isCompleted: i.isCompleted,
        })),
      }
    }

    // Last chat topic (most recent chat title) — gives the AI a sense of
    // continuity across sessions.
    const lastChat = await db.chat.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { title: true },
    })

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      bio: user.bio,
      plan: user.subscription?.plan,
      subscriptionStatus: user.subscription?.status,
      startup: user.startup
        ? {
            name: user.startup.name,
            industry: user.startup.industry,
            teamSize: user.startup.teamSize,
            businessStage: user.startup.businessStage,
            revenueStage: user.startup.revenueStage,
            vision: user.startup.vision,
            goals: user.startup.goals,
            website: user.startup.website,
            progress: user.startup.progress,
          }
        : undefined,
      roadmap,
      recentChatTopic: lastChat?.title,
    }
  } catch (err) {
    // Fail soft — if the DB is unreachable or a field is missing, just
    // return null so the caller falls back to the generic prompt.
    console.error("fetchUserContext failed:", err)
    return null
  }
}

/**
 * Render a UserContext into a compact text block for injection into the
 * system prompt. Returns an empty string if the context is null.
 *
 * The block is structured so the model can reason about it naturally:
 *   "You are talking to [name], founder of [startup] in [industry]…"
 */
export function renderUserContext(ctx: UserContext | null): string {
  if (!ctx) return ""

  const lines: string[] = []

  lines.push(`YOU ARE TALKING TO A SPECIFIC USER — use this to personalize your advice:`)
  lines.push(`User name: ${ctx.name}`)
  if (ctx.bio) lines.push(`Bio: ${truncate(ctx.bio, 240)}`)
  if (ctx.country) lines.push(`Location: ${ctx.country}`)
  if (ctx.plan) {
    lines.push(`Upmind plan: ${ctx.plan}${ctx.subscriptionStatus ? ` (${ctx.subscriptionStatus.toLowerCase()})` : ""}`)
  }

  if (ctx.startup) {
    const s = ctx.startup
    lines.push("")
    lines.push(`STARTUP:`)
    lines.push(`Name: ${s.name}`)
    if (s.industry) lines.push(`Industry: ${s.industry}`)
    if (s.businessStage) lines.push(`Business stage: ${s.businessStage}`)
    if (s.revenueStage) lines.push(`Revenue stage: ${s.revenueStage}`)
    if (s.teamSize) lines.push(`Team size: ${s.teamSize}`)
    if (s.website) lines.push(`Website: ${s.website}`)
    if (s.vision) lines.push(`Vision: ${truncate(s.vision, 280)}`)
    if (s.goals) lines.push(`Goals: ${truncate(s.goals, 280)}`)
    if (typeof s.progress === "number") {
      lines.push(`Roadmap progress: ${s.progress}%`)
    }
  } else {
    lines.push("")
    lines.push(`STARTUP: not yet set up. If relevant, encourage the user to complete their startup profile in the dashboard.`)
  }

  if (ctx.roadmap && ctx.roadmap.totalCount > 0) {
    const r = ctx.roadmap
    lines.push("")
    lines.push(`ROADMAP: ${r.completedCount}/${r.totalCount} items completed${r.currentPhase ? `, currently in "${r.currentPhase}" phase` : ""}.`)
    if (r.recentItems.length > 0) {
      lines.push(`Recent roadmap items:`)
      for (const item of r.recentItems) {
        const mark = item.isCompleted ? "[done]" : "[active]"
        lines.push(`  - ${mark} ${item.title} (${item.phase})`)
      }
    }
  }

  if (ctx.recentChatTopic && ctx.recentChatTopic !== "New chat") {
    lines.push("")
    lines.push(`LAST CONVERSATION TOPIC: "${ctx.recentChatTopic}" — if relevant, you can reference what you discussed before.`)
  }

  lines.push("")
  lines.push(`HOW TO USE THIS CONTEXT:`)
  lines.push(`- Address the user by their first name occasionally, not every message.`)
  lines.push(`- Reference their startup, industry, and stage when giving advice — don't give generic answers a stranger would give.`)
  lines.push(`- If they're stuck on a roadmap item, address that specifically.`)
  lines.push(`- Don't invent facts about them. If the context above is empty on something, ask, don't assume.`)
  lines.push(`- The INTERVIEW-FIRST protocol in your system prompt applies — but skip any question whose answer is already in the context block above. You already know this user's industry, stage, team size, etc. — don't re-ask those. Only ask about the SPECIFIC PROBLEM they want help with right now.`)

  return lines.join("\n")
}

/**
 * Build the full system prompt for the authenticated route.
 * Combines the base AI_SYSTEM_PROMPT with the user's personalized context.
 */
export async function buildAuthedSystemPrompt(
  userId: string
): Promise<string> {
  const ctx = await fetchUserContext(userId)
  const userBlock = renderUserContext(ctx)
  if (!userBlock) return AI_SYSTEM_PROMPT
  return `${AI_SYSTEM_PROMPT}

${userBlock}`
}

// ─── History management ──────────────────────────────────────────────────────

/**
 * Summarize older messages when a chat grows too long.
 *
 * NVIDIA GLM-5.2 has an ~128K context window but we cap history at 10
 * messages for token cost. When a chat exceeds MESSAGE_CAP, the oldest
 * messages (everything before the most recent N) get squashed into a
 * single system message that summarizes what was discussed.
 *
 * This is a simple heuristic summarizer — it doesn't call the LLM. It
 * extracts the user's questions and the assistant's headings/first
 * sentences so the model has a rough sense of the conversation arc
 * without burning tokens on full old messages.
 */

export const MESSAGE_CAP = 10 // Keep the most recent N messages verbatim
export const SUMMARY_TRIGGER = 12 // Summarize when history exceeds this

interface HistoryMessage {
  role: string
  content: string
}

/**
 * Take the full history and return a trimmed version with a summary prefix
 * if needed. Returns the trimmed history (no summary if below threshold).
 *
 * The summary, when present, is returned as the first item in the array
 * with role "system" so the model treats it as context, not a turn.
 */
export function trimHistoryWithSummary(
  history: HistoryMessage[]
): HistoryMessage[] {
  if (history.length <= SUMMARY_TRIGGER) {
    return history.slice(-MESSAGE_CAP)
  }

  // Split: old messages to summarize, recent messages to keep verbatim.
  const recentStart = Math.max(0, history.length - MESSAGE_CAP)
  const oldMessages = history.slice(0, recentStart)
  const recentMessages = history.slice(recentStart)

  const summary = summarizeMessages(oldMessages)

  return [
    { role: "system", content: summary },
    ...recentMessages,
  ]
}

/**
 * Heuristic summarizer. Doesn't call the LLM — just extracts the gist of
 * each old message so the model has continuity context cheaply.
 *
 * For user messages: keep the first ~120 chars (usually the question).
 * For assistant messages: try to extract a heading or first sentence.
 */
function summarizeMessages(messages: HistoryMessage[]): string {
  const points: string[] = []

  for (const msg of messages) {
    if (msg.role === "user") {
      const snippet = truncate(msg.content.replace(/\s+/g, " ").trim(), 140)
      if (snippet) points.push(`User asked: "${snippet}"`)
    } else if (msg.role === "assistant") {
      // Try to parse a heading from a structured JSON response
      const heading = tryExtractHeading(msg.content)
      if (heading) {
        points.push(`AI answered: "${heading}"`)
      } else {
        const snippet = truncate(
          msg.content.replace(/\s+/g, " ").trim(),
          100
        )
        if (snippet) points.push(`AI replied: "${snippet}"`)
      }
    }
  }

  if (points.length === 0) {
    return "EARLIER CONVERSATION SUMMARY: (no extractable content)"
  }

  return `EARLIER CONVERSATION SUMMARY (so you have continuity — these messages have been compressed to save context):
${points.map((p) => `  - ${p}`).join("\n")}

Reference this if the user asks about something you discussed earlier, but don't repeat it verbatim.`
}

/**
 * Try to extract the "heading" field from a JSON-stringified structured
 * response. Returns undefined if not parseable.
 */
function tryExtractHeading(content: string): string | undefined {
  try {
    // The structuredJson field is stored as a JSON string. If content
    // parses as JSON and has a heading field, return it.
    const trimmed = content.trim()
    if (!trimmed.startsWith("{")) return undefined
    const parsed = JSON.parse(trimmed)
    if (typeof parsed?.heading === "string" && parsed.heading.trim()) {
      return truncate(parsed.heading.trim(), 100)
    }
  } catch {
    // Not JSON — fall through
  }

  // Try regex extraction as a fallback (handles malformed JSON)
  const m = content.match(/"heading"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  if (m && m[1]) {
    return truncate(m[1].replace(/\\"/g, '"').trim(), 100)
  }

  return undefined
}

/**
 * Generate a short "continue where we left off" summary shown to the user
 * when they reopen an old chat. Returns null if there are no messages.
 *
 * This is a HEURISTIC summary, not LLM-generated, so it's instant and free.
 * Returns something like:
 *   "Last we talked about 'Finding your first 100 users'. The user asked
 *    about cold outreach, and the AI gave a 5-step playbook."
 */
export function buildReopenSummary(
  messages: Array<{ role: string; content: string }>
): string | null {
  if (messages.length === 0) return null

  const userMessages = messages.filter((m) => m.role === "user")
  const aiMessages = messages.filter((m) => m.role === "assistant")

  if (userMessages.length === 0 && aiMessages.length === 0) return null

  const lastUser = userMessages[userMessages.length - 1]
  const lastAi = aiMessages[aiMessages.length - 1]

  const parts: string[] = []

  if (lastUser) {
    const q = truncate(
      lastUser.content.replace(/\s+/g, " ").trim(),
      120
    )
    parts.push(`Last you asked: "${q}"`)
  }

  if (lastAi) {
    const heading = tryExtractHeading(lastAi.content)
    if (heading) {
      parts.push(`AI gave: "${heading}"`)
    }
  }

  if (parts.length === 0) return null

  return `Picking up where we left off. ${parts.join(". ")}.`
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + "…"
}
