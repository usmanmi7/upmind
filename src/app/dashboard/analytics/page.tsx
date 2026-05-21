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
  ArrowDownRight,
  Lightbulb,
  Target,
} from "lucide-react"
import {
  LineChart,
  Line,
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

const overviewCards = [
  { icon: CheckCircle2, label: "Tasks Completed", value: "7", change: "+3 this week", trend: "up", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
  { icon: Calendar, label: "Appointments Attended", value: "12", change: "+2 this month", trend: "up", color: "text-[#1A2E1A] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
  { icon: BookOpen, label: "Resources Used", value: "23", change: "+5 this week", trend: "up", color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
  { icon: TrendingUp, label: "Startup Score", value: "72/100", change: "+8 from last month", trend: "up", color: "text-[#2D4A2D] dark:text-[#7CFC00]", bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30" },
]

const progressData = [
  { month: "Oct", score: 25 },
  { month: "Nov", score: 35 },
  { month: "Dec", score: 42 },
  { month: "Jan", score: 55 },
  { month: "Feb", score: 65 },
  { month: "Mar", score: 72 },
]

const resourceData = [
  { name: "Templates", used: 8 },
  { name: "Guides", used: 6 },
  { name: "Videos", used: 5 },
  { name: "PDFs", used: 4 },
]

const taskCompletionData = [
  { name: "Completed", value: 7, color: "#10B981" },
  { name: "In Progress", value: 3, color: "#7CFC00" },
  { name: "To Do", value: 2, color: "#94A3B8" },
]

const recommendations = [
  { icon: Target, title: "Focus on Market Validation", description: "Complete your customer interview tasks to strengthen your market positioning." },
  { icon: Lightbulb, title: "Try the Pitch Deck Template", description: "Your fundraising phase is approaching. Prepare your pitch deck early." },
  { icon: Calendar, title: "Book a Strategy Session", description: "Schedule a consultation to discuss your progress and next steps." },
]

export default function AnalyticsPage() {
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
                  {card.trend === "up" ? (
                    <ArrowUpRight className="size-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="size-3 text-red-500" />
                  )}
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
        {/* Progress Over Time */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-base font-heading">Progress Over Time</CardTitle>
            <CardDescription>Your startup score over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#7CFC00"
                    strokeWidth={2.5}
                    dot={{ fill: "#7CFC00", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "#7CFC00" }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
                  strokeDasharray={`${72 * 3.14} ${100 * 3.14}`}
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
                  <span className="text-3xl font-bold gradient-text">72</span>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              {[
                { label: "Product", value: 80 },
                { label: "Market", value: 65 },
                { label: "Team", value: 70 },
                { label: "Financials", value: 55 },
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
