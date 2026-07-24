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
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

const phaseConfig: Record<string, { name: string; icon: React.ElementType; color: string; description: string }> = {
  research: { name: "Research", icon: Search, color: "from-[#1E3A8A] to-[#93C5FD]", description: "Validate your idea and understand your market" },
  build: { name: "Build", icon: Wrench, color: "from-[#3B82F6] to-[#1E3A8A]", description: "Create your minimum viable product" },
  launch: { name: "Launch", icon: Zap, color: "from-green-500 to-emerald-500", description: "Get your product to market and first customers" },
  grow: { name: "Grow", icon: TrendingUp, color: "from-orange-500 to-red-500", description: "Scale your business and optimize performance" },
}

interface RoadmapItem {
  id: string
  title: string
  phase: string
  description: string | null
  order: number
  isCompleted: boolean
}

export default function RoadmapPage() {
  const [phases, setPhases] = React.useState<Record<string, RoadmapItem[]>>({})
  const [overallProgress, setOverallProgress] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newTask, setNewTask] = React.useState("")
  const [selectedPhase, setSelectedPhase] = React.useState("research")
  const [togglingId, setTogglingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [populating, setPopulating] = React.useState(false)

  const fetchRoadmap = React.useCallback(async () => {
    try {
      const res = await fetch("/api/roadmap")
      if (res.ok) {
        const data = await res.json()
        setPhases(data.phases || {})
        setOverallProgress(data.progress || 0)
      }
    } catch (error) {
      console.error("Failed to fetch roadmap:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchRoadmap()
  }, [fetchRoadmap])

  const toggleItem = async (itemId: string, currentCompleted: boolean) => {
    setTogglingId(itemId)
    try {
      const res = await fetch("/api/roadmap", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, isCompleted: !currentCompleted }),
      })
      if (res.ok) {
        const data = await res.json()
        setPhases((prev) => {
          const newPhases = { ...prev }
          for (const phaseKey of Object.keys(newPhases)) {
            newPhases[phaseKey] = newPhases[phaseKey].map((item) =>
              item.id === itemId ? { ...item, isCompleted: !currentCompleted } : item
            )
          }
          return newPhases
        })
        setOverallProgress(data.progress || 0)
      }
    } catch (error) {
      console.error("Failed to toggle item:", error)
      toast.error("Failed to update task")
    } finally {
      setTogglingId(null)
    }
  }

  const addTask = async () => {
    if (!newTask.trim() || !selectedPhase) return
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask.trim(), phase: selectedPhase }),
      })
      if (res.ok) {
        const item = await res.json()
        setPhases((prev) => ({
          ...prev,
          [selectedPhase]: [...(prev[selectedPhase] || []), item],
        }))
        setNewTask("")
        setDialogOpen(false)
        toast.success("Task added to roadmap!")
        fetchRoadmap()
      }
    } catch (error) {
      console.error("Failed to add task:", error)
      toast.error("Failed to add task")
    }
  }

  const deleteItem = async (itemId: string) => {
    setDeletingId(itemId)
    try {
      const res = await fetch(`/api/roadmap?id=${itemId}`, { method: "DELETE" })
      if (res.ok) {
        setPhases((prev) => {
          const newPhases = { ...prev }
          for (const phaseKey of Object.keys(newPhases)) {
            newPhases[phaseKey] = newPhases[phaseKey].filter((item) => item.id !== itemId)
          }
          return newPhases
        })
        toast.success("Task deleted")
        fetchRoadmap()
      }
    } catch (error) {
      console.error("Failed to delete item:", error)
      toast.error("Failed to delete task")
    } finally {
      setDeletingId(null)
    }
  }

  const handlePopulateDefaults = async () => {
    setPopulating(true)
    try {
      const res = await fetch("/api/roadmap/populate", { method: "POST" })
      if (res.ok) {
        toast.success("Starter tasks added to your roadmap!")
        fetchRoadmap()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to add starter tasks")
      }
    } catch {
      toast.error("Failed to add starter tasks")
    } finally {
      setPopulating(false)
    }
  }

  // Calculate totals
  const allItems = Object.values(phases).flat()
  const totalCompleted = allItems.filter((i) => i.isCompleted).length
  const totalItems = allItems.length
  const calculatedProgress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0
  const isEmpty = totalItems === 0

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

  const currentMilestoneIndex = milestones.reduce((acc, m, i) => (calculatedProgress >= m.threshold ? i : acc), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#3B82F6]" />
          <p className="text-sm text-muted-foreground">Loading roadmap...</p>
        </div>
      </div>
    )
  }

  // Default phases if none exist
  const displayPhases = Object.keys(phases).length > 0
    ? Object.entries(phases).map(([key, items]) => {
        const config = phaseConfig[key] || { name: key.charAt(0).toUpperCase() + key.slice(1), icon: Rocket, color: "from-[#1E3A8A] to-[#93C5FD]", description: "" }
        const completed = items.filter((i) => i.isCompleted).length
        const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0
        return { id: key, name: config.name, icon: config.icon, color: config.color, description: config.description, progress, items }
      })
    : Object.entries(phaseConfig).map(([key, config]) => ({
        id: key,
        name: config.name,
        icon: config.icon,
        color: config.color,
        description: config.description,
        progress: 0,
        items: [] as RoadmapItem[],
      }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Roadmap</h1>
          <p className="text-muted-foreground mt-1">Track your startup milestones from idea to scale</p>
        </div>
        <div className="flex gap-2">
          {isEmpty && (
            <Button
              variant="outline"
              className="border-[#3B82F6]/50 text-[#3B82F6] hover:bg-[#3B82F6]/10"
              onClick={handlePopulateDefaults}
              disabled={populating}
            >
              {populating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Sparkles className="size-4 mr-2" />}
              Load Starter Tasks
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4 mr-2" /> Add Task
            </Button>
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
                    {Object.entries(phaseConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
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
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]"
                  onClick={addTask}
                >
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Empty State - Show prominent starter tasks prompt */}
      {isEmpty && (
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#1E3A8A]/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="size-7 text-[#3B82F6]" />
            </div>
            <h2 className="text-lg font-heading font-bold mb-2">Not sure where to start?</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              We&apos;ve prepared 28 essential tasks across Research, Build, Launch, and Grow phases to guide you from idea to scale. These are proven steps that successful startups follow.
            </p>
            <Button
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]"
              onClick={handlePopulateDefaults}
              disabled={populating}
            >
              {populating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Sparkles className="size-4 mr-2" />}
              Load Starter Tasks
            </Button>
            <p className="text-xs text-muted-foreground mt-3">You can always add, edit, or remove tasks later</p>
          </CardContent>
        </Card>
      )}

      {/* Overall Progress */}
      {!isEmpty && (
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold gradient-text">{calculatedProgress}% ({totalCompleted}/{totalItems} tasks)</span>
            </div>
            <Progress value={calculatedProgress} className="h-2.5" />
          </CardContent>
        </Card>
      )}

      {/* Milestone Tracker */}
      {!isEmpty && (
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Flag className="size-5 text-[#3B82F6]" /> Startup Milestones
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                <PartyPopper className="size-3 mr-1" />
                {currentMilestoneIndex + 1}/{milestones.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto pb-2">
              <div className="flex items-center min-w-[600px] px-2">
                {milestones.map((milestone, index) => {
                  const isReached = calculatedProgress >= milestone.threshold
                  const isCurrent = index === currentMilestoneIndex
                  const Icon = milestone.icon

                  return (
                    <div key={milestone.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isReached
                              ? isCurrent
                                ? "bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] ring-4 ring-[#3B82F6]/20 shadow-lg shadow-[#3B82F6]/25"
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
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3B82F6]" />
                          </span>
                        )}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="flex-1 h-0.5 mx-1 mt-[-18px]">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isReached && index < currentMilestoneIndex
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : isReached && index === currentMilestoneIndex
                                ? "bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A]"
                                : "bg-muted-foreground/20"
                            }`}
                            style={{
                              width:
                                isReached && index === currentMilestoneIndex
                                  ? `${((calculatedProgress - milestone.threshold) / (milestones[index + 1]?.threshold - milestone.threshold)) * 100}%`
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
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {displayPhases.map((phase, phaseIndex) => (
          <Card key={phase.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                      <phase.icon className="size-5 text-white" />
                    </div>
                    {phaseIndex < displayPhases.length - 1 && (
                      <div className="hidden sm:block w-8 h-0.5 bg-muted ml-2" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading">{phase.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                    {phase.items.length > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={phase.progress} className="h-1.5 w-24" />
                        <span className="text-xs text-muted-foreground">{phase.progress}%</span>
                      </div>
                    )}
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
              {phase.items.length > 0 ? (
                <div className="space-y-1">
                  {phase.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-all duration-200 group"
                    >
                      <Checkbox
                        checked={item.isCompleted}
                        onCheckedChange={() => toggleItem(item.id, item.isCompleted)}
                        disabled={togglingId === item.id}
                        className={`mt-0.5 ${item.isCompleted ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" : ""}`}
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${item.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                          {item.title}
                        </span>
                        {item.description && (
                          <p className={`text-xs mt-0.5 ${item.isCompleted ? "text-muted-foreground/50 line-through" : "text-muted-foreground"}`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 opacity-0 group-hover:opacity-100 text-destructive shrink-0"
                        onClick={() => deleteItem(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No tasks in this phase yet</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-[#3B82F6]"
                    onClick={() => {
                      setSelectedPhase(phase.id)
                      setDialogOpen(true)
                    }}
                  >
                    <Plus className="size-3 mr-1" /> Add first task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
