import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkAnonymousQuota, checkUserQuota } from "@/lib/ai-quota"

export const runtime = "nodejs"

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

/**
 * GET /api/ai/usage
 *
 * Returns the caller's current AI assistant quota:
 *   - Authenticated users: their plan's monthly cap + current usage.
 *   - Anonymous users: the 1-free-answer-per-IP cap + current usage.
 *
 * Used by both the dashboard AI page and the public AI page to render
 * the "X / Y used this month" badge and the upgrade / sign-up CTAs.
 */
export async function GET(req: NextRequest) {
  try {
    // ─── Try authenticated path first ───
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      const quota = await checkUserQuota(
        session.user.id,
        (session.user as { role?: string }).role
      )
      return NextResponse.json({
        authenticated: true,
        ...quota.usage,
      })
    }

    // ─── Fall back to anonymous (IP-based) ───
    const ip = getClientIP(req)
    const quota = await checkAnonymousQuota(ip)
    return NextResponse.json({
      authenticated: false,
      ...quota.usage,
    })
  } catch (error: unknown) {
    console.error("AI usage lookup error:", error)
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    )
  }
}
