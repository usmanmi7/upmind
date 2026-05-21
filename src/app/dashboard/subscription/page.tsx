"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  CreditCard,
  Zap,
  Crown,
  Download,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const plans = [
  { name: "Free", price: "$0/mo", planKey: "FREE", icon: Zap, features: ["1 startup profile", "Basic resources", "1 consultation/mo", "Email support"] },
  { name: "Growth Pro", price: "$49/mo", planKey: "GROWTH_PRO", icon: Crown, popular: true, features: ["Unlimited profiles", "Premium resources", "4 consultations/mo", "AI insights", "Dedicated consultant", "Document vault"] },
  { name: "Enterprise", price: "$149/mo", planKey: "ENTERPRISE", icon: Crown, features: ["Everything in Pro", "Team collaboration", "Custom integrations", "Unlimited consultations", "SLA guarantee", "Account manager"] },
]

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

export default function SubscriptionPage() {
  const [data, setData] = React.useState<SubscriptionData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [togglingAutoRenew, setTogglingAutoRenew] = React.useState(false)

  React.useEffect(() => {
    async function fetchSubscription() {
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
    }
    fetchSubscription()
  }, [])

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

  const currentPlan = data?.subscription?.plan || "FREE"
  const planName = currentPlan === "GROWTH_PRO" ? "Growth Pro" : currentPlan === "ENTERPRISE" ? "Enterprise" : "Free"
  const planPrice = currentPlan === "GROWTH_PRO" ? "$49" : currentPlan === "ENTERPRISE" ? "$149" : "$0"

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
                  {planPrice}/month
                  {data?.subscription?.endDate && ` · Renews ${new Date(data.subscription.endDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/pricing">Change Plan</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics — Real Data */}
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
          // Fallback if no data
          <Card className="col-span-full border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Unable to load usage data</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Plan Comparison */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Compare Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = plan.planKey === currentPlan
              return (
                <div
                  key={plan.name}
                  className={`p-5 rounded-xl border ${
                    isCurrent ? "border-[#7CFC00] bg-[#E8F5E9]/50 dark:bg-[#2D4A2D]/10" : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <plan.icon className="size-5 text-[#7CFC00]" />
                    <h3 className="font-heading font-semibold">{plan.name}</h3>
                    {isCurrent && <Badge className="bg-[#7CFC00] text-white text-[10px]">Current</Badge>}
                  </div>
                  <p className="text-lg font-bold mb-3">{plan.price}</p>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-3.5 text-green-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    className={`w-full mt-4 ${isCurrent ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A]" : ""}`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current Plan" : plan.planKey === "FREE" ? "Downgrade" : "Upgrade"}
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

      {/* Billing History — Real Data */}
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
    </div>
  )
}
