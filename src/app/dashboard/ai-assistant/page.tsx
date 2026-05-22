"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sparkles,
  Send,
  Globe,
  Brain,
  Loader2,
  Code,
  Lightbulb,
  BookOpen,
  Palette,
  TrendingUp,
  HelpCircle,
  MessageSquare,
  Zap,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  searched?: boolean
}

const quickPrompts = [
  {
    label: "Explain a concept",
    icon: Lightbulb,
    prompt: "Can you explain how neural networks work in simple terms?",
    color: "from-[#2D4A2D] to-[#8FBC8F]",
  },
  {
    label: "Help me code",
    icon: Code,
    prompt: "Help me write a REST API endpoint in Next.js with error handling",
    color: "from-[#7CFC00] to-[#2D4A2D]",
  },
  {
    label: "Business advice",
    icon: TrendingUp,
    prompt: "What are the most effective marketing strategies for a SaaS startup in 2025?",
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Creative writing",
    icon: Palette,
    prompt: "Help me write a compelling product description for my mobile app",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Learn something",
    icon: BookOpen,
    prompt: "What are the key principles of behavioral psychology that apply to product design?",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Solve a problem",
    icon: HelpCircle,
    prompt: "My team is struggling with communication. What frameworks can help improve team collaboration?",
    color: "from-orange-500 to-red-500",
  },
]

const topicCards = [
  {
    title: "Technology & Code",
    description: "Programming, web dev, AI, and tech trends",
    icon: Code,
    color: "text-[#7CFC00]",
    bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30",
  },
  {
    title: "Business & Strategy",
    description: "Startups, marketing, growth, and planning",
    icon: TrendingUp,
    color: "text-[#2D4A2D]",
    bg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30",
  },
  {
    title: "Knowledge & Learning",
    description: "Science, history, psychology, and more",
    icon: BookOpen,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
]

function parseMarkdown(text: string): string {
  let html = text
  // Code blocks with language
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-[#1A2E1A] dark:bg-black/40 text-[#7CFC00] p-3 rounded-lg overflow-x-auto my-2 text-xs"><code>$2</code></pre>')
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-3 mb-1">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-3 mb-1">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-3 mb-2">$1</h1>')
  // Bullet lists
  html = html.replace(/^[•\-\*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
  // Line breaks
  html = html.replace(/\n/g, '<br/>')
  return html
}

export default function AIAssistantPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [searchWeb, setSearchWeb] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
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
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          history,
          searchWeb,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // API returned an error — show meaningful message
        const errorDetail = data.details || data.error || "Unknown error"
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now()}-error`,
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorDetail}. Please try again.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMsg])
        return
      }

      const responseText =
        data.response ||
        "I'm sorry, I couldn't generate a response. Please try again."

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
        searched: data.searched || false,
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const clearChat = () => {
    setMessages([])
    inputRef.current?.focus()
  }

  const copyToClipboard = async (text: string, msgId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(msgId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback
    }
  }

  const userName = session?.user?.name?.split(" ")[0] || "there"

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header - compact */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Ask me anything — coding, business, learning, and more
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={searchWeb ? "default" : "outline"}
                  size="sm"
                  className={
                    searchWeb
                      ? "bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
                      : ""
                  }
                  onClick={() => setSearchWeb(!searchWeb)}
                >
                  <Globe className="size-3.5 mr-1.5" />
                  Web Search
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {searchWeb
                  ? "Web search is ON — I'll search the web for current information"
                  : "Turn on to search the web for up-to-date information"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={clearChat}
            >
              <RotateCcw className="size-3.5" />
            </Button>
          )}
          <Badge variant="secondary" className="hidden sm:flex">
            <Brain className="size-3 mr-1" /> AI Powered
          </Badge>
        </div>
      </div>

      {/* Chat Area - fills remaining space */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 flex-1 flex flex-col min-h-0">
        <CardContent className="p-0 flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              /* Welcome Screen */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-8">
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center mx-auto shadow-lg shadow-[#7CFC00]/20">
                    <Sparkles className="size-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold">
                    Hi, {userName}!
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    I&apos;m your AI assistant. Ask me anything — from coding help and business strategy
                    to creative writing and general knowledge. I can also search the web for current information.
                  </p>
                </div>

                {/* Topic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                  {topicCards.map((card) => (
                    <Card
                      key={card.title}
                      className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}
                          >
                            <card.icon className={`size-4 ${card.color}`} />
                          </div>
                          <div className="text-left">
                            <h3 className="text-sm font-semibold">
                              {card.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="space-y-2 w-full max-w-2xl">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Try asking...
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quickPrompts.map((qp) => (
                      <Button
                        key={qp.label}
                        variant="outline"
                        className="h-auto py-2.5 px-3 text-left justify-start group hover:border-[#7CFC00]/30"
                        onClick={() => sendMessage(qp.prompt)}
                      >
                        <div
                          className={`w-7 h-7 rounded-md bg-gradient-to-br ${qp.color} flex items-center justify-center shrink-0 mr-2`}
                        >
                          <qp.icon className="size-3.5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {qp.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Web search hint */}
                {!searchWeb && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                    <Globe className="size-3.5" />
                    <span>
                      Turn on <strong>Web Search</strong> for up-to-date information
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-5 max-w-4xl mx-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] ${
                        msg.role === "assistant" ? "w-full sm:w-[80%]" : ""
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                            <Sparkles className="size-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            AI Assistant
                          </span>
                          {msg.searched && (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 px-1.5 gap-0.5"
                            >
                              <Globe className="size-2.5" /> Searched
                            </Badge>
                          )}
                        </div>
                      )}
                      <div
                        className={`${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] px-4 py-3 rounded-2xl rounded-br-md text-sm leading-relaxed"
                            : ""
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
                            <div
                              className="text-sm leading-relaxed prose-sm max-w-none [&_pre]:my-2 [&_code]:text-[#7CFC00] [&_strong]:text-foreground [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_li]:text-sm [&_li]:text-muted-foreground"
                              dangerouslySetInnerHTML={{
                                __html: parseMarkdown(msg.content),
                              }}
                            />
                            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                                onClick={() =>
                                  copyToClipboard(msg.content, msg.id)
                                }
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="size-3 mr-1" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="size-3 mr-1" /> Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                          <Sparkles className="size-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          AI Assistant
                        </span>
                        {searchWeb && (
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 px-1.5 gap-0.5"
                          >
                            <Globe className="size-2.5 animate-pulse" />{" "}
                            Searching...
                          </Badge>
                        )}
                      </div>
                      <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t shrink-0">
            {/* Quick prompts row when in conversation */}
            {messages.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                {quickPrompts.map((qp) => (
                  <Button
                    key={qp.label}
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs h-7"
                    onClick={() => sendMessage(qp.prompt)}
                    disabled={loading}
                  >
                    <qp.icon className="size-3 mr-1" />
                    {qp.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Search indicator */}
            {searchWeb && (
              <div className="flex items-center gap-1.5 mb-2 text-xs text-[#7CFC00]">
                <Globe className="size-3" />
                <span>Web search enabled — I&apos;ll look up current information for you</span>
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  placeholder={
                    searchWeb
                      ? "Ask anything — I'll search the web for current info..."
                      : "Ask me anything..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="pr-10 h-11"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && input.trim()) {
                      sendMessage(input)
                    }
                  }}
                  disabled={loading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`size-7 ${
                            searchWeb
                              ? "text-[#7CFC00] hover:text-[#6BE000]"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => setSearchWeb(!searchWeb)}
                        >
                          <Globe className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {searchWeb
                          ? "Web search ON"
                          : "Turn on web search"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Button
                size="icon"
                className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A] shrink-0 h-11 w-11"
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
        </CardContent>
      </Card>
    </div>
  )
}
