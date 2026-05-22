"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  BookOpen,
  FileText,
  Video,
  Download,
  GraduationCap,
  Lock,
  Bookmark,
  BookmarkCheck,
  LayoutGrid,
  List,
  Clock,
  Loader2,
  ArrowRight,
  Plus,
} from "lucide-react"
import { toast } from "sonner"

const typeTabs = ["All", "Blog", "Template", "Video", "PDF", "Guide"]

const typeIcons: Record<string, React.ElementType> = {
  BLOG: BookOpen,
  TEMPLATE: FileText,
  VIDEO: Video,
  PDF: Download,
  GUIDE: GraduationCap,
}

interface Resource {
  id: string
  title: string
  slug: string | null
  description: string | null
  type: string
  category: string | null
  readTime: string | null
  isPremium: boolean
  downloadCount: number
  coverImage: string | null
  isSaved: boolean
  createdAt: string
}

export default function ResourcesPage() {
  const { data: session } = useSession()
  const isConsultant = session?.user?.role === "CONSULTANT"
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

  const [search, setSearch] = React.useState("")
  const [activeType, setActiveType] = React.useState("All")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [resources, setResources] = React.useState<Resource[]>([])
  const [loading, setLoading] = React.useState(true)
  const [savingId, setSavingId] = React.useState<string | null>(null)

  // Consultant resource creation
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [newResource, setNewResource] = React.useState({
    title: "",
    description: "",
    type: "GUIDE",
    category: "",
    tags: "",
    content: "",
    isPremium: false,
  })

  React.useEffect(() => {
    fetchResources()
  }, [activeType])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeType !== "All") params.set("type", activeType.toUpperCase())
      if (search) params.set("search", search)
      params.set("limit", "50")

      const res = await fetch(`/api/resources?${params}`)
      if (res.ok) {
        const data = await res.json()
        setResources(data.resources || [])
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = async (resourceId: string) => {
    setSavingId(resourceId)
    try {
      const res = await fetch("/api/resources/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      })
      if (res.ok) {
        const data = await res.json()
        setResources((prev) =>
          prev.map((r) =>
            r.id === resourceId ? { ...r, isSaved: data.saved } : r
          )
        )
        toast.success(data.saved ? "Resource saved" : "Resource unsaved")
      }
    } catch (err) {
      console.error("Failed to toggle save:", err)
    } finally {
      setSavingId(null)
    }
  }

  const handleCreateResource = async () => {
    if (!newResource.title.trim()) return
    try {
      setCreating(true)
      const endpoint = isConsultant ? "/api/consultant/resources" : "/api/admin/resources"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResource),
      })
      if (res.ok) {
        toast.success("Resource created successfully!")
        setNewResource({ title: "", description: "", type: "GUIDE", category: "", tags: "", content: "", isPremium: false })
        setAddDialogOpen(false)
        fetchResources()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create resource")
      }
    } catch {
      toast.error("Failed to create resource")
    } finally {
      setCreating(false)
    }
  }

  const filtered = resources.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Resources Library</h1>
          <p className="text-muted-foreground mt-1">Templates, guides, and tools for your startup journey</p>
        </div>
        {(isConsultant || isAdmin) && (
          <Button
            className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="size-4 mr-2" /> Add Resource
          </Button>
        )}
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") fetchResources() }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchResources} className="shrink-0">Search</Button>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="size-8" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="size-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="size-8" onClick={() => setViewMode("list")}>
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Type Tabs */}
      <Tabs value={activeType} onValueChange={setActiveType}>
        <TabsList>
          {typeTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
            <p className="text-sm text-muted-foreground">Loading resources...</p>
          </div>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((resource) => {
                const Icon = typeIcons[resource.type] || BookOpen
                return (
                  <Link key={resource.id} href={`/dashboard/resources/${resource.slug || resource.id}`}>
                    <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 group relative hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                      <CardContent className="p-5">
                        {resource.isPremium && (
                          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-[10px]">
                            <Lock className="size-2.5 mr-0.5" /> Premium
                          </Badge>
                        )}
                        <div className="w-10 h-10 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center mb-3">
                          <Icon className="size-5 text-[#2D4A2D] dark:text-[#7CFC00]" />
                        </div>
                        {resource.category && <Badge variant="outline" className="text-[10px] mb-2">{resource.category}</Badge>}
                        <h3 className="text-sm font-heading font-semibold mb-1 leading-snug group-hover:text-[#7CFC00] transition-colors">{resource.title}</h3>
                        {resource.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{resource.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" /> {resource.readTime || "5 min"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleSave(resource.id)
                            }}
                            disabled={savingId === resource.id}
                          >
                            {resource.isSaved ? (
                              <BookmarkCheck className="size-4 text-[#7CFC00]" />
                            ) : (
                              <Bookmark className="size-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((resource) => {
                const Icon = typeIcons[resource.type] || BookOpen
                return (
                  <Link key={resource.id} href={`/dashboard/resources/${resource.slug || resource.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-9 h-9 rounded-lg bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center shrink-0">
                        <Icon className="size-4 text-[#2D4A2D] dark:text-[#7CFC00]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium truncate group-hover:text-[#7CFC00] transition-colors">{resource.title}</h3>
                          {resource.isPremium && <Lock className="size-3 text-[#2D4A2D] shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{resource.category || "General"} · {resource.readTime || "5 min"}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleSave(resource.id)
                        }}
                        disabled={savingId === resource.id}
                      >
                        {resource.isSaved ? (
                          <BookmarkCheck className="size-4 text-[#7CFC00]" />
                        ) : (
                          <Bookmark className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-[#7CFC00] transition-colors shrink-0" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="size-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No resources found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Try a different search or filter</p>
            </div>
          )}
        </>
      )}

      {/* Add Resource Dialog (Consultant & Admin) */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title *</label>
              <Input
                placeholder="Resource title"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Type *</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
              >
                <option value="BLOG">Blog</option>
                <option value="TEMPLATE">Template</option>
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="GUIDE">Guide</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <Input
                placeholder="e.g. Marketing, Finance, Growth"
                value={newResource.category}
                onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                placeholder="Brief description of this resource..."
                className="min-h-[80px]"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Content</label>
              <Textarea
                placeholder="Full resource content (supports text)..."
                className="min-h-[150px]"
                value={newResource.content}
                onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tags (comma separated)</label>
              <Input
                placeholder="e.g. startup, growth, mvp"
                value={newResource.tags}
                onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPremium"
                checked={newResource.isPremium}
                onChange={(e) => setNewResource({ ...newResource, isPremium: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="isPremium" className="text-sm">Premium resource (paid users only)</label>
            </div>
            <Button
              className="w-full bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
              onClick={handleCreateResource}
              disabled={!newResource.title.trim() || creating}
            >
              {creating ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
              Add Resource
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
