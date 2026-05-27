"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  DollarSign,
  BookOpen,
  BarChart3,
  Download,
  ArrowUpRight,
  Globe,
  FileText,
  Eye,
  Lock,
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
  AreaChart,
  Area,
} from "recharts"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  users: {
    total: number
    paid: number
    free: number
    consultants: number
    recent: number
    growth: Array<{ month: string; total: number; new: number }>
    byCountry: Array<{ country: string | null; _count: { country: number } }>
  }
  subscriptions: {
    active: number
    cancelled: number
    expired: number
    planDistribution: Array<{ plan: string; _count: { plan: number } }>
  }
  revenue: {
    total: number
    byMonth: Array<{ month: string; revenue: number; transactions: number }>
  }
  appointments: {
    total: number
    scheduled: number
    completed: number
    cancelled: number
  }
  resources: {
    total: number
    premium: number
    totalDownloads: number
    byType: Array<{ type: string; _count: { type: number } }>
    byCategory: Array<{ category: string | null; _count: { category: number } }>
    topDownloads: Array<{ id: string; title: string; type: string; downloadCount: number; isPremium: boolean }>
  }
  messages: { total: number; unread: number }
}

const chartColors = ["#7CFC00", "#2D4A2D", "#10b981", "#f59e0b", "#ef4444", "#ec4899"]

export default function AdminAnalyticsPage() {
  const { toast } = useToast()
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/analytics")
        if (res.ok) setData(await res.json())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-64 bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const d = data!

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          <p className="text-sm text-muted-foreground">Platform insights and metrics</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Report export started (demo)" })}>
          <Download className="size-4 mr-2" />Export Report
        </Button>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="users" className="gap-1.5"><Users className="size-4" />Users</TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5"><DollarSign className="size-4" />Revenue</TabsTrigger>
          <TabsTrigger value="resources" className="gap-1.5"><BookOpen className="size-4" />Resources</TabsTrigger>
          <TabsTrigger value="engagement" className="gap-1.5"><BarChart3 className="size-4" />Engagement</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: "Total Users", value: d.users.total, icon: Users, color: "from-[#7CFC00] to-[#2D4A2D]" },
              { title: "Paid Users", value: d.users.paid, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
              { title: "New (30d)", value: d.users.recent, icon: ArrowUpRight, color: "from-[#2D4A2D] to-[#8FBC8F]" },
              { title: "Consultants", value: d.users.consultants, icon: Users, color: "from-orange-500 to-red-500" },
            ].map((stat) => (
              <Card key={stat.title} className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
                    <stat.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Registration Trends</CardTitle>
                <CardDescription>New users over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={d.users.growth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Area type="monotone" dataKey="total" stroke="#7CFC00" fill="#7CFC0020" name="Total Users" />
                      <Area type="monotone" dataKey="new" stroke="#2D4A2D" fill="#2D4A2D20" name="New Users" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Users by Country</CardTitle>
                <CardDescription>Top countries by user count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {d.users.byCountry.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Globe className="size-4 text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{c.country || "Unknown"}</span>
                          <span className="text-sm font-medium">{c._count.country}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D]"
                            style={{ width: `${(c._count.country / d.users.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Conversion Funnel</CardTitle>
              <CardDescription>From free users to paid subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {[
                  { label: "Total Users", value: d.users.total, pct: 100 },
                  { label: "Free Users", value: d.users.free, pct: d.users.total ? Math.round((d.users.free / d.users.total) * 100) : 0 },
                  { label: "Paid Users", value: d.users.paid, pct: d.users.total ? Math.round((d.users.paid / d.users.total) * 100) : 0 },
                ].map((step, i) => (
                  <React.Fragment key={step.label}>
                    {i > 0 && <ArrowUpRight className="size-5 text-muted-foreground rotate-90 sm:rotate-0 shrink-0" />}
                    <div className="flex-1 w-full text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{step.value}</p>
                      <p className="text-sm text-muted-foreground">{step.label}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">{step.pct}%</Badge>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: "Total Revenue", value: `$${d.revenue.total.toLocaleString()}`, color: "from-green-500 to-emerald-500" },
              { title: "Active Subs", value: d.subscriptions.active, color: "from-[#7CFC00] to-[#2D4A2D]" },
              { title: "Cancelled", value: d.subscriptions.cancelled, color: "from-red-500 to-orange-500" },
              { title: "Expired", value: d.subscriptions.expired, color: "from-yellow-500 to-amber-500" },
            ].map((stat) => (
              <Card key={stat.title} className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">MRR Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={d.revenue.byMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Line type="monotone" dataKey="revenue" stroke="#7CFC00" strokeWidth={2} dot={{ fill: "#7CFC00" }} name="Revenue ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={d.subscriptions.planDistribution.map((p) => ({ name: p.plan, value: p._count.plan }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {d.subscriptions.planDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {d.subscriptions.planDistribution.map((p, i) => (
                    <div key={p.plan} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
                      <span className="text-xs text-muted-foreground">{p.plan.replace("_", " ")} ({p._count.plan})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: "Total Resources", value: d.resources.total },
              { title: "Premium", value: d.resources.premium },
              { title: "Total Downloads", value: d.resources.totalDownloads },
              { title: "Free", value: d.resources.total - d.resources.premium },
            ].map((stat) => (
              <Card key={stat.title} className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Resources by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.resources.byType.map((t) => ({ name: t.type, count: t._count.type }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Bar dataKey="count" fill="#7CFC00" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Top Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {d.resources.topDownloads.map((r, i) => (
                    <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{r.type}</Badge>
                          {r.isPremium && <Lock className="size-3 text-yellow-500" />}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium">{r.downloadCount}</p>
                        <p className="text-xs text-muted-foreground">downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Resources by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {d.resources.byCategory.map((c) => (
                  <div key={c.category} className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xl font-bold">{c._count.category}</p>
                    <p className="text-xs text-muted-foreground">{c.category || "Uncategorized"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: "Total Appointments", value: d.appointments.total },
              { title: "Completion Rate", value: `${d.appointments.total ? Math.round((d.appointments.completed / d.appointments.total) * 100) : 0}%` },
              { title: "Total Messages", value: d.messages.total },
              { title: "Unread Messages", value: d.messages.unread },
            ].map((stat) => (
              <Card key={stat.title} className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Appointment Status</CardTitle>
              <CardDescription>Breakdown of appointment outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Scheduled", value: d.appointments.scheduled, fill: "#3b82f6" },
                      { name: "Completed", value: d.appointments.completed, fill: "#10b981" },
                      { name: "Cancelled", value: d.appointments.cancelled, fill: "#ef4444" },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Message Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-3xl font-bold">{d.messages.total}</p>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-green-500/10 text-center">
                      <p className="text-xl font-bold text-green-500">{d.messages.total - d.messages.unread}</p>
                      <p className="text-xs text-muted-foreground">Read</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#7CFC00]/10 text-center">
                      <p className="text-xl font-bold text-[#7CFC00]">{d.messages.unread}</p>
                      <p className="text-xs text-muted-foreground">Unread</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Message Read Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-3xl font-bold">{d.messages.total ? Math.round(((d.messages.total - d.messages.unread) / d.messages.total) * 100) : 0}%</p>
                    <p className="text-sm text-muted-foreground">Messages Read</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-green-500/10 text-center">
                      <p className="text-xl font-bold text-green-500">{d.messages.total - d.messages.unread}</p>
                      <p className="text-xs text-muted-foreground">Read</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#7CFC00]/10 text-center">
                      <p className="text-xl font-bold text-[#7CFC00]">{d.messages.unread}</p>
                      <p className="text-xs text-muted-foreground">Unread</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
