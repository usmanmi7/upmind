// AI Assistant quota helpers (stubbed — quota system disabled).
//
// Per product direction, the AI Assistant is unlimited for all users
// (logged-in and anonymous). These helpers exist for backwards
// compatibility with route handlers that still import them, but they
// always allow and report Infinity limits.
//
// If a tiered quota system is reintroduced, restore the original
// implementation from git history.

import type { Plan } from "@prisma/client"

export const ANONYMOUS_AI_LIMIT = Infinity
export const AI_ASSISTANT_LIMITS: Record<Plan, number> = {
  FREE: Infinity,
  GROWTH_PRO: Infinity,
  ENTERPRISE: Infinity,
}

export interface QuotaCheckResult {
  allowed: boolean
  reason?: "ANONYMOUS_USED" | "PLAN_EXHAUSTED"
  message?: string
  usage: {
    plan: Plan | "ANONYMOUS"
    used: number
    limit: number
    remaining: number
    resetAt: string | null
    exempt: boolean
  }
}

export async function checkAnonymousQuota(
  _identifier: string
): Promise<QuotaCheckResult> {
  return {
    allowed: true,
    usage: {
      plan: "ANONYMOUS",
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      resetAt: null,
      exempt: true,
    },
  }
}

export async function incrementAnonymousUsage(_identifier: string): Promise<void> {
  // No-op — quota disabled.
  return
}

export async function checkUserQuota(
  userId: string,
  userRole: string | null | undefined
): Promise<QuotaCheckResult> {
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN"
  return {
    allowed: true,
    usage: {
      plan: isAdmin ? "ENTERPRISE" : "FREE",
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      resetAt: null,
      exempt: true,
    },
  }
}

export async function incrementUserUsage(_userId: string): Promise<void> {
  // No-op — quota disabled.
  return
}

// Re-export the constants for convenience in route handlers.
export { ANONYMOUS_AI_LIMIT, AI_ASSISTANT_LIMITS }
