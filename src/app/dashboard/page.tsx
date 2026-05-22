"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  Calendar,
  BookOpen,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  UsersRound,
  Trophy,
  Zap,
  Loader2,
} from "lucide-react"

const quickActions = [
  {
    title: "Community",
    description: "Connect with fellow founders",
    icon: UsersRound,
    href: "/dashboard/community",
    color: "from-[#8FBC8F] to-[#2D4A2D]",
  },
  {
    title: "View Roadmap",
    description: "Track your startup milestones",
    icon: Target,
    href: "/dashboard/roadmap",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Book Consultation",
    description: "Schedule a session with an expert",
    icon: Calendar,
    href: "/dashboard/appointments",
    color: "from-orange-500 to-red-500",
  },
]

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
  recentTasks: Array<{
    id: string
    title: string
    status: string
    dueDate: string | null
  }>
  upcomingAppointments: Array<{
    id: string
    date: string
    consultant?: { user?: { name?: string } }
  }>
  checklist: Array<{
    title: string
    completed: boolean
    href: string
  }>
  checklistCompleted: number
  progress: number
  startup: {
    name: string
    progress: number
  } | null
}

export default function DashboardPage() {
  const { data: session } = useSession()
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
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const firstName = session?.user?.name?.split(" ")[0] || "Founder"
  const overview = data?.overview
  const progress = data?.progress || 0
  const totalTasks = overview?.totalTasks || 0
  const completedTasks = overview?.tasksCompleted || 0
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const formatNextAppointment = () => {
    if (!data?.upcomingAppointments || data.upcomingAppointments.length === 0) return null
    const apt = data.upcomingAppointments[0]
    const date = new Date(apt.date)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" }) + ` at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your startup journey
          </p>
        </div>
        <Button
          asChild
          className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A] shadow-lg shadow-[#7CFC00]/25"
        >
          <Link href="/dashboard/startup">
            <Rocket className="size-4" />
            My Startup
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Startup Progress</p>
                <p className="text-2xl font-bold mt-1">{progress}%</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center">
                <TrendingUp className="size-5 text-[#2D4A2D] dark:text-[#7CFC00]" />
              </div>
            </div>
            <Progress value={progress} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold mt-1">{completedTasks}/{totalTasks}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Progress value={taskPercent} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Appointments</p>
                <p className="text-2xl font-bold mt-1">{overview?.scheduledAppointments || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center">
                <Calendar className="size-5 text-[#1A2E1A] dark:text-[#7CFC00]" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {formatNextAppointment() || "No upcoming appointments"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resources</p>
                <p className="text-2xl font-bold mt-1">{overview?.resourcesUsed || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center">
                <BookOpen className="size-5 text-[#2D4A2D] dark:text-[#7CFC00]" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {overview?.resourcesUsed ? `${overview.resourcesUsed} saved` : "Start exploring resources"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="size-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Tasks & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">Recent Tasks</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/roadmap">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data?.recentTasks && data.recentTasks.length > 0 ? (
              <div className="space-y-3">
                {data.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        task.status === "COMPLETED"
                          ? "bg-green-500"
                          : task.status === "IN_PROGRESS"
                          ? "bg-[#7CFC00]"
                          : "bg-muted-foreground/40"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "COMPLETED" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.status === "COMPLETED"
                          ? "default"
                          : task.status === "IN_PROGRESS"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs shrink-0"
                    >
                      {task.status === "COMPLETED" ? (
                        <CheckCircle2 className="size-3 mr-1" />
                      ) : task.status === "IN_PROGRESS" ? (
                        <Clock className="size-3 mr-1" />
                      ) : null}
                      {task.status === "COMPLETED" ? "Done" : task.status === "IN_PROGRESS" ? "In Progress" : "To Do"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No tasks yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create tasks in your{" "}
                  <Link href="/dashboard/roadmap" className="text-[#7CFC00] hover:underline">
                    roadmap
                  </Link>{" "}
                  to track progress
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-heading">Getting Started</CardTitle>
                <CardDescription>
                  Complete these steps to set up your startup
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                <Trophy className="size-3 mr-1" /> {data?.checklistCompleted || 0}/5
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.checklist || [
                { title: "Create your startup profile", completed: false, href: "/dashboard/startup" },
                { title: "Define your vision & goals", completed: false, href: "/dashboard/startup" },
                { title: "Try the Community", completed: false, href: "/dashboard/community" },
                { title: "Build your first roadmap", completed: false, href: "/dashboard/roadmap" },
                { title: "Book a consultation", completed: false, href: "/dashboard/appointments" },
              ]).map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 group"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      item.completed
                        ? "bg-green-500"
                        : "border-2 border-muted-foreground/30 group-hover:border-[#7CFC00]/50"
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="size-4 text-white" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground/50 font-medium">{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm flex-1 ${
                      item.completed
                        ? "line-through text-muted-foreground"
                        : "font-medium group-hover:text-[#7CFC00]"
                    }`}
                  >
                    {item.title}
                  </span>
                  {!item.completed && (
                    <ArrowRight className="size-3 text-muted-foreground/30 group-hover:text-[#7CFC00] transition-colors" />
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#2D4A2D]/10 to-[#1A2E1A]/10 border border-[#7CFC00]/30 dark:border-[#2D4A2D]/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-[#7CFC00]" />
                <span className="text-sm font-medium">Earn Badges</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Complete tasks to unlock achievements and earn XP. Visit your{" "}
                <Link href="/dashboard/profile" className="text-[#7CFC00] hover:underline">
                  profile
                </Link>{" "}
                to see all badges.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
