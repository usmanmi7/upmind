"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Loader2,
  Lock,
  Sparkles,
  Send,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

const categories = [
  { id: "general", name: "General Discussion", icon: MessageCircle, color: "from-[#2D4A2D] to-[#8FBC8F]" },
  { id: "fundraising", name: "Fundraising", icon: DollarSign, color: "from-green-500 to-emerald-500" },
  { id: "marketing", name: "Marketing", icon: Megaphone, color: "from-[#7CFC00] to-[#2D4A2D]" },
  { id: "product", name: "Product Development", icon: Code2, color: "from-orange-500 to-red-500" },
  { id: "culture", name: "Team & Culture", icon: HeartHandshake, color: "from-[#8FBC8F] to-[#2D4A2D]" },
]

interface PostAuthor {
  id: string
  name: string
  image: string | null
  startup: { name: string } | null
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: PostAuthor
}

interface Post {
  id: string
  title: string
  content: string
  category: string
  likes: number
  likeCount: number
  commentCount: number
  isLikedByUser: boolean
  createdAt: string
  author: PostAuthor
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newPost, setNewPost] = React.useState({ title: "", content: "", category: "general" })
  const [posts, setPosts] = React.useState<Post[]>([])
  const [loading, setLoading] = React.useState(true)
  const [creating, setCreating] = React.useState(false)
  const [likingId, setLikingId] = React.useState<string | null>(null)
  const [expandedPost, setExpandedPost] = React.useState<Post | null>(null)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = React.useState(false)
  const [newComment, setNewComment] = React.useState("")
  const [submittingComment, setSubmittingComment] = React.useState(false)
  const [categoryCounts, setCategoryCounts] = React.useState<Record<string, number>>({})

  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeCategory !== "all") params.set("category", activeCategory)
      if (search) params.set("search", search)
      params.set("limit", "50")

      const res = await fetch(`/api/community/posts?${params}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])

        const counts: Record<string, number> = {}
        categories.forEach((c) => { counts[c.id] = 0 })
        data.posts?.forEach((p: Post) => {
          if (counts[p.category] !== undefined) counts[p.category]++
        })
        setCategoryCounts(counts)
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, search])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return
    try {
      setCreating(true)
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      if (res.ok) {
        toast.success("Post created successfully!")
        setNewPost({ title: "", content: "", category: "general" })
        setDialogOpen(false)
        fetchPosts()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create post")
      }
    } catch {
      toast.error("Failed to create post")
    } finally {
      setCreating(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (likingId) return
    setLikingId(postId)
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
      })
      if (res.ok) {
        const data = await res.json()
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, isLikedByUser: data.liked, likeCount: data.likeCount, likes: data.likeCount }
              : p
          )
        )
        if (expandedPost?.id === postId) {
          setExpandedPost((prev) =>
            prev ? { ...prev, isLikedByUser: data.liked, likeCount: data.likeCount, likes: data.likeCount } : null
          )
        }
      }
    } catch {
      toast.error("Failed to toggle like")
    } finally {
      setLikingId(null)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Post deleted")
        setExpandedPost(null)
        fetchPosts()
      } else {
        toast.error("Failed to delete post")
      }
    } catch {
      toast.error("Failed to delete post")
    }
  }

  const openPostDetail = async (post: Post) => {
    setExpandedPost(post)
    setComments([])
    setNewComment("")
    try {
      setCommentsLoading(true)
      const res = await fetch(`/api/community/posts/${post.id}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch {
      console.error("Failed to load comments")
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !expandedPost) return
    try {
      setSubmittingComment(true)
      const res = await fetch(`/api/community/posts/${expandedPost.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })
      if (res.ok) {
        const data = await res.json()
        setComments((prev) => [...prev, data.comment])
        setPosts((prev) =>
          prev.map((p) =>
            p.id === expandedPost.id ? { ...p, commentCount: p.commentCount + 1 } : p
          )
        )
        setExpandedPost((prev) =>
          prev ? { ...prev, commentCount: prev.commentCount + 1 } : null
        )
        setNewComment("")
        toast.success("Comment added")
      } else {
        toast.error("Failed to add comment")
      }
    } catch {
      toast.error("Failed to add comment")
    } finally {
      setSubmittingComment(false)
    }
  }

  const canPost = session?.user?.role && ["FREE_USER", "PAID_USER", "CONSULTANT"].includes(session.user.role)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <UsersRound className="size-6 text-[#7CFC00]" />
            Community
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with fellow founders, share insights, and grow together
          </p>
        </div>
        {canPost && (
          <Button
            className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="size-4 mr-2" /> New Post
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
            className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-left ${
              activeCategory === cat.id
                ? "border-[#7CFC00]/50 bg-[#E8F5E9] dark:bg-[#2D4A2D]/20 shadow-sm"
                : "border-border hover:border-[#7CFC00]/30 hover:shadow-sm"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
              <cat.icon className="size-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{cat.name}</p>
              <p className="text-[10px] text-muted-foreground">{categoryCounts[cat.id] || 0} posts</p>
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

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="mt-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") fetchPosts() }}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="size-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No discussions yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Be the first to start a conversation!</p>
              {canPost && (
                <Button
                  className="mt-4 bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="size-4 mr-2" /> Create Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => openPostDetail(post)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-10 shrink-0 mt-0.5">
                        <AvatarImage src={post.author.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                          {post.author.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="text-sm font-semibold group-hover:text-[#7CFC00] transition-colors flex items-center gap-2 truncate">
                          <span className="truncate">{post.title}</span>
                          {post.likeCount >= 10 && (
                            <Badge className="bg-red-500/10 text-red-500 text-[10px] border-0 px-1.5 py-0 shrink-0">
                              <TrendingUp className="size-3 mr-0.5" /> Hot
                            </Badge>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {categories.find((c) => c.id === post.category)?.name || "General"}
                          </Badge>
                          <button
                            className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-[#7CFC00] transition-colors shrink-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(post.id)
                            }}
                          >
                            <Heart className={`size-3 ${post.isLikedByUser ? "fill-red-500 text-red-500" : ""}`} /> {post.likeCount}
                          </button>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                            <MessageCircle className="size-3" /> {post.commentCount}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                            <Clock className="size-3" /> {formatTimeAgo(post.createdAt)}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto shrink-0 truncate max-w-[180px]">
                            {post.author.name}{post.author.startup ? ` · ${post.author.startup.name}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Founder Directory - Coming Soon */}
        <TabsContent value="founders" className="mt-4">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7CFC00]/20 to-[#2D4A2D]/20 flex items-center justify-center mb-6">
              <Lock className="size-8 text-[#7CFC00]" />
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">Founder Directory</h2>
            <p className="text-muted-foreground max-w-md mb-2">
              We&apos;re building a curated directory of startup founders so you can discover, connect, and collaborate with like-minded entrepreneurs.
            </p>
            <p className="text-sm text-[#7CFC00] font-medium flex items-center gap-1.5 mb-6">
              <Sparkles className="size-4" /> Coming Soon
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Founder Profiles", "Industry Filters", "Connection Requests", "Direct Messaging"].map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs py-1 px-3">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Post Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                className="min-h-[120px] max-h-[200px]"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </div>
            <Button
              className="w-full bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
              onClick={handleCreatePost}
              disabled={!newPost.title.trim() || !newPost.content.trim() || creating}
            >
              {creating ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
              Publish Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Detail Dialog */}
      <Dialog open={!!expandedPost} onOpenChange={(open) => { if (!open) setExpandedPost(null) }}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          {expandedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-lg pr-8">{expandedPost.title}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-4 mt-2 min-h-0">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={expandedPost.author.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                      {expandedPost.author.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{expandedPost.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {expandedPost.author.startup?.name || "Founder"} · {formatTimeAgo(expandedPost.createdAt)}
                    </p>
                  </div>
                  {(expandedPost.author.id === session?.user?.id || session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 ml-auto text-muted-foreground hover:text-red-500"
                      onClick={() => handleDeletePost(expandedPost.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>

                {/* Post Content */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{expandedPost.content}</div>

                {/* Like & Stats */}
                <div className="flex items-center gap-4 py-2 border-t border-b">
                  <button
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      expandedPost.isLikedByUser ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    }`}
                    onClick={() => handleLike(expandedPost.id)}
                    disabled={!!likingId}
                  >
                    <Heart className={`size-4 ${expandedPost.isLikedByUser ? "fill-red-500" : ""}`} />
                    {expandedPost.likeCount} {expandedPost.likeCount === 1 ? "Like" : "Likes"}
                  </button>
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MessageCircle className="size-4" /> {expandedPost.commentCount} {expandedPost.commentCount === 1 ? "Comment" : "Comments"}
                  </span>
                </div>

                {/* Comments */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Comments</h4>
                  {commentsLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="size-5 animate-spin text-[#7CFC00]" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No comments yet. Be the first to share your thoughts!</p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5">
                          <Avatar className="size-7 shrink-0">
                            <AvatarImage src={comment.author.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-[10px]">
                              {comment.author.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">{comment.author.name}</span>
                              <span className="text-[10px] text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm mt-0.5 break-words">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Comment - fixed at bottom */}
              {canPost && (
                <div className="flex gap-2 pt-3 border-t mt-3 shrink-0">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment() } }}
                    disabled={submittingComment}
                  />
                  <Button
                    className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A] shrink-0"
                    size="icon"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || submittingComment}
                  >
                    {submittingComment ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
