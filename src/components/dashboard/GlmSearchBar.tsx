"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Send,
  X,
  Loader2,
  Brain,
  ChevronUp,
  Lightbulb,
  Target,
  TrendingUp,
  FileText,
} from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIStatus {
  online: boolean
  provider: string
  model: string
  label: string
  hint?: string
}

const quickPrompts = [
  {
    label: "Analyze my startup",
    icon: Target,
    prompt: "Can you analyze my startup idea and give me an overall assessment?",
  },
  {
    label: "Business plan",
    icon: FileText,
    prompt: "Help me create a business plan for my startup. What sections should I include?",
  },
  {
    label: "Growth strategy",
    icon: TrendingUp,
    prompt: "What growth strategies should I consider for early-stage user acquisition?",
  },
  {
    label: "Pitch feedback",
    icon: Lightbulb,
    prompt: "What makes a great startup pitch? Give me feedback tips.",
  },
]

/**
 * Bottom Search Bar for the AI Assistant.
 *
 * - Renders as a fixed pill at the bottom of the dashboard.
 * - Clicking it (or pressing /) opens a sliding chat sheet.
 * - Talks to /api/ai/chat which routes to NVIDIA Build -> LM Studio -> Z AI.
 * - Shows the active model badge pulled from /api/ai/chat GET endpoint.
 */
export function GlmSearchBar() {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [status, setStatus] = React.useState<AIStatus | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Fetch AI status on mount (which model is active)
  React.useEffect(() => {
    fetch("/api/ai/chat")
      .then((r) => r.json())
      .then((data: AIStatus) => setStatus(data))
      .catch(() => setStatus(null))
  }, [])

  // Auto-scroll to latest message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Keyboard shortcut: "/" to focus, Esc handled by Sheet
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in another input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }
      if (e.key === "/" && !open) {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  // Auto-focus input when sheet opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

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
      const responseText =
        data.response ||
        data.details ||
        "I'm sorry, I couldn't generate a response. Please try again."

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: responseText,
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

  const modelLabel = status?.label || "AI Assistant"
  const isOnline = status?.online ?? false
  const firstName = session?.user?.name?.split(" ")[0] || "there"

  return (
    <>
      {/* Fixed bottom search bar - always visible on dashboard */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl px-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-full bg-background/95 backdrop-blur border border-border shadow-lg shadow-black/10 hover:shadow-xl hover:border-[#7CFC00]/50 transition-all duration-200"
              aria-label="Open AI Assistant"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="size-4 text-white" />
              </div>
              <span className="flex-1 text-left text-sm text-muted-foreground">
                Ask {modelLabel} anything about your startup...
              </span>
              <Badge
                variant="outline"
                className="hidden sm:flex items-center gap-1 text-xs shrink-0"
              >
                <Brain className="size-3 text-[#7CFC00]" />
                {modelLabel}
              </Badge>
              <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded shrink-0">
                /
              </kbd>
              <ChevronUp className="size-4 text-muted-foreground shrink-0 group-hover:text-[#7CFC00] transition-colors" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[85vh] sm:h-[80vh] max-w-3xl mx-auto rounded-t-2xl p-0 flex flex-col"
          >
            <SheetHeader className="px-4 py-3 border-b shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2 text-base">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <span>AI Assistant</span>
                  <Badge variant="secondary" className="text-xs ml-1">
                    <Brain className="size-3 mr-1 text-[#7CFC00]" />
                    {modelLabel}
                  </Badge>
                </SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              {!isOnline && status?.hint && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {status.hint}
                </p>
              )}
            </SheetHeader>

            {/* Messages area */}
            <ScrollArea className="flex-1 px-4 py-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                    <Sparkles className="size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Hi, {firstName}!</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      I&apos;m your AI consultant powered by {modelLabel}. Ask me
                      anything about strategy, planning, growth, or get feedback
                      on your ideas.
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
                        <qp.icon className="size-4 mr-2 text-[#7CFC00] shrink-0" />
                        <span className="text-xs font-medium">{qp.label}</span>
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
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] rounded-br-md"
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
            <div className="border-t p-4 shrink-0">
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
                  placeholder={`Ask ${modelLabel} anything...`}
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
          </SheetContent>
        </Sheet>
      </div>

      {/* Spacer to prevent content from being hidden behind the fixed bar */}
      <div className="h-20 sm:h-16" aria-hidden="true" />
    </>
  )
}
