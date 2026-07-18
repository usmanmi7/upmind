"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import PublicNavbar from "@/components/PublicNavbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  Send,
  Lightbulb,
  Target,
  BarChart3,
  FileText,
  MessageSquare,
  TrendingUp,
  Loader2,
  Brain,
} from "lucide-react"
import {
  AIResponse,
  type StructuredAIResponse,
} from "@/components/dashboard/AIResponse"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  structured?: StructuredAIResponse
}

interface AIStatus {
  online: boolean
  provider: string
  model: string
  label: string
  public?: boolean
  rateLimit?: { max: number; windowMs: number }
  hint?: string
}

const quickPrompts = [
  {
    label: "Analyze my startup idea",
    icon: Target,
    prompt: "I have an idea for a SaaS tool for solo founders. What should I think about first?",
    color: "from-[#2D4A2D] to-[#8FBC8F]",
  },
  {
    label: "Business plan help",
    icon: FileText,
    prompt: "Help me create a business plan for my startup. What sections should I include?",
    color: "from-[#7CFC00] to-[#2D4A2D]",
  },
  {
    label: "Growth strategy",
    icon: TrendingUp,
    prompt: "What growth strategies should I consider for early-stage user acquisition?",
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Pitch feedback",
    icon: MessageSquare,
    prompt: "What makes a great startup pitch? Give me tips for a 5-minute pitch.",
    color: "from-orange-500 to-red-500",
  },
]

const insightCards = [
  {
    title: "Market Opportunity",
    description: "Ask me about market analysis and competitive positioning.",
    icon: Target,
    color: "text-[#7CFC00]",
    bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30",
  },
  {
    title: "Strategy Planning",
    description: "Get help with business plans, roadmaps, and growth strategies.",
    icon: Sparkles,
    color: "text-[#2D4A2D]",
    bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30",
  },
  {
    title: "Revenue Model",
    description: "Discuss pricing, monetization, and financial projections.",
    icon: Lightbulb,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
]

export default function PublicAIAssistantPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [status, setStatus] = React.useState<AIStatus | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Fetch AI status on mount
  React.useEffect(() => {
    fetch("/api/ai/chat/public")
      .then((r) => r.json())
      .then((data: AIStatus) => setStatus(data))
      .catch(() => setStatus(null))
  }, [])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/ai/chat/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim(), history }),
      })

      const data = await res.json()

      const responseText =
        data.response ||
        data.details ||
        "I'm sorry, I couldn't generate a response. Please try again."

      const structured: StructuredAIResponse | undefined =
        data.heading || data.description || data.subheading || data.steps?.length
          ? {
              heading: data.heading,
              description: data.description,
              subheading: data.subheading,
              steps: data.steps,
            }
          : undefined

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
        structured,
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

  const modelLabel = status?.label || "GLM-5.2"
  const isOnline = status?.online ?? false

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] dark:bg-[#1A2E1A]">
      <PublicNavbar />
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-20">
          {/* Status warning if offline */}
          {!isOnline && status?.hint && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {status.hint}
              </p>
            </div>
          )}

          {/* Chat */}
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="h-[600px] flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                        <Sparkles className="size-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          Hi{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ", there"}!
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                          I&apos;m Upmind&apos;s AI consultant. Ask me anything about
                          strategy, planning, growth, or get feedback on your ideas.
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
                          <div className="max-w-[85%] sm:max-w-[75%]">
                            {msg.role === "assistant" && (
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                                  <Sparkles className="size-3 text-white" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {modelLabel}
                                </span>
                              </div>
                            )}
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                msg.role === "user"
                                  ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] rounded-br-md text-sm leading-relaxed whitespace-pre-wrap"
                                  : "bg-muted/50 rounded-bl-md"
                              }`}
                            >
                              {msg.role === "assistant" && msg.structured ? (
                                <AIResponse
                                  data={msg.structured}
                                  fallback={msg.content}
                                />
                              ) : (
                                msg.content
                              )}
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
                      ref={inputRef}
                      placeholder={`Ask ${modelLabel} anything about your startup...`}
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
                      className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A] shrink-0"
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

          {/* AI Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {insightCards.map((card) => {
              const Icon = card.icon
              return (
                <Card
                  key={card.title}
                  className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 hover:shadow-lg transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`size-4 ${card.color}`} />
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
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
