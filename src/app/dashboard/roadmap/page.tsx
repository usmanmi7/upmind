"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Rocket,
  Wrench,
  Zap,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  Target,
  DollarSign,
  Crown,
  Flag,
  Star,
  PartyPopper,
} from "lucide-react"
import { toast } from "sonner"

const phases = [
  {
    id: "research",
    name: "Research",
    icon: Search,
    color: "from-[#2D4A2D] to-[#8FBC8F]",
    progress: 75,
    items: [
      { id: "1", title: "Market research & analysis", completed: true },
      { id: "2", title: "Competitive landscape mapping", completed: true },
      { id: "3", title: "Customer persona development", completed: true },
      { id: "4", title: "Industry trend analysis", completed: false },
    ],
  },
  {
    id: "build",
    name: "Build",
    icon: Wrench,
    color: "from-[#7CFC00] to-[#2D4A2D]",
    progress: 40,
    items: [
      { id: "5", title: "Define MVP features", completed: true },
      { id: "6", title: "Create wireframes & prototypes", completed: true },
      { id: "7", title: "Develop MVP", completed: false },
      { id: "8", title: "Internal testing & QA", completed: false },
      { id: "9", title: "Beta user onboarding", completed: false },
    ],
  },
  {
    id: "launch",
    name: "Launch",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    progress: 10,
    items: [
      { id: "10", title: "Launch marketing campaign", completed: false },
      { id: "11", title: "Product Hunt launch", completed: false },
      { id: "12", title: "Press & media outreach", completed: false },
      { id: "13", title: "Monitor & iterate on feedback", completed: false },
    ],
  },
  {
    id: "grow",
    name: "Grow",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    progress: 0,
    items: [
      { id: "14", title: "Optimize conversion funnel", completed: false },
      { id: "15", title: "Scale paid acquisition", completed: false },
      { id: "16", title: "Build referral program", completed: false },
      { id: "17", title: "Prepare for Series A", completed: false },
    ],
  },
]

export default function RoadmapPage() {
  const [phaseItems, setPhaseItems] = React.useState(phases)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newTask, setNewTask] = React.useState("")
  const [selectedPhase, setSelectedPhase] = React.useState("")

  const toggleItem = (phaseId: string, itemId: string) => {
    setPhaseItems((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase
        const items = phase.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
        const completed = items.filter((i) => i.completed).length
        const progress = Math.round((completed / items.length) * 100)
        return { ...phase, items, progress }
      })
    )
  }

  const addTask = () => {
    if (!newTask.trim() || !selectedPhase) return
    setPhaseItems((prev) =>
      prev.map((phase) => {
        if (phase.id !== selectedPhase) return phase
        const items = [...phase.items, { id: String(Date.now()), title: newTask, completed: false }]
        const completed = items.filter((i) => i.completed).length
        const progress = Math.round((completed / items.length) * 100)
        return { ...phase, items, progress }
      })
    )
    setNewTask("")
    setDialogOpen(false)
    toast.success("Task added to roadmap!")
  }

  const totalCompleted = phaseItems.reduce((acc, p) => acc + p.items.filter((i) => i.completed).length, 0)
  const totalItems = phaseItems.reduce((acc, p) => acc + p.items.length, 0)
  const totalProgress = Math.round((totalCompleted / totalItems) * 100)

  // Milestone tracker
  const milestones = [
    { id: "idea", label: "Idea", icon: Lightbulb, description: "Validate your concept", threshold: 0 },
    { id: "mvp", label: "MVP", icon: Wrench, description: "Build minimum viable product", threshold: 15 },
    { id: "first-customer", label: "First Customer", icon: Star, description: "Get your first paying user", threshold: 30 },
    { id: "10k-mrr", label: "$10K MRR", icon: Target, description: "Reach $10K monthly revenue", threshold: 50 },
    { id: "100k-mrr", label: "$100K MRR", icon: DollarSign, description: "Scale to $100K monthly revenue", threshold: 75 },
    { id: "series-a", label: "Series A", icon: Crown, description: "Raise your Series A round", threshold: 90 },
    { id: "scale", label: "Scale", icon: Flag, description: "Scale operations globally", threshold: 100 },
  ]

  const currentMilestoneIndex = milestones.reduce((acc, m, i) => (totalProgress >= m.threshold ? i : acc), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Roadmap</h1>
          <p className="text-muted-foreground mt-1">Track your startup milestones from idea to scale</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]">
              <Plus className="size-4 mr-2" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phase</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                >
                  <option value="">Select a phase</option>
                  {phaseItems.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Task</label>
                <Input
                  placeholder="Enter task description"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
              </div>
              <Button
                className="w-full bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
                onClick={addTask}
              >
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold gradient-text">{totalProgress}% ({totalCompleted}/{totalItems} tasks)</span>
          </div>
          <Progress value={totalProgress} className="h-2.5" />
        </CardContent>
      </Card>

      {/* Milestone Tracker */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Flag className="size-5 text-[#7CFC00]" /> Startup Milestones
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              <PartyPopper className="size-3 mr-1" />
              {currentMilestoneIndex + 1}/{milestones.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Visual Milestone Timeline */}
          <div className="relative overflow-x-auto pb-2">
            <div className="flex items-center min-w-[600px] px-2">
              {milestones.map((milestone, index) => {
                const isReached = totalProgress >= milestone.threshold
                const isCurrent = index === currentMilestoneIndex
                const Icon = milestone.icon

                return (
                  <div key={milestone.id} className="flex items-center flex-1">
                    {/* Milestone Node */}
                    <div className="flex flex-col items-center relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isReached
                            ? isCurrent
                              ? "bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] ring-4 ring-[#7CFC00]/20 shadow-lg shadow-[#7CFC00]/25"
                              : "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                            : "bg-muted/50 text-muted-foreground/40 border-2 border-dashed border-muted-foreground/20"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <p
                        className={`text-[10px] font-medium mt-1.5 text-center whitespace-nowrap ${
                          isReached ? "text-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {milestone.label}
                      </p>
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CFC00] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7CFC00]" />
                        </span>
                      )}
                    </div>
                    {/* Connector Line */}
                    {index < milestones.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1 mt-[-18px]">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isReached && index < currentMilestoneIndex
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : isReached && index === currentMilestoneIndex
                              ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D]"
                              : "bg-muted-foreground/20"
                          }`}
                          style={{
                            width:
                              isReached && index === currentMilestoneIndex
                                ? `${((totalProgress - milestone.threshold) / (milestones[index + 1]?.threshold - milestone.threshold)) * 100}%`
                                : isReached
                                ? "100%"
                                : "0%",
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {currentMilestoneIndex < milestones.length - 1
              ? `Next milestone: ${milestones[currentMilestoneIndex + 1]?.label} (${milestones[currentMilestoneIndex + 1]?.threshold}% progress needed)`
              : "You've reached the final milestone!"}
          </p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-6">
        {phaseItems.map((phase, phaseIndex) => (
          <Card key={phase.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                      <phase.icon className="size-5 text-white" />
                    </div>
                    {phaseIndex < phaseItems.length - 1 && (
                      <div className="hidden sm:block w-8 h-0.5 bg-muted ml-2" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading">{phase.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={phase.progress} className="h-1.5 w-24" />
                      <span className="text-xs text-muted-foreground">{phase.progress}%</span>
                    </div>
                  </div>
                </div>
                <Badge variant={phase.progress === 100 ? "default" : "secondary"} className="ml-auto text-xs">
                  {phase.progress === 100 ? (
                    <><CheckCircle2 className="size-3 mr-1" /> Complete</>
                  ) : phase.progress > 0 ? (
                    "In Progress"
                  ) : (
                    "Not Started"
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {phase.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-smooth"
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(phase.id, item.id)}
                      className={item.completed ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" : ""}
                    />
                    <span className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
