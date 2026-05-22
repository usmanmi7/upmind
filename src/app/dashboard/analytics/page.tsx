"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  Calendar,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Lightbulb,
  Target,
  Loader2,
} from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsData {
  overview: {
    tasksCompleted: number
    totalTasks: number
    appointmentsAttended: number
    totalAppointments: number
    scheduledAppointments: number
    resourcesUsed: number
    startupScore: number
    unreadNotifications: number
  }
  taskBreakdown: {
    completed: number
    inProgress: number
    todo: number
  }
  resourceByType: Record<string, number>
  healthDimensions: {
    product: number
    market: number
    team: number
    financials: number
  }
  progress: number
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const overview = data?.overview
  const taskBreakdown = data?.taskBreakdown || { completed: 0, inProgress: 0, todo: 0 }
  const healthDimensions = data?.healthDimensions || { product: 0, market: 0, team: 0, financials: 0 }
  const startupScore = overview?.startupScore || 0

  const overviewCards = [
    { icon: CheckCircle2, label: "Tasks Completed", value: String(overview?.tasksCompleted || 0), change: `${overview?.totalTasks || 0} total`, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    { icon: Calendar, label: "Appointments Attended", value: String(overview?.appointmentsAttended || 0), change: `${overview?.scheduledAppointments || 0} scheduled`, color: "text-[#1A2E1A] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
    { icon: BookOpen, label: "Resources Viewed", value: String(overview?.resourcesUsed || 0), change: "unique resources opened", color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
    { icon: TrendingUp, label: "Startup Score", value: `${startupScore}/100`, change: startupScore >= 70 ? "Strong" : startupScore >= 40 ? "Growing" : "Getting started", color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
  ]

  // Build resource data from actual types
  const resourceData = Object.entries(data?.resourceByType || {}).map(([name, used]) => ({
    name: name.charAt(0) + name.slice(1).toLowerCase(),
    used,
  }))
  if (resourceData.length === 0) {
    // Show empty state chart
    resourceData.push({ name: "No data yet", used: 0 })
  }

  const taskCompletionData = [
    { name: "Completed", value: taskBreakdown.completed, color: "#10B981" },
    { name: "In Progress", value: taskBreakdown.inProgress, color: "#7CFC00" },
    { name: "To Do", value: taskBreakdown.todo, color: "#94A3B8" },
  ].filter((d) => d.value > 0)

  if (taskCompletionData.length === 0) {
    taskCompletionData.push({ name: "No tasks", value: 1, color: "#94A3B8" })
  }

  const recommendations = []
  if (startupScore < 30) {
    recommendations.push({ icon: Target, title: "Complete your startup profile", description: "Add your startup details, vision, and goals to improve your score." })
    recommendations.push({ icon: Lightbulb, title: "Start building your roadmap", description: "Define tasks and milestones to track your progress." })
    recommendations.push({ icon: Calendar, title: "Book a consultation", description: "Get expert guidance to accelerate your startup journey." })
  } else if (startupScore < 60) {
    recommendations.push({ icon: Target, title: "Focus on completing tasks", description: "You have a good start. Focus on completing your roadmap items." })
    recommendations.push({ icon: Lightbulb, title: "Try the Pitch Deck Template", description: "Your fundraising phase may be approaching. Prepare your pitch deck early." })
    recommendations.push({ icon: Calendar, title: "Book a Strategy Session", description: "Schedule a consultation to discuss your progress and next steps." })
  } else {
    recommendations.push({ icon: TrendingUp, title: "Scale your operations", description: "You are making great progress. Consider scaling your team and operations." })
    recommendations.push({ icon: Lightbulb, title: "Refine your strategy", description: "Use analytics insights to optimize your growth channels." })
    recommendations.push({ icon: Calendar, title: "Seek investment advice", description: "Your progress is strong. Consider speaking with a fundraising expert." })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your startup progress and performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => (
          <Card key={card.label} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`size-5 ${card.color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUpRight className="size-3 text-green-500" />
                  <span className="text-muted-foreground">{card.change}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Startup Score Over Time - simplified since we don't have historical data */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-base font-heading">Startup Score</CardTitle>
            <CardDescription>Your current startup evaluation score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--muted)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(startupScore / 100) * 314} ${314}`}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7CFC00" />
                      <stop offset="100%" stopColor="#2D4A2D" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-bold gradient-text">{startupScore}</span>
                    <p className="text-xs text-muted-foreground">out of 100</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                {startupScore >= 70 ? "Excellent progress! Keep up the momentum." : startupScore >= 40 ? "Good start! Complete more tasks to improve your score." : "Get started by completing your profile and roadmap tasks."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-base font-heading">Resource Usage</CardTitle>
            <CardDescription>Resources accessed by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {overview?.resourcesUsed && overview.resourcesUsed > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="used" fill="#7CFC00" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <BookOpen className="size-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No resources viewed yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Open resources to see usage analytics</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Completion Donut */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-base font-heading">Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskCompletionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {taskCompletionData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Startup Health Score */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-base font-heading">Startup Health Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--muted)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="url(#healthGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(startupScore / 100) * 314} ${314}`}
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7CFC00" />
                    <stop offset="100%" stopColor="#2D4A2D" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold gradient-text">{startupScore}</span>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              {[
                { label: "Product", value: healthDimensions.product },
                { label: "Market", value: healthDimensions.market },
                { label: "Team", value: healthDimensions.team },
                { label: "Financials", value: healthDimensions.financials },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-base font-heading">Recommendations</CardTitle>
            <CardDescription>AI-powered suggestions for your startup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-lg bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center shrink-0">
                    <rec.icon className="size-4 text-[#2D4A2D] dark:text-[#7CFC00]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
