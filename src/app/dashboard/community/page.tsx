"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  UsersRound,
  Search,
  Plus,
  Heart,
  MessageCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Megaphone,
  Code2,
  HeartHandshake,
  Filter,
  ArrowRight,
  UserPlus,
  Briefcase,
  Building2,
} from "lucide-react"
import { toast } from "sonner"

const categories = [
  { id: "general", name: "General Discussion", icon: MessageCircle, count: 128, color: "from-blue-500 to-cyan-500" },
  { id: "fundraising", name: "Fundraising", icon: DollarSign, count: 64, color: "from-green-500 to-emerald-500" },
  { id: "marketing", name: "Marketing", icon: Megaphone, count: 93, color: "from-purple-500 to-pink-500" },
  { id: "product", name: "Product Development", icon: Code2, count: 87, color: "from-orange-500 to-red-500" },
  { id: "culture", name: "Team & Culture", icon: HeartHandshake, count: 45, color: "from-cyan-500 to-blue-500" },
]

const forumPosts = [
  {
    id: "1",
    title: "How to validate your startup idea without spending money",
    author: { name: "Alex Rivera", avatar: null, startup: "ValidateNow" },
    category: "general",
    replies: 23,
    likes: 47,
    time: "2 hours ago",
    isHot: true,
    excerpt: "I've been testing validation techniques for the past 6 months and wanted to share what actually works...",
  },
  {
    id: "2",
    title: "Seed round vs Pre-seed: What's the right timing?",
    author: { name: "Priya Sharma", avatar: null, startup: "FinScope" },
    category: "fundraising",
    replies: 31,
    likes: 56,
    time: "4 hours ago",
    isHot: true,
    excerpt: "After closing our seed round last month, here's what I learned about timing and preparation...",
  },
  {
    id: "3",
    title: "Our growth marketing playbook: 0 to 10K users",
    author: { name: "Jordan Lee", avatar: null, startup: "GrowthKit" },
    category: "marketing",
    replies: 18,
    likes: 89,
    time: "6 hours ago",
    isHot: false,
    excerpt: "We went from zero to 10K users in 8 months. Here's the exact playbook we used...",
  },
  {
    id: "4",
    title: "Building MVPs that users actually love",
    author: { name: "Sam Chen", avatar: null, startup: "BuildFast" },
    category: "product",
    replies: 15,
    likes: 34,
    time: "8 hours ago",
    isHot: false,
    excerpt: "The biggest mistake founders make is building too much. Here's how to ship an MVP that resonates...",
  },
  {
    id: "5",
    title: "Hiring your first 5 employees: Culture fit vs skills",
    author: { name: "Maria Garcia", avatar: null, startup: "TalentFlow" },
    category: "culture",
    replies: 27,
    likes: 41,
    time: "1 day ago",
    isHot: false,
    excerpt: "Early hires define your company culture. Here's my framework for evaluating candidates...",
  },
  {
    id: "6",
    title: "Cold email templates that actually get responses from VCs",
    author: { name: "David Kim", avatar: null, startup: "PitchPerfect" },
    category: "fundraising",
    replies: 42,
    likes: 73,
    time: "1 day ago",
    isHot: true,
    excerpt: "After sending 200+ cold emails, these templates had the highest response rates...",
  },
]

const founders = [
  { id: "1", name: "Alex Rivera", startup: "ValidateNow", industry: "SaaS", stage: "Pre-seed", avatar: null },
  { id: "2", name: "Priya Sharma", startup: "FinScope", industry: "FinTech", stage: "Seed", avatar: null },
  { id: "3", name: "Jordan Lee", startup: "GrowthKit", industry: "MarTech", stage: "Series A", avatar: null },
  { id: "4", name: "Sam Chen", startup: "BuildFast", industry: "DevTools", stage: "Pre-seed", avatar: null },
  { id: "5", name: "Maria Garcia", startup: "TalentFlow", industry: "HR Tech", stage: "Seed", avatar: null },
  { id: "6", name: "David Kim", startup: "PitchPerfect", industry: "EdTech", stage: "MVP", avatar: null },
  { id: "7", name: "Emma Wilson", startup: "GreenTech", industry: "CleanTech", stage: "Series A", avatar: null },
  { id: "8", name: "Raj Patel", startup: "DataSync", industry: "Data", stage: "Seed", avatar: null },
]

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newPost, setNewPost] = React.useState({ title: "", content: "", category: "general" })
  const [connectedFounders, setConnectedFounders] = React.useState<Set<string>>(new Set())

  const filteredPosts = forumPosts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return
    toast.success("Post created successfully!")
    setNewPost({ title: "", content: "", category: "general" })
    setDialogOpen(false)
  }

  const handleConnect = (founderId: string) => {
    if (connectedFounders.has(founderId)) {
      setConnectedFounders((prev) => {
        const next = new Set(prev)
        next.delete(founderId)
        return next
      })
      toast.info("Connection removed")
    } else {
      setConnectedFounders((prev) => new Set(prev).add(founderId))
      toast.success("Connection request sent!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <UsersRound className="size-6 text-blue-500" />
            Community
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with fellow founders, share insights, and grow together
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Plus className="size-4 mr-2" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input
                  placeholder="What's on your mind?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Content</label>
                <Textarea
                  placeholder="Share your thoughts, questions, or insights..."
                  className="min-h-[120px]"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
              >
                Publish Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
            className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-left ${
              activeCategory === cat.id
                ? "border-blue-500/50 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                : "border-border hover:border-blue-500/30 hover:shadow-sm"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
              <cat.icon className="size-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{cat.name}</p>
              <p className="text-[10px] text-muted-foreground">{cat.count} posts</p>
            </div>
          </button>
        ))}
      </div>

      <Tabs defaultValue="discussions">
        <TabsList>
          <TabsTrigger value="discussions">
            <MessageCircle className="size-4 mr-1.5" /> Discussions
          </TabsTrigger>
          <TabsTrigger value="founders">
            <UsersRound className="size-4 mr-1.5" /> Founder Directory
          </TabsTrigger>
        </TabsList>

        {/* Discussions */}
        <TabsContent value="discussions" className="mt-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No discussions found</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-10 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {post.author.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold group-hover:text-blue-500 transition-colors flex items-center gap-2">
                              {post.title}
                              {post.isHot && (
                                <Badge className="bg-red-500/10 text-red-500 text-[10px] border-0 px-1.5 py-0">
                                  <TrendingUp className="size-3 mr-0.5" /> Hot
                                </Badge>
                              )}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-[10px]">
                              {categories.find((c) => c.id === post.category)?.name}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Heart className="size-3" /> {post.likes}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MessageCircle className="size-3" /> {post.replies}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" /> {post.time}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {post.author.name} · {post.author.startup}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Founder Directory */}
        <TabsContent value="founders" className="mt-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search founders..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {founders.map((founder) => (
              <Card
                key={founder.id}
                className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-4 text-center">
                  <Avatar className="size-16 mx-auto mb-3">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                      {founder.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-sm font-semibold">{founder.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Building2 className="size-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{founder.startup}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px]">
                      <Briefcase className="size-3 mr-0.5" /> {founder.industry}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {founder.stage}
                    </Badge>
                  </div>
                  <Button
                    variant={connectedFounders.has(founder.id) ? "secondary" : "outline"}
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => handleConnect(founder.id)}
                  >
                    <UserPlus className="size-3 mr-1" />
                    {connectedFounders.has(founder.id) ? "Connected" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
