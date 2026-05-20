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
  X,
  CreditCard,
  Zap,
  Crown,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react"
import Link from "next/link"

const plans = [
  { name: "Free", price: "$0/mo", icon: Zap, features: ["1 startup profile", "Basic resources", "1 consultation/mo", "Email support"] },
  { name: "Growth Pro", price: "$49/mo", icon: Crown, popular: true, features: ["Unlimited profiles", "Premium resources", "4 consultations/mo", "AI insights", "Dedicated consultant", "Document vault"] },
  { name: "Enterprise", price: "$149/mo", icon: Crown, features: ["Everything in Pro", "Team collaboration", "Custom integrations", "Unlimited consultations", "SLA guarantee", "Account manager"] },
]

const billingHistory = [
  { date: "Mar 1, 2024", description: "Growth Pro — Monthly", amount: "$49.00", status: "Paid" },
  { date: "Feb 1, 2024", description: "Growth Pro — Monthly", amount: "$49.00", status: "Paid" },
  { date: "Jan 1, 2024", description: "Growth Pro — Monthly", amount: "$49.00", status: "Paid" },
  { date: "Dec 1, 2024", description: "Free Plan", amount: "$0.00", status: "—" },
]

export default function SubscriptionPage() {
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Crown className="size-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-heading font-bold">Growth Pro</h2>
                  <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">$49/month &middot; Renews Apr 1, 2024</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/pricing">Change Plan</Link>
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Consultations", used: 2, total: 4 },
          { label: "Resources Downloaded", used: 23, total: "∞" },
          { label: "Documents", used: 8, total: 50 },
          { label: "Team Members", used: 1, total: 1 },
        ].map((metric) => {
          const pct = typeof metric.total === "number" ? Math.round((metric.used / metric.total) * 100) : 0
          return (
            <Card key={metric.label} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-lg font-bold">{metric.used} <span className="text-sm text-muted-foreground font-normal">/ {metric.total}</span></p>
                {typeof metric.total === "number" && <Progress value={pct} className="h-1.5 mt-2" />}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Plan Comparison */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Compare Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-5 rounded-xl border ${
                  plan.popular ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <plan.icon className="size-5 text-blue-500" />
                  <h3 className="font-heading font-semibold">{plan.name}</h3>
                  {plan.popular && <Badge className="bg-blue-500 text-white text-[10px]">Current</Badge>}
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
                  variant={plan.popular ? "default" : "outline"}
                  size="sm"
                  className={`w-full mt-4 ${plan.popular ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : ""}`}
                  disabled={plan.popular}
                >
                  {plan.popular ? "Current Plan" : plan.name === "Free" ? "Downgrade" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
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
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2025</p>
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
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingHistory.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{item.amount}</span>
                  {item.status === "Paid" && (
                    <Button variant="ghost" size="icon" className="size-7">
                      <Download className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
