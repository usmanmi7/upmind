"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import PublicNavbar from "@/components/PublicNavbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Sparkles,
  Send,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  Loader2,
  RotateCcw,
  ArrowRight,
  PanelLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AIResponse,
  type StructuredAIResponse,
} from "@/components/dashboard/AIResponse"
import {
  ChatSidebarContent,
  type ChatSummary,
} from "@/components/ai-assistant/ChatSidebar"

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
    color: "from-[#1E3A8A] to-[#93C5FD]",
  },
  {
    label: "Business plan help",
    icon: FileText,
    prompt: "Help me create a business plan for my startup. What sections should I include?",
    color: "from-[#3B82F6] to-[#1E3A8A]",
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

/** Generate a short title from the first user message. */
function deriveTitle(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ")
  if (clean.length <= 50) return clean
  const words = clean.split(" ")
  let out = ""
  for (const w of words) {
    if ((out + " " + w).trim().length > 50) break
    out = (out + " " + w).trim()
  }
  return out + "…"
}

export default function PublicAIAssistantPage() {
  const { data: session, status: sessionStatus } = useSession()
  const isAuthenticated = sessionStatus === "authenticated" && !!session?.user?.id

  // --- Chat list state ---
  const [chats, setChats] = React.useState<ChatSummary[]>([])
  const [chatsLoading, setChatsLoading] = React.useState(true)
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null)

  // --- Current chat state ---
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  // Short "Picking up where we left off…" string shown above messages when
  // reopening an existing chat. Cleared when a new chat is started.
  const [reopenSummary, setReopenSummary] = React.useState<string | null>(null)
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [status, setStatus] = React.useState<AIStatus | null>(null)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // --- In-memory cache for unauthenticated chats ---
  // Map<chatId, { title, messages, updatedAt }>
  const guestChatsRef = React.useRef<
    Map<string, { title: string; messages: ChatMessage[]; updatedAt: string }>
  >(new Map())

  // Fetch AI status on mount
  React.useEffect(() => {
    fetch("/api/ai/chat/public")
      .then((r) => r.json())
      .then((data: AIStatus) => setStatus(data))
      .catch(() => setStatus(null))
  }, [])

  // Fetch chats list on mount when authenticated
  const refreshChats = React.useCallback(async () => {
    if (!isAuthenticated) {
      setChatsLoading(false)
      // populate from guest cache
      const guestList: ChatSummary[] = Array.from(guestChatsRef.current.entries())
        .map(([id, v]) => ({
          id,
          title: v.title,
          updatedAt: v.updatedAt,
          messageCount: v.messages.length,
        }))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      setChats(guestList)
      return
    }
    try {
      setChatsLoading(true)
      const res = await fetch("/api/ai/chats", { cache: "no-store" })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const list: ChatSummary[] = (data.chats || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        updatedAt: c.updatedAt,
        messageCount: c._count?.messages ?? 0,
      }))
      setChats(list)
    } catch {
      // ignore, sidebar just shows empty state
    } finally {
      setChatsLoading(false)
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    refreshChats()
  }, [refreshChats])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // --- Chat actions ---

  const startNewChat = React.useCallback(() => {
    setActiveChatId(null)
    setMessages([])
    setReopenSummary(null)
    setMobileOpen(false)
    inputRef.current?.focus()
  }, [])

  const selectChat = React.useCallback(
    async (id: string) => {
      if (id === activeChatId) {
        setMobileOpen(false)
        return
      }
      setMobileOpen(false)

      // Guest path
      if (!isAuthenticated) {
        const cached = guestChatsRef.current.get(id)
        if (cached) {
          setActiveChatId(id)
          setMessages(cached.messages)
          // Guests don't get a server-generated reopen summary, but we can
          // clear any stale one from a previous authed chat.
          setReopenSummary(null)
        }
        return
      }

      // Authed path, fetch from server
      try {
        const res = await fetch(`/api/ai/chats/${id}`, { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        const chat = data.chat
        if (!chat) return
        const mapped: ChatMessage[] = (chat.messages || []).map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.createdAt),
          structured: m.structuredJson
            ? (() => {
                try {
                  return JSON.parse(m.structuredJson) as StructuredAIResponse
                } catch {
                  return undefined
                }
              })()
            : undefined,
        }))
        setActiveChatId(id)
        setMessages(mapped)
        setReopenSummary(
          typeof data.reopenSummary === "string" ? data.reopenSummary : null
        )
      } catch {
        // ignore
      }
    },
    [activeChatId, isAuthenticated]
  )

  const renameChat = React.useCallback(
    async (id: string, title: string) => {
      setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)))
      if (!isAuthenticated) {
        const g = guestChatsRef.current.get(id)
        if (g) g.title = title
        return
      }
      try {
        await fetch(`/api/ai/chats/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        })
      } catch {
        // ignore
      }
    },
    [isAuthenticated]
  )

  const deleteChat = React.useCallback(
    async (id: string) => {
      setChats((prev) => prev.filter((c) => c.id !== id))
      if (activeChatId === id) {
        setActiveChatId(null)
        setMessages([])
      }
      if (!isAuthenticated) {
        guestChatsRef.current.delete(id)
        return
      }
      try {
        await fetch(`/api/ai/chats/${id}`, { method: "DELETE" })
      } catch {
        // ignore
      }
    },
    [activeChatId, isAuthenticated]
  )

  // --- Message send ---

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    // Optimistic UI update
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    // The "picking up where we left off" banner has served its purpose once
    // the user sends a new message, clear it so it doesn't linger.
    setReopenSummary(null)

    // If this is the first message of a new chat, derive a title and persist the chat
    let chatId = activeChatId
    const isNewChat = !chatId
    const title = deriveTitle(content)

    if (isNewChat) {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/ai/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
          })
          if (res.ok) {
            const data = await res.json()
            chatId = data.chat.id
          }
        } catch {
          // continue even if chat couldn't be created, message still works
        }
      } else {
        chatId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        guestChatsRef.current.set(chatId!, {
          title,
          messages: [userMsg],
          updatedAt: new Date().toISOString(),
        })
      }
      if (chatId) {
        setActiveChatId(chatId)
        setChats((prev) => [
          {
            id: chatId!,
            title,
            updatedAt: new Date().toISOString(),
            messageCount: 1,
          },
          ...prev,
        ])
      }
    } else if (!isAuthenticated) {
      // append to guest chat cache
      const g = guestChatsRef.current.get(chatId!)
      if (g) {
        g.messages.push(userMsg)
        g.updatedAt = new Date().toISOString()
      }
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, updatedAt: new Date().toISOString(), messageCount: (c.messageCount ?? 0) + 1 }
            : c
        )
      )
    }

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

      const hasStructured =
        data.responseType ||
        data.heading ||
        data.description ||
        data.subheading ||
        data.steps?.length ||
        data.paragraphs?.length ||
        data.answer ||
        data.optionA ||
        data.optionB ||
        data.question

      const structured: StructuredAIResponse | undefined = hasStructured
        ? {
            responseType: data.responseType as StructuredAIResponse["responseType"],
            heading: data.heading,
            description: data.description,
            subheading: data.subheading,
            steps: data.steps,
            paragraphs: data.paragraphs,
            answer: data.answer,
            optionA: data.optionA,
            optionB: data.optionB,
            question: data.question,
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

      // Persist the user + assistant messages to the chat record (authed only)
      if (chatId && isAuthenticated) {
        const structuredJson = structured ? JSON.stringify(structured) : null
        try {
          await fetch(`/api/ai/chats/${chatId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                { role: "user", content: userMsg.content },
                { role: "assistant", content: responseText, structuredJson },
              ],
            }),
          })
          // bump local list
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    updatedAt: new Date().toISOString(),
                    messageCount: (c.messageCount ?? 0) + 2,
                  }
                : c
            )
          )
        } catch {
          // ignore, chat still works in-session
        }
      } else if (chatId && !isAuthenticated) {
        const g = guestChatsRef.current.get(chatId)
        if (g) {
          g.messages.push(assistantMsg)
          g.updatedAt = new Date().toISOString()
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    updatedAt: new Date().toISOString(),
                    messageCount: (c.messageCount ?? 0) + 1,
                  }
                : c
            )
          )
        }
      }
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

  const resetChat = () => startNewChat()

  const modelLabel = status?.label || "GLM-5.2"
  const isOnline = status?.online ?? false

  // Sidebar props shared by desktop + mobile
  const sidebarProps = {
    chats,
    activeChatId,
    isAuthenticated,
    loading: chatsLoading,
    onSelect: selectChat,
    onNew: startNewChat,
    onRename: renameChat,
    onDelete: deleteChat,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar solid />
      <div className="flex flex-1">
        {/* Desktop sidebar (sticky) */}
        <aside className="hidden lg:flex w-72 shrink-0 border-r border-black/5 dark:border-white/10 sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-hidden">
          <ChatSidebarContent {...sidebarProps} />
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 pb-5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-0">
              {/* Status warning if offline */}
              {!isOnline && status?.hint && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <p className="text-sm text-amber-800 dark:text-amber-200">{status.hint}</p>
                </div>
              )}

              {/* Mobile sidebar toggle (top-left) */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9 shrink-0 mb-2"
                    aria-label="Open chat history"
                  >
                    <PanelLeft className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 max-w-[85vw] p-0 pt-10 flex flex-col overflow-hidden">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Chat history</SheetTitle>
                  </SheetHeader>
                  <ChatSidebarContent {...sidebarProps} />
                </SheetContent>
              </Sheet>

              {messages.length > 0 && (
                <div className="flex justify-end py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetChat}
                    className="h-8 gap-1.5 text-xs shrink-0"
                  >
                    <RotateCcw className="size-3.5" />
                    <span className="hidden sm:inline">New chat</span>
                  </Button>
                </div>
              )}

              {/* Messages (flow with page) */}
              <div className="py-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center mb-6 shadow-xl shadow-[#3B82F6]/20"
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
                        I&apos;m Enginest&apos;s AI assistant. Ask me anything about engineering problems, build decisions, skill matching, or get feedback on your ideas.
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
                            className="group flex items-center gap-3 p-4 rounded-2xl border border-black/5 dark:border-white/10 hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5 transition-all text-left"
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
                            <ArrowRight className="size-4 text-muted-foreground group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        )
                      })}
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reopenSummary && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5 rounded-lg border border-[#3B82F6]/20 dark:border-[#3B82F6]/15 bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 px-3.5 py-2.5"
                      >
                        <RotateCcw className="size-4 mt-0.5 text-[#3B82F6] shrink-0" />
                        <p className="text-xs leading-relaxed text-foreground/80">
                          {reopenSummary}
                        </p>
                      </motion.div>
                    )}
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
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center shrink-0 shadow-sm">
                              <Sparkles className="size-4 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] ${
                              msg.role === "user" ? "order-first" : ""
                            }`}
                          >
                            {msg.role === "assistant" && (
                              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                                <span className="text-[11px] font-medium text-muted-foreground">
                                  Enginest AI · {modelLabel}
                                </span>
                              </div>
                            )}
                            <div
                              className={`${
                                msg.role === "user"
                                  ? "px-4 py-3 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] rounded-br-md text-sm leading-relaxed whitespace-pre-wrap shadow-sm shadow-[#3B82F6]/20"
                                  : "px-1 py-1 text-sm leading-relaxed"
                              }`}
                            >
                              {msg.role === "assistant" && msg.structured ? (
                                <AIResponse data={msg.structured} fallback={msg.content} />
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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center shrink-0 shadow-sm">
                          <Sparkles className="size-4 text-white" />
                        </div>
                        <div className="px-1 py-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#3B82F6]/60 animate-bounce [animation-delay:0ms]" />
                            <div className="w-2 h-2 rounded-full bg-[#3B82F6]/60 animate-bounce [animation-delay:150ms]" />
                            <div className="w-2 h-2 rounded-full bg-[#3B82F6]/60 animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Input Bar */}
          <div className="px-4 sm:px-6 pt-4 pb-20">
            <div className="max-w-3xl mx-auto">
              {messages.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                  {quickPrompts.map((qp) => {
                    const Icon = qp.icon
                    return (
                      <Button
                        key={qp.label}
                        variant="outline"
                        size="sm"
                        className="shrink-0 text-xs h-8 gap-1.5 rounded-full border-black/10 dark:border-white/15 hover:border-[#3B82F6]/50 hover:text-[#3B82F6]"
                        onClick={() => sendMessage(qp.prompt)}
                      >
                        <Icon className="size-3" />
                        {qp.label}
                      </Button>
                    )
                  })}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  placeholder={`Ask ${modelLabel} anything about your startup...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 h-11 rounded-full border-black/10 dark:border-white/15 bg-transparent px-5 text-sm focus-visible:border-[#3B82F6] focus-visible:ring-[#3B82F6]/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && input.trim()) {
                      sendMessage(input)
                    }
                  }}
                  disabled={loading}
                />
                <Button
                  size="icon"
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] shrink-0 h-11 w-11 rounded-full shadow-md shadow-[#3B82F6]/25 disabled:opacity-40"
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
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
