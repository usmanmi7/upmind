"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Send,
  Lightbulb,
  Target,
  BarChart3,
  Rocket,
  FileText,
  MessageSquare,
  Brain,
  TrendingUp,
  Loader2,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickPrompts = [
  {
    label: "Analyze my startup",
    icon: BarChart3,
    prompt: "Can you analyze my startup and give me an overall assessment?",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Business plan help",
    icon: FileText,
    prompt: "Help me create a business plan for my startup. What sections should I include?",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Pitch feedback",
    icon: MessageSquare,
    prompt: "I'd like feedback on my pitch. What makes a great startup pitch?",
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Growth strategy",
    icon: TrendingUp,
    prompt: "What growth strategies should I consider for early-stage user acquisition?",
    color: "from-orange-500 to-red-500",
  },
]

const insightCards = [
  {
    title: "Market Opportunity",
    description: "Your industry is growing 23% YoY. Focus on underserved segments.",
    icon: Target,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Team Strength",
    description: "Consider adding a technical co-founder to strengthen your execution capability.",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Revenue Model",
    description: "Freemium with premium tiers works best in your space. Test pricing early.",
    icon: Lightbulb,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
]

export default function AIAssistantPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("chat")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Startup score state
  const [startupScore, setStartupScore] = React.useState<{
    loading: boolean
    data: {
      overallScore: number
      dimensions: Record<string, { score: number; recommendation: string }>
      summary: string
    } | null
  }>({ loading: false, data: null })

  // Business plan state
  const [businessPlan, setBusinessPlan] = React.useState<{
    loading: boolean
    data: {
      executiveSummary: string
      marketAnalysis: string
      strategy: string
      financialProjections: string
      timeline: string
    } | null
  }>({ loading: false, data: null })

  // Pitch feedback state
  const [pitchFeedback, setPitchFeedback] = React.useState<{
    loading: boolean
    data: {
      score: number
      clarity: number
      impact: number
      structure: number
      strengths: string[]
      improvements: string[]
      summary: string
    } | null
  }>({ loading: false, data: null })

  const [pitchText, setPitchText] = React.useState("")

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim(), history }),
      })

      const data = await res.json()

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const generateStartupScore = async () => {
    setStartupScore({ loading: true, data: null })
    try {
      const res = await fetch("/api/ai/startup-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupName: "My Startup",
          industry: "Technology",
          stage: "Early Stage",
          teamSize: "1-5",
          revenue: "Pre-revenue",
          users: "0-100",
          funding: "Bootstrapped",
        }),
      })
      const data = await res.json()
      setStartupScore({ loading: false, data: data.evaluation })
    } catch {
      setStartupScore({ loading: false, data: null })
    }
  }

  const generateBusinessPlan = async () => {
    setBusinessPlan({ loading: true, data: null })
    try {
      const res = await fetch("/api/ai/business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupName: "My Startup",
          industry: "Technology",
          stage: "Early Stage",
          goals: "Growth and market penetration",
        }),
      })
      const data = await res.json()
      setBusinessPlan({ loading: false, data: data.businessPlan })
    } catch {
      setBusinessPlan({ loading: false, data: null })
    }
  }

  const analyzePitch = async () => {
    if (!pitchText.trim()) return
    setPitchFeedback({ loading: true, data: null })
    try {
      const res = await fetch("/api/ai/pitch-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchText: pitchText.trim() }),
      })
      const data = await res.json()
      setPitchFeedback({ loading: false, data: data.feedback })
    } catch {
      setPitchFeedback({ loading: false, data: null })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Sparkles className="size-6 text-blue-500" />
            AI Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Get personalized startup advice powered by AI
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <Brain className="size-3 mr-1" /> Powered by AI
        </Badge>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {insightCards.map((card) => (
          <Card
            key={card.title}
            className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 hover:shadow-lg transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                  <card.icon className={`size-4 ${card.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">
            <MessageSquare className="size-4 mr-1.5" /> Chat
          </TabsTrigger>
          <TabsTrigger value="score">
            <BarChart3 className="size-4 mr-1.5" /> Score
          </TabsTrigger>
          <TabsTrigger value="business-plan">
            <FileText className="size-4 mr-1.5" /> Plan
          </TabsTrigger>
          <TabsTrigger value="pitch">
            <Rocket className="size-4 mr-1.5" /> Pitch
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="mt-4">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardContent className="p-0">
              <div className="h-[500px] flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="size-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          Hi, {session?.user?.name?.split(" ")[0] || "Founder"}!
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                          I&apos;m your AI startup consultant. Ask me anything about strategy,
                          planning, growth, or get feedback on your ideas.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                        {quickPrompts.map((qp) => (
                          <Button
                            key={qp.label}
                            variant="outline"
                            className="h-auto py-3 px-3 text-left justify-start"
                            onClick={() => sendMessage(qp.prompt)}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${qp.color} flex items-center justify-center shrink-0 mr-2`}
                            >
                              <qp.icon className="size-4 text-white" />
                            </div>
                            <span className="text-xs font-medium">
                              {qp.label}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] ${
                              msg.role === "user" ? "" : ""
                            }`}
                          >
                            {msg.role === "assistant" && (
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <Sparkles className="size-3 text-white" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  AI Assistant
                                </span>
                              </div>
                            )}
                            <div
                              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                msg.role === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                                  : "bg-muted/50 rounded-bl-md"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  {/* Quick prompts row */}
                  {messages.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                      {quickPrompts.map((qp) => (
                        <Button
                          key={qp.label}
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-xs"
                          onClick={() => sendMessage(qp.prompt)}
                        >
                          <qp.icon className="size-3 mr-1" />
                          {qp.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask me anything about your startup..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && input.trim()) {
                          sendMessage(input)
                        }
                      }}
                      disabled={loading}
                    />
                    <Button
                      size="icon"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shrink-0"
                      disabled={!input.trim() || loading}
                      onClick={() => sendMessage(input)}
                    >
                      {loading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Startup Score Tab */}
        <TabsContent value="score" className="mt-4">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <BarChart3 className="size-5 text-blue-500" /> Startup Score
              </CardTitle>
              <CardDescription>
                Get an AI-powered evaluation of your startup across key dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!startupScore.data && !startupScore.loading && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                    <Zap className="size-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Evaluate Your Startup
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    Our AI will analyze your startup across 5 dimensions: Market,
                    Team, Product, Traction, and Financials.
                  </p>
                  <Button
                    onClick={generateStartupScore}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Zap className="size-4 mr-2" /> Generate Score
                  </Button>
                </div>
              )}

              {startupScore.loading && (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="size-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing your startup...
                  </p>
                </div>
              )}

              {startupScore.data && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="flex flex-col items-center py-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted/30"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          strokeDasharray={`${(startupScore.data.overallScore / 100) * 327} 327`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">
                          {startupScore.data.overallScore}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /100
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 max-w-md text-center">
                      {startupScore.data.summary}
                    </p>
                  </div>

                  {/* Dimension Scores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(startupScore.data.dimensions).map(
                      ([key, dim]: [string, { score: number; recommendation: string }]) => {
                        const icons: Record<string, React.ElementType> = {
                          market: Target,
                          team: Sparkles,
                          product: Lightbulb,
                          traction: TrendingUp,
                          financials: Star,
                        }
                        const colors: Record<string, string> = {
                          market: "from-blue-500 to-cyan-500",
                          team: "from-purple-500 to-pink-500",
                          product: "from-green-500 to-emerald-500",
                          traction: "from-orange-500 to-red-500",
                          financials: "from-cyan-500 to-blue-500",
                        }
                        const Icon = icons[key] || Target
                        const color = colors[key] || "from-blue-500 to-cyan-500"

                        return (
                          <Card
                            key={key}
                            className="shadow-sm"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
                                  >
                                    <Icon className="size-4 text-white" />
                                  </div>
                                  <span className="text-sm font-semibold capitalize">
                                    {key}
                                  </span>
                                </div>
                                <span className="text-lg font-bold">
                                  {dim.score}
                                </span>
                              </div>
                              <Progress
                                value={dim.score}
                                className="h-1.5 mb-2"
                              />
                              <p className="text-xs text-muted-foreground">
                                {dim.recommendation}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={generateStartupScore}
                    className="w-full"
                  >
                    <Loader2 className={`size-4 mr-2 ${startupScore.loading ? "animate-spin" : "hidden"}`} />
                    Re-evaluate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Plan Tab */}
        <TabsContent value="business-plan" className="mt-4">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <FileText className="size-5 text-purple-500" /> Business Plan Generator
              </CardTitle>
              <CardDescription>
                Generate a structured business plan with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!businessPlan.data && !businessPlan.loading && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <FileText className="size-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Generate Your Business Plan
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    Get a comprehensive business plan covering executive summary,
                    market analysis, strategy, financials, and timeline.
                  </p>
                  <Button
                    onClick={generateBusinessPlan}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <FileText className="size-4 mr-2" /> Generate Plan
                  </Button>
                </div>
              )}

              {businessPlan.loading && (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="size-8 animate-spin text-purple-500 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Generating your business plan...
                  </p>
                </div>
              )}

              {businessPlan.data && (
                <div className="space-y-4">
                  {[
                    {
                      title: "Executive Summary",
                      content: businessPlan.data.executiveSummary,
                      icon: Star,
                      color: "text-blue-500",
                    },
                    {
                      title: "Market Analysis",
                      content: businessPlan.data.marketAnalysis,
                      icon: Target,
                      color: "text-green-500",
                    },
                    {
                      title: "Strategy",
                      content: businessPlan.data.strategy,
                      icon: Lightbulb,
                      color: "text-purple-500",
                    },
                    {
                      title: "Financial Projections",
                      content: businessPlan.data.financialProjections,
                      icon: TrendingUp,
                      color: "text-orange-500",
                    },
                    {
                      title: "Timeline",
                      content: businessPlan.data.timeline,
                      icon: Rocket,
                      color: "text-cyan-500",
                    },
                  ].map((section) => (
                    <Card key={section.title} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <section.icon className={`size-4 ${section.color}`} />
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    variant="outline"
                    onClick={generateBusinessPlan}
                    className="w-full"
                  >
                    Regenerate Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pitch Feedback Tab */}
        <TabsContent value="pitch" className="mt-4">
          <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Rocket className="size-5 text-green-500" /> Pitch Feedback
              </CardTitle>
              <CardDescription>
                Get AI-powered feedback on your startup pitch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!pitchFeedback.data && !pitchFeedback.loading && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <Rocket className="size-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Analyze Your Pitch
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Paste your pitch text below and get detailed feedback on
                      clarity, impact, and structure.
                    </p>
                  </div>
                  <textarea
                    className="w-full min-h-[200px] rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Paste your pitch text here..."
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                  />
                  <Button
                    onClick={analyzePitch}
                    disabled={!pitchText.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Sparkles className="size-4 mr-2" /> Analyze Pitch
                  </Button>
                </div>
              )}

              {pitchFeedback.loading && (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="size-8 animate-spin text-green-500 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing your pitch...
                  </p>
                </div>
              )}

              {pitchFeedback.data && (
                <div className="space-y-4">
                  {/* Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Overall", score: pitchFeedback.data.score, color: "from-blue-500 to-purple-600" },
                      { label: "Clarity", score: pitchFeedback.data.clarity, color: "from-green-500 to-emerald-500" },
                      { label: "Impact", score: pitchFeedback.data.impact, color: "from-orange-500 to-red-500" },
                      { label: "Structure", score: pitchFeedback.data.structure, color: "from-cyan-500 to-blue-500" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="text-center p-3 rounded-lg bg-muted/30"
                      >
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2`}
                        >
                          <span className="text-white font-bold text-sm">
                            {item.score}
                          </span>
                        </div>
                        <p className="text-xs font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {pitchFeedback.data.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-green-500">
                        <Star className="size-4" /> Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pitchFeedback.data.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <ChevronRight className="size-4 text-green-500 mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Improvements */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-orange-500">
                        <ArrowRight className="size-4" /> Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pitchFeedback.data.improvements.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <ChevronRight className="size-4 text-orange-500 mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setPitchFeedback({ loading: false, data: null })
                      setPitchText("")
                    }}
                    className="w-full"
                  >
                    Analyze Another Pitch
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
