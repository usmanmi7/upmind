"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  CheckCircle2,
  CreditCard,
  Zap,
  Crown,
  Building2,
  Download,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
  PartyPopper,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import {
  PLANS,
  PLAN_LIST,
  type PlanKey,
  isUpgrade,
  isDowngrade,
  getGainedFeatures,
  getLostFeatures,
  getPlan,
} from "@/lib/plans"

interface SubscriptionData {
  subscription: {
    id: string
    plan: string
    status: string
    startDate: string
    endDate: string | null
    autoRenew: boolean
  } | null
  usage: {
    consultations: { used: number; limit: number }
    resources: { used: number; limit: number }
    documents: { used: number; limit: number }
    teamMembers: { used: number; limit: number }
  }
  payments: Array<{
    id: string
    amount: number
    currency: string
    status: string
    method: string | null
    date: string
  }>
}

type ChangePlanAction = "upgrade" | "downgrade"

export default function SubscriptionPage() {
  const { update: updateSession } = useSession()
  const [data, setData] = React.useState<SubscriptionData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [togglingAutoRenew, setTogglingAutoRenew] = React.useState(false)

  // Plan change state
  const [selectedPlan, setSelectedPlan] = React.useState<PlanKey | null>(null)
  const [changeDialogOpen, setChangeDialogOpen] = React.useState(false)
  const [confirmDowngrade, setConfirmDowngrade] = React.useState(false)
  const [changing, setChanging] = React.useState(false)

  // Success dialog state
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false)
  const [successData, setSuccessData] = React.useState<{
    action: string
    fromPlan: string
    toPlan: string
    prorationAmount: number
  } | null>(null)

  const currentPlan = (data?.subscription?.plan || "FREE") as PlanKey

  const fetchSubscription = React.useCallback(async () => {
    try {
      const res = await fetch("/api/subscription")
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const handleToggleAutoRenew = async () => {
    setTogglingAutoRenew(true)
    try {
      const res = await fetch("/api/subscription", { method: "PUT" })
      if (res.ok) {
        const result = await res.json()
        setData((prev) =>
          prev
            ? {
                ...prev,
                subscription: result.subscription || prev.subscription
                  ? { ...(prev.subscription || {}), autoRenew: result.subscription?.autoRenew ?? !prev.subscription?.autoRenew } as SubscriptionData["subscription"]
                  : null,
              }
            : prev
        )
        toast.success(result.subscription?.autoRenew ? "Auto-renew enabled" : "Auto-renew disabled")
      }
    } catch (err) {
      console.error("Failed to toggle auto-renew:", err)
      toast.error("Failed to update auto-renew")
    } finally {
      setTogglingAutoRenew(false)
    }
  }

  const handlePlanSelect = (planKey: PlanKey) => {
    if (planKey === currentPlan) return
    setSelectedPlan(planKey)
    setConfirmDowngrade(false)
    setChangeDialogOpen(true)
  }

  const handleChangePlan = async () => {
    if (!selectedPlan) return

    // If downgrade, ensure checkbox is checked
    if (isDowngrade(currentPlan, selectedPlan) && !confirmDowngrade) return

    setChanging(true)
    try {
      const res = await fetch("/api/subscription/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetPlan: selectedPlan,
          confirmedDowngrade: isDowngrade(currentPlan, selectedPlan),
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        if (result.needsConfirmation) {
          toast.error("Please confirm the downgrade by checking the box below.")
        } else {
          toast.error(result.error || "Failed to change plan")
        }
        return
      }

      // Close the change dialog and show success
      setChangeDialogOpen(false)
      setSuccessData({
        action: result.action,
        fromPlan: result.fromPlan,
        toPlan: result.toPlan,
        prorationAmount: result.prorationAmount,
      })
      setSuccessDialogOpen(true)

      // Refresh session to update role in JWT (for sidebar upgrade card)
      await updateSession()

      // Refresh data
      await fetchSubscription()
    } catch (err) {
      console.error("Failed to change plan:", err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setChanging(false)
    }
  }

  const planName = currentPlan === "GROWTH_PRO" ? "Growth Pro" : currentPlan === "ENTERPRISE" ? "Enterprise" : "Free"
  const planPrice = PLANS[currentPlan]?.price || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
          <p className="text-sm text-muted-foreground">Loading subscription...</p>
        </div>
      </div>
    )
  }

  const formatLimit = (limit: number) => (limit === Infinity ? "∞" : limit)

  // Compute change plan dialog details
  const selectedPlanConfig = selectedPlan ? PLANS[selectedPlan] : null
  const changeAction: ChangePlanAction | null = selectedPlan
    ? isUpgrade(currentPlan, selectedPlan)
      ? "upgrade"
      : isDowngrade(currentPlan, selectedPlan)
        ? "downgrade"
        : null
    : null

  const gainedFeatures = selectedPlan && changeAction === "upgrade"
    ? getGainedFeatures(currentPlan, selectedPlan)
    : []
  const lostFeatures = selectedPlan && changeAction === "downgrade"
    ? getLostFeatures(currentPlan, selectedPlan)
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your plan, billing, and usage</p>
      </div>

      {/* Current Plan */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                <Crown className="size-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-heading font-bold">{planName}</h2>
                  <Badge className={
                    data?.subscription?.status === "ACTIVE"
                      ? "bg-green-500 text-white text-xs"
                      : "bg-muted text-muted-foreground text-xs"
                  }>
                    {data?.subscription?.status || "Active"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {planPrice === 0 ? "Free forever" : `$${planPrice}/month`}
                  {data?.subscription?.endDate && planPrice > 0 && ` · Renews ${new Date(data.subscription.endDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.usage ? [
          { label: "Consultations", used: data.usage.consultations.used, total: data.usage.consultations.limit },
          { label: "Resources Downloaded", used: data.usage.resources.used, total: data.usage.resources.limit },
          { label: "Documents", used: data.usage.documents.used, total: data.usage.documents.limit },
          { label: "Team Members", used: data.usage.teamMembers.used, total: data.usage.teamMembers.limit },
        ].map((metric) => {
          const pct = typeof metric.total === "number" && metric.total > 0 ? Math.round((metric.used / metric.total) * 100) : 0
          const isNearLimit = typeof metric.total === "number" && pct >= 80
          return (
            <Card key={metric.label} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-lg font-bold">
                  {metric.used} <span className="text-sm text-muted-foreground font-normal">/ {formatLimit(metric.total)}</span>
                </p>
                {typeof metric.total === "number" && (
                  <div className="mt-2">
                    <Progress value={Math.min(pct, 100)} className={`h-1.5 ${isNearLimit ? "[&>div]:bg-yellow-500" : ""}`} />
                    {isNearLimit && (
                      <p className="text-[10px] text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="size-3" /> Approaching limit
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        }) : (
          <Card className="col-span-full border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Unable to load usage data</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Plan Comparison with Working Buttons */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Compare Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLAN_LIST.map((plan) => {
              const isCurrent = plan.key === currentPlan
              const action = isCurrent ? null : isUpgrade(currentPlan, plan.key) ? "upgrade" : "downgrade"
              return (
                <div
                  key={plan.key}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                    isCurrent
                      ? "border-[#7CFC00] bg-[#E8F5E9]/50 dark:bg-[#2D4A2D]/10"
                      : action === "upgrade"
                        ? "border-transparent bg-muted/30 hover:border-[#7CFC00]/40 hover:shadow-md"
                        : "border-transparent bg-muted/30 hover:border-yellow-500/40 hover:shadow-md"
                  }`}
                >
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[#7CFC00] text-[#1A2E1A] text-[10px] font-semibold px-2">Popular</Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <plan.icon className="size-5 text-[#7CFC00]" />
                    <h3 className="font-heading font-semibold">{plan.name}</h3>
                    {isCurrent && <Badge className="bg-[#7CFC00] text-white text-[10px]">Current</Badge>}
                  </div>
                  <p className="text-lg font-bold mb-1">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                    {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-3.5 text-green-500 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isCurrent ? "default" : action === "upgrade" ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${
                      isCurrent
                        ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] cursor-default"
                        : action === "upgrade"
                          ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] hover:opacity-90"
                          : "hover:border-yellow-500 hover:text-yellow-600"
                    }`}
                    disabled={isCurrent}
                    onClick={() => !isCurrent && handlePlanSelect(plan.key)}
                  >
                    {isCurrent ? (
                      "Current Plan"
                    ) : action === "upgrade" ? (
                      <span className="flex items-center gap-1.5">
                        <ArrowUpRight className="size-4" /> Upgrade to {plan.name}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <ArrowDownRight className="size-4" /> Downgrade
                      </span>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method & Auto-renew */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <CreditCard className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {data?.payments?.length ? `Card on file` : "No payment method"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentPlan === "FREE" ? "Add a payment method to upgrade" : "Manage your payment details"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-renew</p>
              <p className="text-xs text-muted-foreground">Automatically renew your subscription</p>
            </div>
            <Switch
              checked={data?.subscription?.autoRenew ?? true}
              onCheckedChange={handleToggleAutoRenew}
              disabled={togglingAutoRenew || currentPlan === "FREE"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.payments && data.payments.length > 0 ? (
            <div className="space-y-3">
              {data.payments.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {planName} — {item.method || "Payment"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {item.currency === "USD" ? "$" : item.currency}{item.amount.toFixed(2)}
                    </span>
                    {item.status === "COMPLETED" && (
                      <Button variant="ghost" size="icon" className="size-7">
                        <Download className="size-3.5" />
                      </Button>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No billing history yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Your payment history will appear here after your first payment</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== UPGRADE DIALOG ===== */}
      <Dialog open={changeDialogOpen && changeAction === "upgrade"} onOpenChange={(open) => { if (!open) setChangeDialogOpen(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg">Upgrade to {selectedPlanConfig?.name}</DialogTitle>
                <DialogDescription>Review your upgrade details</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Price Change */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Current</p>
                <p className="text-sm font-semibold">{PLANS[currentPlan].name}</p>
                <p className="text-lg font-bold">${PLANS[currentPlan].price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              </div>
              <div className="px-3">
                <ArrowUpRight className="size-5 text-[#7CFC00]" />
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">New</p>
                <p className="text-sm font-semibold">{selectedPlanConfig?.name}</p>
                <p className="text-lg font-bold text-[#7CFC00]">${selectedPlanConfig?.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              </div>
            </div>

            {/* What You'll Gain */}
            {gainedFeatures.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-[#7CFC00]" />
                  What you&apos;ll gain
                </p>
                <div className="space-y-1.5">
                  {gainedFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proration Info */}
            {PLANS[currentPlan].price > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Prorated billing</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  You&apos;ll only be charged the difference for the remaining days in your current billing period.
                  The new rate of ${selectedPlanConfig?.price}/mo starts on your next billing date.
                </p>
              </div>
            )}

            {PLANS[currentPlan].price === 0 && selectedPlanConfig && selectedPlanConfig.price > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Billing starts today</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Your card will be charged ${selectedPlanConfig.price}.00 today. You can cancel anytime.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setChangeDialogOpen(false)} disabled={changing}>
              Cancel
            </Button>
            <Button
              onClick={handleChangePlan}
              disabled={changing}
              className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] hover:opacity-90"
            >
              {changing ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="size-4 mr-2" />
              )}
              {changing ? "Upgrading..." : "Confirm Upgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DOWNGRADE DIALOG ===== */}
      <Dialog open={changeDialogOpen && changeAction === "downgrade"} onOpenChange={(open) => { if (!open) setChangeDialogOpen(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <DialogTitle className="text-lg">Downgrade to {selectedPlanConfig?.name}</DialogTitle>
                <DialogDescription>Please review what you&apos;ll lose before confirming</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Price Change */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Current</p>
                <p className="text-sm font-semibold">{PLANS[currentPlan].name}</p>
                <p className="text-lg font-bold">${PLANS[currentPlan].price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              </div>
              <div className="px-3">
                <ArrowDownRight className="size-5 text-yellow-500" />
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">New</p>
                <p className="text-sm font-semibold">{selectedPlanConfig?.name}</p>
                <p className="text-lg font-bold">${selectedPlanConfig?.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              </div>
            </div>

            {/* What You'll Lose */}
            {lostFeatures.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1.5 text-destructive">
                  <XCircle className="size-4" />
                  What you&apos;ll lose
                </p>
                <div className="space-y-1.5">
                  {lostFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <XCircle className="size-4 text-red-400 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Effective Date Warning */}
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1">Downgrade takes effect immediately</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300">
                You will lose access to premium features right away. Any data exceeding the Free plan limits
                will remain stored but become inaccessible until you upgrade again.
              </p>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-300 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
              <Checkbox
                id="confirm-downgrade"
                checked={confirmDowngrade}
                onCheckedChange={(checked) => setConfirmDowngrade(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
              />
              <label htmlFor="confirm-downgrade" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I understand that I will lose access to <strong>{lostFeatures.length} premium feature{lostFeatures.length !== 1 ? "s" : ""}</strong> and
                this change takes effect immediately. I can upgrade again at any time.
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setChangeDialogOpen(false)} disabled={changing}>
              Keep My Plan
            </Button>
            <Button
              variant="destructive"
              onClick={handleChangePlan}
              disabled={changing || !confirmDowngrade}
              className={!confirmDowngrade ? "opacity-50" : ""}
            >
              {changing ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <ArrowDownRight className="size-4 mr-2" />
              )}
              {changing ? "Downgrading..." : "Confirm Downgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== SUCCESS DIALOG ===== */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                successData?.action === "upgraded"
                  ? "bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D]"
                  : "bg-yellow-100 dark:bg-yellow-900/30"
              }`}>
                {successData?.action === "upgraded" ? (
                  <PartyPopper className="size-8 text-white" />
                ) : (
                  <ArrowDownRight className="size-8 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <AlertDialogTitle className="text-xl">
                {successData?.action === "upgraded"
                  ? `Welcome to ${getPlan(successData?.toPlan || "FREE").name}!`
                  : `Switched to ${getPlan(successData?.toPlan || "FREE").name}`
                }
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                {successData?.action === "upgraded"
                  ? `You've been upgraded from ${getPlan(successData?.fromPlan || "FREE").name} to ${getPlan(successData?.toPlan || "FREE").name}. Explore all your new features and start making the most of your plan!`
                  : `Your plan has been changed from ${getPlan(successData?.fromPlan || "FREE").name} to ${getPlan(successData?.toPlan || "FREE").name}. You can upgrade again anytime to regain access to premium features.`
                }
              </AlertDialogDescription>

              {successData?.action === "upgraded" && successData.prorationAmount > 0 && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 w-full">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">
                    Prorated charge: ${successData.prorationAmount.toFixed(2)} applied today
                  </p>
                </div>
              )}

              {successData?.action === "upgraded" && (successData.prorationAmount === 0 || !successData.prorationAmount) && successData.toPlan !== "FREE" && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 w-full">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">
                    ${getPlan(successData.toPlan).price}.00 charged today — full access activated
                  </p>
                </div>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] hover:opacity-90"
              onClick={() => setSuccessDialogOpen(false)}
            >
              {successData?.action === "upgraded" ? "Explore My Plan" : "Got It"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
