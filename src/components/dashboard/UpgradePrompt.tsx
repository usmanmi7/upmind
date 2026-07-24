"use client"

import * as React from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Crown,
  Rocket,
  Zap,
  ArrowRight,
  Check,
  Lock,
} from "lucide-react"

interface UpgradePromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature?: string
  description?: string
}

const planFeatures = [
  "Unlimited consultations",
  "Premium resource library",
  "Direct consultant chat",
  "Advanced analytics dashboard",
  "AI business plan generator",
  "Priority support",
  "Custom roadmap builder",
]

export function UpgradePrompt({
  open,
  onOpenChange,
  feature,
  description,
}: UpgradePromptProps) {
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
            Upgrade to Unlock
          </DialogTitle>
          <DialogDescription className="text-center">
            {description ||
              `${feature || "This feature"} is available on our paid plans. Upgrade now to get full access.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Feature Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#E8F5E9] to-[#DBEAFE] dark:from-[#1E3A8A]/20 dark:to-[#0F1B3D]/20 border border-[#3B82F6]/30 dark:border-[#1E3A8A]/50">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="size-4 text-[#1E3A8A] dark:text-[#3B82F6]" />
              <span className="text-sm font-semibold">You&apos;re missing out on</span>
            </div>
            <div className="space-y-2">
              {planFeatures.slice(0, 4).map((feat) => (
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
              <p className="text-[10px] text-muted-foreground">Basic access</p>
            </div>
            <div className="p-3 rounded-lg border border-[#3B82F6]/50 bg-[#E8F5E9] dark:bg-[#1E3A8A]/20 text-center relative">
              <Badge className="text-xs mb-1 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] border-0 text-[#0F1B3D]">
                <Sparkles className="size-3 mr-1" /> Pro
              </Badge>
              <p className="text-lg font-bold">$49</p>
              <p className="text-[10px] text-muted-foreground">Full access</p>
            </div>
          </div>

          {/* CTA */}
          <Button
            asChild
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] shadow-lg shadow-[#3B82F6]/25"
          >
            <Link href="/dashboard/subscription">
              <Rocket className="size-4 mr-2" />
              Upgrade Now
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>

          <p className="text-[10px] text-center text-muted-foreground">
            Cancel anytime. 14-day money-back guarantee.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Inline upgrade prompt for cards/sections
export function InlineUpgradePrompt({
  feature,
  onUpgrade,
}: {
  feature: string
  onUpgrade?: () => void
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-xl z-10 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center mx-auto mb-2">
            <Lock className="size-5 text-[#0F1B3D]" />
          </div>
          <p className="text-sm font-semibold mb-1">{feature}</p>
          <p className="text-xs text-muted-foreground mb-3">
            Available on Pro plan
          </p>
          <Button
            size="sm"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]"
            onClick={onUpgrade}
            asChild
          >
            <Link href="/dashboard/subscription">
              <Zap className="size-3 mr-1" /> Upgrade
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
