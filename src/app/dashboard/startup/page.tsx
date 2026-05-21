"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Rocket,
  CheckCircle2,
  Calendar,
  BookOpen,
  TrendingUp,
  Edit3,
  Save,
  Globe,
  Users,
  Target,
  Lightbulb,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface StartupData {
  id: string
  name: string
  industry: string | null
  teamSize: string | null
  vision: string | null
  goals: string | null
  pitchDeckUrl: string | null
  businessStage: string | null
  revenueStage: string | null
  website: string | null
  progress: number
  tasks: Array<{ id: string; status: string }>
  roadmapItems: Array<{ id: string; isCompleted: boolean }>
}

interface AnalyticsOverview {
  tasksCompleted: number
  totalTasks: number
  appointmentsAttended: number
  scheduledAppointments: number
  resourcesUsed: number
  startupScore: number
}

export default function StartupPage() {
  const [editing, setEditing] = React.useState(false)
  const [startup, setStartup] = React.useState<StartupData | null>(null)
  const [analytics, setAnalytics] = React.useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // Form state
  const [formName, setFormName] = React.useState("")
  const [formIndustry, setFormIndustry] = React.useState("")
  const [formTeamSize, setFormTeamSize] = React.useState("")
  const [formVision, setFormVision] = React.useState("")
  const [formGoals, setFormGoals] = React.useState("")
  const [formWebsite, setFormWebsite] = React.useState("")
  const [formBusinessStage, setFormBusinessStage] = React.useState("")

  const fetchData = React.useCallback(async () => {
    try {
      const [startupRes, analyticsRes] = await Promise.all([
        fetch("/api/startup"),
        fetch("/api/analytics"),
      ])

      if (startupRes.ok) {
        const data = await startupRes.json()
        if (data.error === "Startup not found") {
          // No startup yet - will be created on first save
          setStartup(null)
        } else {
          setStartup(data)
          setFormName(data.name || "")
          setFormIndustry(data.industry || "")
          setFormTeamSize(data.teamSize || "")
          setFormVision(data.vision || "")
          setFormGoals(data.goals || "")
          setFormWebsite(data.website || "")
          setFormBusinessStage(data.businessStage || "")
        }
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setAnalytics(data.overview)
      }
    } catch (error) {
      console.error("Failed to fetch startup data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/startup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          industry: formIndustry,
          teamSize: formTeamSize,
          vision: formVision,
          goals: formGoals,
          website: formWebsite,
          businessStage: formBusinessStage,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setStartup(data)
        toast.success("Startup updated successfully!")
        setEditing(false)
        fetchData()
      } else {
        toast.error("Failed to update startup")
      }
    } catch (error) {
      console.error("Failed to save startup:", error)
      toast.error("Failed to update startup")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
          <p className="text-sm text-muted-foreground">Loading startup data...</p>
        </div>
      </div>
    )
  }

  const completedTasks = startup?.tasks?.filter((t) => t.status === "COMPLETED").length || analytics?.tasksCompleted || 0
  const totalTasks = startup?.tasks?.length || analytics?.totalTasks || 0
  const progress = startup?.progress || 0

  const quickStats = [
    { icon: CheckCircle2, label: "Tasks Completed", value: `${completedTasks}/${totalTasks}`, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    { icon: Calendar, label: "Upcoming Appointments", value: String(analytics?.scheduledAppointments || 0), color: "text-[#1A2E1A] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
    { icon: BookOpen, label: "Resources Used", value: String(analytics?.resourcesUsed || 0), color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
    { icon: TrendingUp, label: "Startup Score", value: `${analytics?.startupScore || 0}/100`, color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
  ]

  const stages = [
    { name: "Ideation", progress: progress >= 10 ? 100 : progress >= 0 && startup ? progress * 10 : 0 },
    { name: "Validation", progress: progress >= 25 ? 100 : progress >= 10 ? (progress - 10) * 6.67 : 0 },
    { name: "Early Stage", progress: progress >= 50 ? 100 : progress >= 25 ? (progress - 25) * 4 : 0 },
    { name: "Growth", progress: progress >= 75 ? 100 : progress >= 50 ? (progress - 50) * 4 : 0 },
    { name: "Scale", progress: progress >= 100 ? 100 : progress >= 75 ? (progress - 75) * 4 : 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">My Startup</h1>
          <p className="text-muted-foreground mt-1">Manage and track your startup progress</p>
        </div>
        <Button
          variant={editing ? "default" : "outline"}
          onClick={() => {
            if (editing) handleSave()
            else setEditing(true)
          }}
          disabled={saving}
          className={editing ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A]" : ""}
        >
          {saving ? (
            <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</>
          ) : editing ? (
            <><Save className="size-4 mr-2" /> Save Changes</>
          ) : (
            <><Edit3 className="size-4 mr-2" /> Edit Details</>
          )}
        </Button>
      </div>

      {/* Startup Overview Card */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center shrink-0">
              <Rocket className="size-7 text-white" />
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="text-lg font-heading font-bold" placeholder="Startup name" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input value={formIndustry} onChange={(e) => setFormIndustry(e.target.value)} placeholder="Industry" />
                    <Input value={formTeamSize} onChange={(e) => setFormTeamSize(e.target.value)} placeholder="Team Size" />
                    <Input value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)} placeholder="Website" />
                    <Input value={formBusinessStage} onChange={(e) => setFormBusinessStage(e.target.value)} placeholder="Business Stage" />
                  </div>
                  <Textarea value={formVision} onChange={(e) => setFormVision(e.target.value)} placeholder="Vision" rows={2} />
                  <Textarea value={formGoals} onChange={(e) => setFormGoals(e.target.value)} placeholder="Goals" rows={2} />
                </div>
              ) : startup ? (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-heading font-bold">{startup.name || "My Startup"}</h2>
                    <Badge className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">{startup.businessStage || "Idea"}</Badge>
                    {startup.industry && <Badge variant="outline" className="text-xs">{startup.industry}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{startup.vision || "Add your startup vision to get started."}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    {startup.teamSize && <span className="flex items-center gap-1"><Users className="size-3.5" /> {startup.teamSize} team</span>}
                    {startup.website && <span className="flex items-center gap-1"><Globe className="size-3.5" /> {startup.website}</span>}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <h2 className="text-xl font-heading font-bold">Set Up Your Startup</h2>
                  <p className="text-sm text-muted-foreground mt-1">Click &quot;Edit Details&quot; to create your startup profile and begin tracking progress.</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold gradient-text">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Startup Stage Indicator */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Startup Stage</CardTitle>
          <CardDescription>Your journey from ideation to scale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {stages.map((stage, i) => (
              <React.Fragment key={stage.name}>
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                    stage.progress === 100
                      ? "bg-green-500 text-white"
                      : stage.progress > 0
                        ? "bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A]"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {stage.progress === 100 ? <CheckCircle2 className="size-5" /> : i + 1}
                  </div>
                  <span className="text-xs font-medium mt-1.5 text-center">{stage.name}</span>
                  <span className="text-[10px] text-muted-foreground">{Math.round(stage.progress)}%</span>
                </div>
                {i < stages.length - 1 && (
                  <div className={`h-0.5 w-8 shrink-0 ${stage.progress === 100 ? "bg-green-500" : "bg-muted"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base font-heading">Goals & Targets</CardTitle>
        </CardHeader>
        <CardContent>
          {startup?.goals ? (
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm whitespace-pre-wrap">{startup.goals}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="size-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No goals set yet</p>
              <p className="text-xs text-muted-foreground mt-1">Edit your startup details to add goals and targets</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button asChild variant="outline" className="h-auto p-4 justify-start">
          <Link href="/dashboard/roadmap">
            <Target className="size-5 mr-3 text-[#7CFC00]" />
            <div className="text-left">
              <p className="text-sm font-medium">View Roadmap</p>
              <p className="text-xs text-muted-foreground">Track your milestones</p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 justify-start">
          <Link href="/dashboard/appointments">
            <Calendar className="size-5 mr-3 text-[#2D4A2D]" />
            <div className="text-left">
              <p className="text-sm font-medium">Book Consultation</p>
              <p className="text-xs text-muted-foreground">Get expert advice</p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto p-4 justify-start">
          <Link href="/dashboard/resources">
            <BookOpen className="size-5 mr-3 text-[#8FBC8F]" />
            <div className="text-left">
              <p className="text-sm font-medium">Browse Resources</p>
              <p className="text-xs text-muted-foreground">Templates & guides</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}
