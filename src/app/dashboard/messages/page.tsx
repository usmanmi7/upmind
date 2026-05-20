"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Paperclip,
  MessageCircle,
  Search,
  Check,
  CheckCheck,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useSocket, type NewMessageData, type TypingData } from "@/hooks/useSocket"
import { formatDistanceToNow } from "date-fns"

interface ConversationUser {
  id: string
  name: string
  image?: string | null
  role: string
}

interface Conversation {
  id: string
  user: ConversationUser
  lastMessage: string
  lastMessageTime: string
  unread: number
  online: boolean
}

interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
  status?: "sending" | "sent" | "delivered" | "read"
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const {
    isConnected,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    emitTyping,
    markAsRead,
    onNewMessage,
    onMessageNotification,
    onUserTyping,
    onMessagesRead,
  } = useSocket()

  const [activeChat, setActiveChat] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = React.useState<Record<string, boolean>>({})
  const [mobileShowChat, setMobileShowChat] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Fetch conversations on mount
  React.useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/messages")
        if (res.ok) {
          const data = await res.json()
          // Group messages by conversation partner
          const convMap = new Map<string, Conversation>()
          for (const msg of data) {
            const partnerId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId
            if (!partnerId) continue
            if (!convMap.has(partnerId)) {
              convMap.set(partnerId, {
                id: partnerId,
                user: {
                  id: partnerId,
                  name: msg.senderId === currentUserId ? msg.receiverName || "User" : msg.senderName || "User",
                  image: msg.senderId === currentUserId ? msg.receiverImage : msg.senderImage,
                  role: "CONSULTANT",
                },
                lastMessage: msg.content,
                lastMessageTime: msg.createdAt,
                unread: 0,
                online: onlineUsers.includes(partnerId),
              })
            }
          }
          setConversations(Array.from(convMap.values()))
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err)
      } finally {
        setLoading(false)
      }
    }
    if (currentUserId) {
      fetchConversations()
    }
  }, [currentUserId, onlineUsers])

  // Fetch messages for active chat
  React.useEffect(() => {
    if (!activeChat) return
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages?partnerId=${activeChat}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err)
      }
    }
    fetchMessages()
  }, [activeChat])

  // Join/leave room when active chat changes
  React.useEffect(() => {
    if (activeChat && currentUserId) {
      joinRoom(currentUserId, activeChat)
      markAsRead(currentUserId, activeChat)
    }
    return () => {
      if (activeChat && currentUserId) {
        leaveRoom(currentUserId, activeChat)
      }
    }
  }, [activeChat, currentUserId, joinRoom, leaveRoom, markAsRead])

  // Socket event listeners
  React.useEffect(() => {
    const unsubNewMessage = onNewMessage((data: NewMessageData) => {
      const newMsg: ChatMessage = {
        id: data.messageId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        isRead: false,
        createdAt: data.timestamp,
        status: "delivered",
      }
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === data.messageId)) return prev
        return [...prev, newMsg]
      })

      // Update conversations list
      setConversations((prev) => {
        const partnerId = data.senderId === currentUserId ? data.receiverId : data.senderId
        const existing = prev.find((c) => c.id === partnerId)
        if (existing) {
          return prev.map((c) =>
            c.id === partnerId
              ? {
                  ...c,
                  lastMessage: data.content,
                  lastMessageTime: data.timestamp,
                  unread: data.senderId !== currentUserId ? c.unread + 1 : c.unread,
                }
              : c
          )
        }
        return prev
      })

      // Mark as read if in active chat
      if (data.senderId !== currentUserId && data.senderId === activeChat) {
        markAsRead(currentUserId!, data.senderId)
      }
    })

    const unsubTyping = onUserTyping((data: TypingData) => {
      setTypingUsers((prev) => ({ ...prev, [data.userId]: data.isTyping }))
      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [data.userId]: false }))
        }, 3000)
      }
    })

    const unsubRead = onMessagesRead(() => {
      setMessages((prev) =>
        prev.map((m) => (m.senderId === currentUserId ? { ...m, isRead: true, status: "read" as const } : m))
      )
    })

    return () => {
      unsubNewMessage()
      unsubTyping()
      unsubRead()
    }
  }, [onNewMessage, onUserTyping, onMessagesRead, currentUserId, activeChat, markAsRead])

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle typing
  const handleTyping = React.useCallback(
    (value: string) => {
      setMessage(value)
      if (activeChat && currentUserId) {
        emitTyping(currentUserId, activeChat, true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
          emitTyping(currentUserId, activeChat, false)
        }, 2000)
      }
    },
    [activeChat, currentUserId, emitTyping]
  )

  // Handle send
  const handleSend = React.useCallback(() => {
    if (!message.trim() || !activeChat || !currentUserId) return

    const tempId = `temp-${Date.now()}`
    const optimisticMsg: ChatMessage = {
      id: tempId,
      senderId: currentUserId,
      receiverId: activeChat,
      content: message.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      status: "sending",
    }

    setMessages((prev) => [...prev, optimisticMsg])
    setMessage("")

    // Save to DB
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: activeChat, content: message.trim() }),
    })
      .then((res) => res.json())
      .then((savedMsg) => {
        // Replace optimistic message with saved one
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, id: savedMsg.id, status: "sent", createdAt: savedMsg.createdAt } : m
          )
        )
      })
      .catch(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "sent" } : m))
        )
      })

    // Send via socket
    sendMessage({
      senderId: currentUserId,
      receiverId: activeChat,
      content: message.trim(),
    })

    // Emit typing stop
    emitTyping(currentUserId, activeChat, false)
  }, [message, activeChat, currentUserId, sendMessage, emitTyping])

  const filteredConversations = conversations.filter(
    (c) =>
      c.user.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  const activeConv = conversations.find((c) => c.id === activeChat)
  const isPartnerTyping = activeChat ? typingUsers[activeChat] : false

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            Chat with your consultants
            {isConnected ? (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Wifi className="size-3" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <WifiOff className="size-3" /> Offline
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-4 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Chat List */}
        <div
          className={`lg:col-span-4 xl:col-span-3 border rounded-xl bg-card flex flex-col overflow-hidden ${
            mobileShowChat ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="size-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-2 w-40 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveChat(conv.id)
                      setMobileShowChat(true)
                      if (currentUserId) {
                        joinRoom(currentUserId, conv.id)
                        markAsRead(currentUserId, conv.id)
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      activeChat === conv.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="size-10">
                        <AvatarImage src={conv.user.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {conv.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {onlineUsers.includes(conv.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{conv.user.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: false })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate">
                          {typingUsers[conv.id] ? (
                            <span className="text-blue-500 italic">typing...</span>
                          ) : (
                            conv.lastMessage
                          )}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="bg-blue-500 text-white text-[10px] ml-2 shrink-0 h-5 min-w-5 flex items-center justify-center p-0">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div
          className={`lg:col-span-8 xl:col-span-9 border rounded-xl bg-card flex flex-col overflow-hidden ${
            mobileShowChat ? "flex" : "hidden lg:flex"
          }`}
        >
          {activeChat && activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden shrink-0"
                    onClick={() => {
                      setMobileShowChat(false)
                      if (currentUserId) leaveRoom(currentUserId, activeChat)
                    }}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <div className="relative">
                    <Avatar className="size-9">
                      <AvatarImage src={activeConv.user.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {activeConv.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {onlineUsers.includes(activeConv.user.id) && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{activeConv.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {isPartnerTyping ? (
                        <span className="text-blue-500">typing...</span>
                      ) : onlineUsers.includes(activeConv.user.id) ? (
                        "Online"
                      ) : (
                        "Offline"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Phone className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Video className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[75%]`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                                : "bg-muted/50 rounded-bl-md"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div
                            className={`flex items-center gap-1 mt-1 ${
                              isMe ? "justify-end" : ""
                            }`}
                          >
                            <p className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(new Date(msg.createdAt), {
                                addSuffix: false,
                              })}
                            </p>
                            {isMe && (
                              <span className="text-muted-foreground">
                                {msg.status === "sending" ? (
                                  <span className="text-[10px]">...</span>
                                ) : msg.status === "read" || msg.isRead ? (
                                  <CheckCheck className="size-3 text-blue-500" />
                                ) : (
                                  <Check className="size-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Typing indicator */}
                  {isPartnerTyping && (
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
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="size-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Smile className="size-4 text-muted-foreground" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && message.trim()) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shrink-0"
                    disabled={!message.trim()}
                    onClick={handleSend}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Select a conversation</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
