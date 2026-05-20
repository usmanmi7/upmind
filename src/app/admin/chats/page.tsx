"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Search,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  id: string
  participants: Array<{ id: string; name: string; role: string }>
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: "open" | "in-progress" | "resolved"
  isFlagged: boolean
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isRead: boolean
  isFlagged: boolean
}

// Mock conversations data
const mockConversations: Conversation[] = [
  { id: "1", participants: [{ id: "u1", name: "Demo User", role: "PAID_USER" }, { id: "c1", name: "Dr. Sarah Chen", role: "CONSULTANT" }], lastMessage: "Let's discuss your market validation results next session.", lastMessageTime: new Date().toISOString(), unreadCount: 2, status: "open", isFlagged: false },
  { id: "2", participants: [{ id: "u2", name: "Emily Rodriguez", role: "PAID_USER" }, { id: "c2", name: "Marcus Johnson", role: "CONSULTANT" }], lastMessage: "I've been preparing the pitch deck updates.", lastMessageTime: new Date(Date.now() - 3600000).toISOString(), unreadCount: 1, status: "open", isFlagged: false },
  { id: "3", participants: [{ id: "u3", name: "Raj Kapoor", role: "PAID_USER" }, { id: "c3", name: "Dr. Aisha Patel", role: "CONSULTANT" }], lastMessage: "Raj, I've reviewed your AI architecture. Let's discuss optimizations.", lastMessageTime: new Date(Date.now() - 7200000).toISOString(), unreadCount: 0, status: "in-progress", isFlagged: true },
  { id: "4", participants: [{ id: "u4", name: "Sofia Martinez", role: "PAID_USER" }, { id: "c2", name: "Marcus Johnson", role: "CONSULTANT" }], lastMessage: "Can we reschedule our meeting to next week?", lastMessageTime: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0, status: "resolved", isFlagged: false },
  { id: "5", participants: [{ id: "u5", name: "Alex Thompson", role: "FREE_USER" }, { id: "admin", name: "Support Team", role: "ADMIN" }], lastMessage: "I need help upgrading my plan.", lastMessageTime: new Date(Date.now() - 172800000).toISOString(), unreadCount: 0, status: "resolved", isFlagged: false },
]

const mockMessages: ChatMessage[] = [
  { id: "m1", senderId: "c1", senderName: "Dr. Sarah Chen", content: "Hi! I've been reviewing your startup profile. Great progress so far!", timestamp: new Date(Date.now() - 7200000).toISOString(), isRead: true, isFlagged: false },
  { id: "m2", senderId: "u1", senderName: "Demo User", content: "Thank you! I've been working on the market validation framework.", timestamp: new Date(Date.now() - 5400000).toISOString(), isRead: true, isFlagged: false },
  { id: "m3", senderId: "c1", senderName: "Dr. Sarah Chen", content: "Excellent! Have you had a chance to run the customer interviews yet?", timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true, isFlagged: false },
  { id: "m4", senderId: "u1", senderName: "Demo User", content: "Yes, I completed 15 interviews this week. The feedback has been insightful.", timestamp: new Date(Date.now() - 1800000).toISOString(), isRead: false, isFlagged: false },
  { id: "m5", senderId: "c1", senderName: "Dr. Sarah Chen", content: "Let's discuss your market validation results next session.", timestamp: new Date(Date.now() - 900000).toISOString(), isRead: false, isFlagged: false },
]

const quickReplies = [
  "Thank you for your message. We'll get back to you shortly.",
  "Your appointment has been confirmed. Please check your dashboard for details.",
  "For plan upgrades, please visit the subscription page in your dashboard.",
  "I've forwarded your question to our consulting team. Expect a response within 24 hours.",
]

export default function AdminChatsPage() {
  const { toast } = useToast()
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(mockConversations[0])
  const [search, setSearch] = React.useState("")
  const [replyText, setReplyText] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")

  const filteredConversations = mockConversations.filter((c) => {
    const matchesSearch = c.participants.some((p) => p.name.toLowerCase().includes(search.toLowerCase())) || c.lastMessage.toLowerCase().includes(search.toLowerCase())
    if (activeTab === "open") return c.status === "open" && matchesSearch
    if (activeTab === "in-progress") return c.status === "in-progress" && matchesSearch
    if (activeTab === "resolved") return c.status === "resolved" && matchesSearch
    if (activeTab === "flagged") return c.isFlagged && matchesSearch
    return matchesSearch
  })

  const openConversations = mockConversations.filter((c) => c.status === "open").length
  const inProgressConversations = mockConversations.filter((c) => c.status === "in-progress").length
  const resolvedConversations = mockConversations.filter((c) => c.status === "resolved").length
  const flaggedMessages = mockConversations.filter((c) => c.isFlagged).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Chat Management</h2>
        <p className="text-sm text-muted-foreground">Monitor conversations and support tickets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Open", value: openConversations, icon: MessageSquare, color: "from-blue-500 to-cyan-500" },
          { title: "In Progress", value: inProgressConversations, icon: Clock, color: "from-yellow-500 to-orange-500" },
          { title: "Resolved", value: resolvedConversations, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
          { title: "Flagged", value: flaggedMessages, icon: AlertTriangle, color: "from-red-500 to-orange-500" },
        ].map((stat) => (
          <Card key={stat.title} className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Conversation List */}
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm lg:col-span-1 flex flex-col">
          <CardHeader className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="w-full h-8">
                <TabsTrigger value="all" className="text-xs flex-1">All</TabsTrigger>
                <TabsTrigger value="open" className="text-xs flex-1">Open</TabsTrigger>
                <TabsTrigger value="in-progress" className="text-xs flex-1">Active</TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs flex-1">Done</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-2 flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  selectedConversation?.id === conv.id ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xs">
                      {conv.participants[0].name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{conv.participants[0].name}</p>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-purple-500 text-white text-xs ml-1">{conv.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">with {conv.participants[1].name}</p>
                  </div>
                  {conv.isFlagged && <AlertTriangle className="size-4 text-yellow-500 shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                        {selectedConversation.participants[0].name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedConversation.participants[0].name}</CardTitle>
                      <CardDescription>with {selectedConversation.participants[1].name}</CardDescription>
                    </div>
                  </div>
                  <Badge className={selectedConversation.status === "open" ? "bg-blue-500/20 text-blue-400" : selectedConversation.status === "in-progress" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}>
                    {selectedConversation.status}
                  </Badge>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((msg) => {
                    const isSender = msg.senderId === "c1" || msg.senderId === "admin"
                    return (
                      <div key={msg.id} className={`flex gap-2 ${isSender ? "justify-start" : "justify-end"}`}>
                        {isSender && (
                          <Avatar className="size-7 mt-1">
                            <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                              {msg.senderName.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] rounded-lg p-3 ${
                          isSender ? "bg-muted" : "bg-purple-500/20 border border-purple-500/30"
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {msg.isFlagged && <AlertTriangle className="size-3 text-yellow-500" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Quick Replies + Input */}
              <div className="border-t p-4 space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickReplies.map((reply, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap text-xs shrink-0"
                      onClick={() => setReplyText(reply)}
                    >
                      <Bot className="size-3 mr-1" />
                      Reply {i + 1}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && replyText.trim()) {
                        toast({ title: "Message sent (demo)" })
                        setReplyText("")
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (replyText.trim()) {
                        toast({ title: "Message sent (demo)" })
                        setReplyText("")
                      }
                    }}
                    className="bg-gradient-to-r from-purple-500 to-violet-600 text-white shrink-0"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="size-12 mx-auto mb-3 opacity-50" />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  )
}
