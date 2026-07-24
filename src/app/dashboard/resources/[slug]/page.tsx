"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Download,
  GraduationCap,
  Lock,
  Bookmark,
  BookmarkCheck,
  Clock,
  Loader2,
  Crown,
  Share2,
  Eye,
} from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"

const typeIcons: Record<string, React.ElementType> = {
  BLOG: BookOpen,
  TEMPLATE: FileText,
  VIDEO: Video,
  PDF: Download,
  GUIDE: GraduationCap,
}

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [resource, setResource] = React.useState<{
    id: string
    title: string
    slug: string | null
    description: string | null
    content: string | null
    type: string
    category: string | null
    tags: string | null
    readTime: string | null
    coverImage: string | null
    isPremium: boolean
    downloadCount: number
    accessLevel: string
    author: { id: string; name: string; image: string | null; bio: string | null } | null
  } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  React.useEffect(() => {
    if (slug) fetchResource()
  }, [slug])

  const fetchResource = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/resources/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setResource(data.resource)
      } else {
        toast.error("Resource not found")
        router.push("/dashboard/resources")
      }
    } catch (err) {
      console.error("Failed to fetch resource:", err)
      toast.error("Failed to load resource")
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = async () => {
    if (!resource) return
    setSaving(true)
    try {
      const res = await fetch("/api/resources/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: resource.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setIsSaved(data.saved)
        toast.success(data.saved ? "Resource saved" : "Resource unsaved")
      }
    } catch (err) {
      console.error("Failed to toggle save:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#3B82F6]" />
          <p className="text-sm text-muted-foreground">Loading resource...</p>
        </div>
      </div>
    )
  }

  if (!resource) return null

  const Icon = typeIcons[resource.type] || BookOpen
  const isPreview = resource.accessLevel === "preview"
  const isLocked = resource.accessLevel === "none" || isPreview

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.push("/dashboard/resources")}>
        <ArrowLeft className="size-4 mr-1" /> Back to Resources
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] dark:bg-[#1E3A8A]/30 flex items-center justify-center shrink-0 mt-1">
              <Icon className="size-6 text-[#1E3A8A] dark:text-[#3B82F6]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-heading font-bold">{resource.title}</h1>
                {resource.isPremium && (
                  <Badge className="bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] text-xs">
                    <Crown className="size-3 mr-1" /> Premium
                  </Badge>
                )}
              </div>
              {resource.description && (
                <p className="text-muted-foreground mt-1">{resource.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {resource.category && (
                  <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {resource.readTime || "5 min read"}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Eye className="size-3" /> {resource.downloadCount} views
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" onClick={toggleSave} disabled={saving}>
              {isSaved ? <BookmarkCheck className="size-5 text-[#3B82F6]" /> : <Bookmark className="size-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="size-5" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        {resource.tags && (
          <div className="flex flex-wrap gap-2">
            {resource.tags.split(",").map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag.trim()}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
        <CardContent className="p-6 sm:p-8">
          {isLocked ? (
            <div className="space-y-4">
              {/* Show preview content with proper markdown */}
              {resource.content && (
                <div className="article-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {resource.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Lock overlay */}
              <div className="relative mt-6">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />
                <div className="blur-sm select-none">
                  <p className="text-muted-foreground">
                    This premium content continues with detailed strategies, frameworks, and actionable insights for your startup journey...
                  </p>
                </div>
              </div>

              <div className="text-center py-8 border-t mt-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center mx-auto mb-4">
                  <Lock className="size-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">
                  {isPreview ? "Upgrade to Access Full Content" : "Sign In to Access"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  {isPreview
                    ? "This premium resource is available to Growth Pro and Enterprise members. Upgrade your plan to unlock it."
                    : "Sign in to access this resource and many more."}
                </p>
                {isPreview ? (
                  <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]" asChild>
                    <Link href="/dashboard/subscription">
                      <Crown className="size-4 mr-2" /> Upgrade Plan
                    </Link>
                  </Button>
                ) : (
                  <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="article-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {resource.content || ""}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Author Card */}
      {resource.author && (
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-12">
                <AvatarImage src={resource.author.image || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D]">
                  {resource.author.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{resource.author.name}</p>
                {resource.author.bio && (
                  <p className="text-xs text-muted-foreground mt-1">{resource.author.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
