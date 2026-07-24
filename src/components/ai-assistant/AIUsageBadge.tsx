"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sparkles,
  Crown,
  Rocket,
  Zap,
  ArrowRight,
  Check,
  Lock,
  Zap as ZapIcon,
} from "lucide-react"

export interface AiUsage {
  plan: "FREE" | "GROWTH_PRO" | "ENTERPRISE" | "ANONYMOUS"
  used: number
  limit: number // Infinity for unlimited
  remaining: number
  resetAt: string | null
  exempt: boolean
  authenticated?: boolean
}

interface AIUsageBadgeProps {
  usage: AiUsage | null
  loading?: boolean
  variant?: "badge" | "pill"
  className?: string
}

const PLAN_LABELS: Record<AiUsage["plan"], string> = {
  FREE: "Free",
  GROWTH_PRO: "Growth Pro",
  ENTERPRISE: "Enterprise",
  ANONYMOUS: "Guest",
}

const PLAN_COLORS: Record<AiUsage["plan"], string> = {
  FREE: "bg-muted text-muted-foreground border-muted",
  GROWTH_PRO:
    "bg-gradient-to-r from-[#3B82F6]/15 to-[#1E3A8A]/15 text-[#1E3A8A] dark:text-[#3B82F6] border-[#3B82F6]/40",
  ENTERPRISE:
    "bg-gradient-to-r from-amber-400/15 to-orange-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40",
  ANONYMOUS: "bg-muted text-muted-foreground border-muted",
}

/** Renders a small "3 / 5 used · Growth Pro" badge. Shows ∞ for unlimited. */
export function AIUsageBadge({
  usage,
  loading,
  variant = "badge",
  className,
}: AIUsageBadgeProps) {
  if (loading || !usage) {
    return (
      <Badge variant="outline" className={`h-6 ${className ?? ""}`}>
        <Sparkles className="size-3 mr-1 animate-pulse" />
        …
      </Badge>
    )
  }

  if (usage.exempt || usage.limit === Infinity) {
    return (
      <Badge
        variant="outline"
        className={`h-6 ${PLAN_COLORS[usage.plan]} ${className ?? ""}`}
        title="Unlimited AI usage"
      >
        <Crown className="size-3 mr-1" />
        Unlimited
      </Badge>
    )
  }

  const remaining = Math.max(0, usage.remaining)
  const exhausted = remaining === 0

  return (
    <Badge
      variant="outline"
      className={`h-6 ${exhausted ? "border-red-300 text-red-600 dark:text-red-400" : PLAN_COLORS[usage.plan]} ${className ?? ""}`}
      title={`${usage.used} of ${usage.limit} used this month`}
    >
      <Sparkles className={`size-3 mr-1 ${exhausted ? "text-red-500" : ""}`} />
      {usage.used} / {usage.limit}
      {variant === "pill" && (
        <span className="ml-1 opacity-70">· {PLAN_LABELS[usage.plan]}</span>
      )}
    </Badge>
  )
}

// ─── Upgrade Modal ─────────────────────────────────────────────────────────

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Message from the API explaining why the user is blocked. */
  reason?: string
  /** Current plan, used to choose the right CTA copy. */
  currentPlan?: AiUsage["plan"]
}

const planFeatures = [
  "Unlimited AI consultations",
  "Premium resource library",
  "Direct consultant chat",
  "Advanced analytics dashboard",
  "AI business plan generator",
  "Priority support",
  "Custom roadmap builder",
]

export function AIUpgradeDialog({
  open,
  onOpenChange,
  reason,
  currentPlan,
}: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#1E3A8A] to-[#93C5FD] flex items-center justify-center shadow-lg shadow-[#3B82F6]/25">
              <Crown className="size-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-heading">
            {currentPlan === "ANONYMOUS"
              ? "Create a free account"
              : "Upgrade to unlock more"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {reason ||
              (currentPlan === "ANONYMOUS"
                ? "You've used your free AI answer. Sign up to get 1 AI question every month — no credit card required."
                : "You've reached your monthly AI question limit. Upgrade to keep getting personalized startup advice.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Feature Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#E8F5E9] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#0F1B3D]/20 border border-[#3B82F6]/30 dark:border-[#1E3A8A]/50">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="size-4 text-[#1E3A8A] dark:text-[#3B82F6]" />
              <span className="text-sm font-semibold">
                {currentPlan === "ANONYMOUS"
                  ? "With a free account you get"
                  : "You're missing out on"}
              </span>
            </div>
            <div className="space-y-2">
              {planFeatures
                .slice(0, currentPlan === "ANONYMOUS" ? 3 : 4)
                .map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#3B82F6] shrink-0" />
                    <span className="text-sm text-muted-foreground">{feat}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Plans Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-muted bg-muted/30 text-center">
              <Badge variant="outline" className="text-xs mb-1">
                Free
              </Badge>
              <p className="text-lg font-bold">$0</p>
              <p className="text-[10px] text-muted-foreground">1 AI Q&amp;A/mo</p>
            </div>
            <div className="p-3 rounded-lg border border-[#3B82F6]/50 bg-[#E8F5E9] dark:bg-[#1E3A8A]/20 text-center relative">
              <Badge className="text-xs mb-1 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] border-0 text-[#0F1B3D]">
                <Sparkles className="size-3 mr-1" /> Growth Pro
              </Badge>
              <p className="text-lg font-bold">$49</p>
              <p className="text-[10px] text-muted-foreground">5 AI Q&amp;A/mo</p>
            </div>
          </div>

          {/* CTA */}
          {currentPlan === "ANONYMOUS" ? (
            <Button
              asChild
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] shadow-lg shadow-[#3B82F6]/25"
            >
              <Link href="/auth/signup">
                <Rocket className="size-4 mr-2" />
                Create free account
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] shadow-lg shadow-[#3B82F6]/25"
            >
              <Link href="/dashboard/subscription">
                <Zap className="size-4 mr-2" />
                Upgrade now
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          )}

          <p className="text-[10px] text-center text-muted-foreground">
            {currentPlan === "ANONYMOUS"
              ? "Takes 30 seconds. No credit card required."
              : "Cancel anytime. 14-day money-back guarantee."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Re-export to satisfy unused-import linter when used inline.
export { ZapIcon }
