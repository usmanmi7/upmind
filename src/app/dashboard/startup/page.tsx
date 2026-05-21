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
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const startupData = {
  name: "My Startup",
  industry: "SaaS",
  stage: "Early Stage",
  progress: 35,
  vision: "Building the future of work with AI-powered productivity tools.",
  goals: "Launch MVP by Q2, acquire first 100 users, raise seed round.",
  teamSize: "1-5",
  website: "https://mystartup.com",
}

const quickStats = [
  { icon: CheckCircle2, label: "Tasks Completed", value: "7/12", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
  { icon: Calendar, label: "Upcoming Appointments", value: "2", color: "text-[#1A2E1A] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
  { icon: BookOpen, label: "Resources Used", value: "15", color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
  { icon: TrendingUp, label: "Startup Score", value: "72/100", color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
]

const stages = [
  { name: "Ideation", progress: 100 },
  { name: "Validation", progress: 100 },
  { name: "Early Stage", progress: 35 },
  { name: "Growth", progress: 0 },
  { name: "Scale", progress: 0 },
]

export default function StartupPage() {
  const [editing, setEditing] = React.useState(false)

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
            if (editing) toast.success("Startup updated successfully!")
            setEditing(!editing)
          }}
          className={editing ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A]" : ""}
        >
          {editing ? <><Save className="size-4 mr-2" /> Save Changes</> : <><Edit3 className="size-4 mr-2" /> Edit Details</>}
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
                  <Input defaultValue={startupData.name} className="text-lg font-heading font-bold" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input defaultValue={startupData.industry} placeholder="Industry" />
                    <Input defaultValue={startupData.teamSize} placeholder="Team Size" />
                    <Input defaultValue={startupData.website} placeholder="Website" />
                    <Input defaultValue={startupData.stage} placeholder="Business Stage" />
                  </div>
                  <Textarea defaultValue={startupData.vision} placeholder="Vision" rows={2} />
                  <Textarea defaultValue={startupData.goals} placeholder="Goals" rows={2} />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-heading font-bold">{startupData.name}</h2>
                    <Badge className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">{startupData.stage}</Badge>
                    <Badge variant="outline" className="text-xs">{startupData.industry}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{startupData.vision}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="size-3.5" /> {startupData.teamSize} team</span>
                    <span className="flex items-center gap-1"><Globe className="size-3.5" /> {startupData.website}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold gradient-text">{startupData.progress}%</span>
            </div>
            <Progress value={startupData.progress} className="h-2" />
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
                  <span className="text-[10px] text-muted-foreground">{stage.progress}%</span>
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
          <div className="space-y-3">
            {[
              { title: "Launch MVP by Q2", progress: 60, icon: Target },
              { title: "Acquire first 100 users", progress: 25, icon: Users },
              { title: "Raise seed round", progress: 10, icon: TrendingUp },
              { title: "Define product-market fit", progress: 45, icon: Lightbulb },
            ].map((goal) => (
              <div key={goal.title} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-lg bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center shrink-0">
                  <goal.icon className="size-4 text-[#2D4A2D] dark:text-[#7CFC00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{goal.title}</p>
                  <Progress value={goal.progress} className="h-1.5 mt-1.5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground shrink-0">{goal.progress}%</span>
              </div>
            ))}
          </div>
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
