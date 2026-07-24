"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  CreditCard,
  TrendingUp,
  UserPlus,
  Calendar,
  DollarSign,
  BookOpen,
  BarChart3,
  FileText,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface DashboardData {
  users: { total: number; paid: number; free: number; consultants: number; recent: number; growth: Array<{ month: string; total: number; new: number }> }
  subscriptions: { active: number; cancelled: number; expired: number; planDistribution: Array<{ plan: string; _count: { plan: number } }> }
  revenue: { total: number; byMonth: Array<{ month: string; revenue: number; transactions: number }> }
  appointments: { total: number; scheduled: number; completed: number; cancelled: number; today: Array<{ id: string; date: string; type: string; status: string; notes: string | null; user: { name: string; email: string }; consultant: { user: { name: string } } | null }> }
  resources: { total: number; premium: number; totalDownloads: number }
  messages: { total: number; unread: number }
}

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/analytics")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statsCards = [
    {
      title: "Total Users",
      value: data?.users.total || 0,
      change: `+${data?.users.recent || 0} this month`,
      trend: "up" as const,
      icon: Users,
      color: "from-[#1E3A8A] to-[#93C5FD]",
    },
    {
      title: "Paid Users",
      value: data?.users.paid || 0,
      change: `${data?.users.total ? Math.round(((data?.users.paid || 0) / data?.users.total) * 100) : 0}% conversion`,
      trend: "up" as const,
      icon: CreditCard,
      color: "from-[#3B82F6] to-[#1E3A8A]",
    },
    {
      title: "Monthly Revenue",
      value: `$${(data?.revenue.total || 0).toLocaleString()}`,
      change: `${data?.revenue.byMonth?.length || 0} months tracked`,
      trend: "up" as const,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Resources",
      value: data?.resources.total || 0,
      change: `${data?.resources.premium || 0} premium`,
      trend: "up" as const,
      icon: BookOpen,
      color: "from-orange-500 to-red-500",
    },
  ]

  const quickActions = [
    { title: "Manage Users", icon: Users, href: "/dashboard/admin/users", color: "from-[#3B82F6] to-[#1E3A8A]" },
    { title: "Add Resource", icon: BookOpen, href: "/dashboard/admin/resources", color: "from-[#1E3A8A] to-[#93C5FD]" },
    { title: "Edit FAQs", icon: FileText, href: "/dashboard/admin/cms", color: "from-orange-500 to-red-500" },
    { title: "Platform Settings", icon: Shield, href: "/dashboard/admin/settings", color: "from-purple-500 to-indigo-500" },
  ]

  const planColors: Record<string, string> = {
    FREE: "#94a3b8",
    GROWTH_PRO: "#3B82F6",
    ENTERPRISE: "#1E3A8A",
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-64 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="size-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="size-3 text-red-500" />
                      )}
                      <span className="text-xs text-muted-foreground">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="size-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth Chart */}
        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">User Growth</CardTitle>
              <CardDescription>New users over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.users.growth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} name="Total Users" />
                    <Line type="monotone" dataKey="new" stroke="#1E3A8A" strokeWidth={2} dot={{ fill: "#1E3A8A" }} name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Revenue</CardTitle>
              <CardDescription>Monthly revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.revenue.byMonth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subscription Distribution */}
        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Subscription Plans</CardTitle>
              <CardDescription>Active plan distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.subscriptions.planDistribution.map((p) => ({
                        name: p.plan,
                        value: p._count.plan,
                      })) || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(data?.subscriptions.planDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={planColors[entry.plan] || "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {data?.subscriptions.planDistribution.map((p) => (
                  <div key={p.plan} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: planColors[p.plan] || "#94a3b8" }} />
                    <span className="text-xs text-muted-foreground">{p.plan.replace("_", " ")} ({p._count.plan})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Appointments */}
        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Today&apos;s Appointments</CardTitle>
              <CardDescription>{data?.appointments.today.length || 0} scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {data?.appointments.today.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No appointments today</p>
                ) : (
                  data?.appointments.today.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-[#3B82F6]/20 text-[#3B82F6] text-xs">
                          {apt.user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{apt.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          with {apt.consultant?.user.name || "Unassigned"} • {new Date(apt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {apt.type}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-auto py-4 flex-col gap-2 hover:bg-muted/50 border-dashed"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <action.icon className="size-5 text-white" />
                      </div>
                      <span className="text-xs">{action.title}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Resources", value: data?.resources.total || 0, icon: BookOpen, color: "text-[#3B82F6]" },
                { label: "Premium Resources", value: data?.resources.premium || 0, icon: BookOpen, color: "text-[#1E3A8A]" },
                { label: "Total Downloads", value: data?.resources.totalDownloads || 0, icon: TrendingUp, color: "text-green-500" },
                { label: "Scheduled Appts", value: data?.appointments.scheduled || 0, icon: Calendar, color: "text-[#93C5FD]" },
                { label: "Completed Appts", value: data?.appointments.completed || 0, icon: Calendar, color: "text-emerald-500" },
                { label: "Active Consultants", value: data?.users.consultants || 0, icon: Shield, color: "text-[#3B82F6]" },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <metric.icon className={`size-4 ${metric.color} shrink-0`} />
                  <div>
                    <p className="text-lg font-bold">{metric.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
