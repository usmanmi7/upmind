// AI Assistant quota helpers.
//
// Centralizes all DB access for the tiered AI quota system:
//   - Anonymous users: 1 free answer per IP, ever (tracked in AiGuestUsage).
//   - Logged-in users: monthly cap per plan, tracked in Subscription.
//
// Routes that need to enforce the quota should call the appropriate
// `checkXxxQuota` function *before* invoking the LLM, and the matching
// `incrementXxxUsage` function *after* the LLM call succeeds.

import { db } from "@/lib/db"
import {
  ANONYMOUS_AI_LIMIT,
  AI_ASSISTANT_LIMITS,
  getAiAssistantLimit,
  isAiQuotaExempt,
  getNextMonthReset,
  shouldResetQuota,
} from "@/lib/access-control"
import type { Plan } from "@prisma/client"

export interface QuotaCheckResult {
  allowed: boolean
  /** Reason for denial, when `allowed` is false. */
  reason?: "ANONYMOUS_USED" | "PLAN_EXHAUSTED"
  /** Human-readable message for the client. */
  message?: string
  /** Current usage snapshot, returned to the client for UI display. */
  usage: {
    plan: Plan | "ANONYMOUS"
    used: number
    limit: number
    remaining: number
    resetAt: string | null
    exempt: boolean
  }
}

// ─── Anonymous (public endpoint) ─────────────────────────────────────────────

/** Look up (or create) the anonymous usage record for an IP / identifier. */
async function getOrCreateGuestUsage(identifier: string) {
  // upsert to handle the race where two requests arrive simultaneously.
  return db.aiGuestUsage.upsert({
    where: { identifier },
    update: {},
    create: { identifier, usedCount: 0 },
  })
}

export async function checkAnonymousQuota(
  identifier: string
): Promise<QuotaCheckResult> {
  const record = await getOrCreateGuestUsage(identifier)
  const used = record.usedCount
  const limit = ANONYMOUS_AI_LIMIT
  const remaining = Math.max(0, limit - used)

  if (used >= limit) {
    return {
      allowed: false,
      reason: "ANONYMOUS_USED",
      message:
        "You've used your free AI answer. Create a free account to get 1 AI question per month — no credit card required. Upgrade to Growth Pro for 5/month or Enterprise for unlimited.",
      usage: {
        plan: "ANONYMOUS",
        used,
        limit,
        remaining: 0,
        resetAt: null,
        exempt: false,
      },
    }
  }

  return {
    allowed: true,
    usage: {
      plan: "ANONYMOUS",
      used,
      limit,
      remaining,
      resetAt: null,
      exempt: false,
    },
  }
}

/** Atomically increment the anonymous usage counter. Only call after the LLM
 * call has succeeded — otherwise errors would still consume the free quota. */
export async function incrementAnonymousUsage(identifier: string): Promise<void> {
  await db.aiGuestUsage.upsert({
    where: { identifier },
    update: {
      usedCount: { increment: 1 },
      lastUsedAt: new Date(),
    },
    create: {
      identifier,
      usedCount: 1,
    },
  })
}

// ─── Logged-in (authed endpoint) ─────────────────────────────────────────────

/** Look up the user's active subscription, creating a FREE one if missing. */
async function getOrCreateSubscription(userId: string) {
  return db.subscription.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      plan: "FREE",
      status: "ACTIVE",
      aiMessagesUsed: 0,
      aiMessagesResetAt: getNextMonthReset(),
    },
  })
}

export async function checkUserQuota(
  userId: string,
  userRole: string | null | undefined
): Promise<QuotaCheckResult> {
  // Admin / super admin bypass quota entirely.
  if (isAiQuotaExempt(userRole)) {
    return {
      allowed: true,
      usage: {
        plan: "ENTERPRISE",
        used: 0,
        limit: Infinity,
        remaining: Infinity,
        resetAt: null,
        exempt: true,
      },
    }
  }

  const sub = await getOrCreateSubscription(userId)
  const now = new Date()

  // If the reset window has elapsed, reset the counter before evaluating.
  let used = sub.aiMessagesUsed
  let resetAt = sub.aiMessagesResetAt
  if (shouldResetQuota(resetAt, now)) {
    used = 0
    resetAt = getNextMonthReset(now)
    await db.subscription.update({
      where: { userId },
      data: { aiMessagesUsed: 0, aiMessagesResetAt: resetAt },
    })
  }

  const limit = getAiAssistantLimit(sub.plan)
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used)

  if (used >= limit) {
    return {
      allowed: false,
      reason: "PLAN_EXHAUSTED",
      message:
        sub.plan === "FREE"
          ? `You've used your ${limit} free AI question this month. Upgrade to Growth Pro for 5 questions/month, or Enterprise for unlimited access.`
          : `You've used all ${limit} of your AI questions this month. Your quota resets on ${resetAt?.toLocaleDateString()}. Upgrade to Enterprise for unlimited access.`,
      usage: {
        plan: sub.plan,
        used,
        limit,
        remaining: 0,
        resetAt: resetAt?.toISOString() ?? null,
        exempt: false,
      },
    }
  }

  return {
    allowed: true,
    usage: {
      plan: sub.plan,
      used,
      limit,
      remaining,
      resetAt: resetAt?.toISOString() ?? null,
      exempt: false,
    },
  }
}

/** Atomically increment the user's monthly counter. Only call after the LLM
 * call has succeeded. */
export async function incrementUserUsage(userId: string): Promise<void> {
  // Reset the window too if it has elapsed — defensive, checkUserQuota already
  // does this, but we don't want a stale counter to be incremented past the
  // boundary if the two calls straddle midnight on the 1st of the month.
  const sub = await db.subscription.findUnique({ where: { userId } })
  if (!sub) return

  const now = new Date()
  if (shouldResetQuota(sub.aiMessagesResetAt, now)) {
    await db.subscription.update({
      where: { userId },
      data: {
        aiMessagesUsed: 1,
        aiMessagesResetAt: getNextMonthReset(now),
      },
    })
    return
  }

  await db.subscription.update({
    where: { userId },
    data: { aiMessagesUsed: { increment: 1 } },
  })
}

// Re-export the constants for convenience in route handlers.
export { ANONYMOUS_AI_LIMIT, AI_ASSISTANT_LIMITS }
