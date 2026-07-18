"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import PublicNavbar from "@/components/PublicNavbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
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
  RotateCcw,
  ArrowRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
    color: "from-emerald-500 to-green-600",
  },
  {
    label: "Pitch feedback",
    icon: MessageSquare,
    prompt: "What makes a great startup pitch? Give me tips for a 5-minute pitch.",
    color: "from-amber-500 to-orange-600",
  },
]

const insightCards = [
  {
    title: "Market Opportunity",
    description: "Ask me about market analysis and competitive positioning.",
    icon: Target,
    color: "text-[#7CFC00]",
    bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/40",
  },
  {
    title: "Strategy Planning",
    description: "Get help with business plans, roadmaps, and growth strategies.",
    icon: Sparkles,
    color: "text-[#2D4A2D] dark:text-[#7CFC00]",
    bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/40",
  },
  {
    title: "Revenue Model",
    description: "Discuss pricing, monetization, and financial projections.",
    icon: Lightbulb,
    color: "text-green-600 dark:text-green-400",
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

  const resetChat = () => {
    setMessages([])
    inputRef.current?.focus()
  }

  const modelLabel = status?.label || "GLM-5.2"
  const isOnline = status?.online ?? false

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F5F5F5] to-[#ECECEC] dark:from-[#1A2E1A] dark:to-[#0F1F0F]">
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

          {/* Chat Surface */}
          <div className="rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-white dark:bg-[#1A2E1A]/60 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/40">
            {/* Chat Header Bar */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/5 dark:border-white/10 bg-gradient-to-r from-[#1A2E1A] to-[#2D4A2D]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center shadow-md shadow-[#7CFC00]/20">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1A2E1A] ${
                      isOnline ? "bg-[#7CFC00]" : "bg-amber-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-white">
                      Upmind AI
                    </h2>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#7CFC00] bg-[#7CFC00]/10 px-1.5 py-0.5 rounded">
                      {modelLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    {isOnline ? "Online • typically replies instantly" : "Offline"}
                  </p>
                </div>
              </div>

              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetChat}
                  className="text-white/70 hover:text-white hover:bg-white/10 h-8 gap-1.5 text-xs"
                >
                  <RotateCcw className="size-3.5" />
                  New chat
                </Button>
              )}
            </div>

            {/* Messages */}
            <div className="h-[600px] flex flex-col bg-[#FAFAFA] dark:bg-[#0F1F0F]/40">
              <ScrollArea className="flex-1">
                <div className="p-5 sm:p-6">
                  {messages.length === 0 ? (
                    <div className="h-full min-h-[560px] flex flex-col items-center justify-center text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center mb-6 shadow-xl shadow-[#7CFC00]/20"
                      >
                        <Sparkles className="size-10 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <h3 className="text-2xl font-heading font-bold text-foreground">
                          Hi{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : " there"}!
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
                          I&apos;m Upmind&apos;s AI consultant. Ask me anything about
                          strategy, planning, growth, or get feedback on your ideas.
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8"
                      >
                        {quickPrompts.map((qp) => {
                          const Icon = qp.icon
                          return (
                            <button
                              key={qp.label}
                              onClick={() => sendMessage(qp.prompt)}
                              className="group flex items-center gap-3 p-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1A2E1A]/60 hover:border-[#7CFC00]/40 hover:shadow-md hover:shadow-[#7CFC00]/5 transition-all text-left"
                            >
                              <div
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${qp.color} flex items-center justify-center shrink-0 shadow-sm`}
                              >
                                <Icon className="size-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-foreground block">
                                  {qp.label}
                                </span>
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                  Tap to ask
                                </span>
                              </div>
                              <ArrowRight className="size-4 text-muted-foreground group-hover:text-[#7CFC00] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          )
                        })}
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-5 max-w-3xl mx-auto">
                      <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`flex gap-3 ${
                              msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {msg.role === "assistant" && (
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center shrink-0 shadow-sm">
                                <Sparkles className="size-4 text-white" />
                              </div>
                            )}
                            <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "order-first" : ""}`}>
                              {msg.role === "assistant" && (
                                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                                  <span className="text-[11px] font-medium text-muted-foreground">
                                    Upmind AI · {modelLabel}
                                  </span>
                                </div>
                              )}
                              <div
                                className={`px-4 py-3 rounded-2xl ${
                                  msg.role === "user"
                                    ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] rounded-br-md text-sm leading-relaxed whitespace-pre-wrap shadow-sm shadow-[#7CFC00]/20"
                                    : "bg-white dark:bg-[#1A2E1A] border border-black/5 dark:border-white/10 rounded-bl-md shadow-sm"
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
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {loading && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles className="size-4 text-white" />
                          </div>
                          <div className="bg-white dark:bg-[#1A2E1A] border border-black/5 dark:border-white/10 rounded-2xl rounded-bl-md px-4 py-3.5 shadow-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-[#7CFC00]/60 animate-bounce [animation-delay:0ms]" />
                              <div className="w-2 h-2 rounded-full bg-[#7CFC00]/60 animate-bounce [animation-delay:150ms]" />
                              <div className="w-2 h-2 rounded-full bg-[#7CFC00]/60 animate-bounce [animation-delay:300ms]" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#1A2E1A]/60 px-4 sm:px-6 py-4">
                {messages.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1 max-w-3xl mx-auto">
                    {quickPrompts.map((qp) => {
                      const Icon = qp.icon
                      return (
                        <Button
                          key={qp.label}
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-xs h-8 gap-1.5 rounded-full border-black/10 dark:border-white/15 hover:border-[#7CFC00]/50 hover:text-[#7CFC00]"
                          onClick={() => sendMessage(qp.prompt)}
                        >
                          <Icon className="size-3" />
                          {qp.label}
                        </Button>
                      )
                    })}
                  </div>
                )}
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <Input
                    ref={inputRef}
                    placeholder={`Ask ${modelLabel} anything about your startup...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 h-11 rounded-full border-black/10 dark:border-white/15 bg-[#FAFAFA] dark:bg-[#0F1F0F]/60 px-5 text-sm focus-visible:border-[#7CFC00] focus-visible:ring-[#7CFC00]/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && input.trim()) {
                        sendMessage(input)
                      }
                    }}
                    disabled={loading}
                  />
                  <Button
                    size="icon"
                    className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A] shrink-0 h-11 w-11 rounded-full shadow-md shadow-[#7CFC00]/25 disabled:opacity-40"
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
                <p className="text-[10px] text-muted-foreground text-center mt-2 max-w-3xl mx-auto">
                  AI can make mistakes. Verify important information.
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4 px-1">
              <BarChart3 className="size-4 text-[#7CFC00]" />
              <h3 className="text-sm font-semibold text-foreground">
                What you can ask
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {insightCards.map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.title}
                    className="group p-5 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1A2E1A]/60 hover:border-[#7CFC00]/40 hover:shadow-lg hover:shadow-[#7CFC00]/5 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`size-5 ${card.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {card.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
