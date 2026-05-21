"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

const typeTabs = ["All", "Blog", "Template", "Video", "PDF", "Guide"]

const resources = [
  { id: 1, title: "The Ultimate Startup Validation Framework", category: "Startup Tips", type: "GUIDE", isPremium: false, readTime: "15 min", saved: false },
  { id: 2, title: "Pitch Deck Template That Raised $5M", category: "Funding", type: "TEMPLATE", isPremium: true, readTime: "Template", saved: true },
  { id: 3, title: "AI-Powered Growth Hacking Playbook", category: "AI", type: "PDF", isPremium: true, readTime: "25 min", saved: false },
  { id: 4, title: "Building a Brand That Stands Out", category: "Branding", type: "BLOG", isPremium: false, readTime: "8 min", saved: true },
  { id: 5, title: "Content Marketing Strategy for Startups", category: "Marketing", type: "GUIDE", isPremium: false, readTime: "12 min", saved: false },
  { id: 6, title: "Financial Model Template", category: "Funding", type: "TEMPLATE", isPremium: true, readTime: "Template", saved: false },
  { id: 7, title: "Hiring Your First 10 Employees", category: "Startup Tips", type: "VIDEO", isPremium: false, readTime: "30 min", saved: true },
  { id: 8, title: "Marketing Automation with AI", category: "AI", type: "VIDEO", isPremium: true, readTime: "20 min", saved: false },
  { id: 9, title: "Social Media Playbook 2024", category: "Marketing", type: "PDF", isPremium: false, readTime: "10 min", saved: false },
  { id: 10, title: "Startup Legal Essentials Checklist", category: "Startup Tips", type: "TEMPLATE", isPremium: false, readTime: "Template", saved: false },
]

const recentlyViewed = [
  { title: "Pitch Deck Template", time: "2 hours ago" },
  { title: "Startup Validation Framework", time: "Yesterday" },
  { title: "Content Marketing Strategy", time: "3 days ago" },
]

const typeIcons: Record<string, React.ElementType> = {
  BLOG: BookOpen,
  TEMPLATE: FileText,
  VIDEO: Video,
  PDF: Download,
  GUIDE: GraduationCap,
}

export default function ResourcesPage() {
  const [search, setSearch] = React.useState("")
  const [activeType, setActiveType] = React.useState("All")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [savedItems, setSavedItems] = React.useState<Set<number>>(new Set([2, 4, 7]))

  const toggleSave = (id: number) => {
    setSavedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
    const matchType = activeType === "All" || r.type === activeType.toUpperCase()
    return matchSearch && matchType
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Resources Library</h1>
        <p className="text-muted-foreground mt-1">Templates, guides, and tools for your startup journey</p>
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search resources..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
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

      {/* Recently Viewed */}
      {search === "" && activeType === "All" && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Recently Viewed</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentlyViewed.map((item) => (
              <div key={item.title} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border shrink-0">
                <Clock className="size-3.5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => {
            const Icon = typeIcons[resource.type] || BookOpen
            const isSaved = savedItems.has(resource.id)
            return (
              <Card key={resource.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 group relative">
                <CardContent className="p-5">
                  {resource.isPremium && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-[10px]">
                      <Lock className="size-2.5 mr-0.5" /> Premium
                    </Badge>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center mb-3">
                    <Icon className="size-5 text-[#2D4A2D] dark:text-[#7CFC00]" />
                  </div>
                  <Badge variant="outline" className="text-[10px] mb-2">{resource.category}</Badge>
                  <h3 className="text-sm font-heading font-semibold mb-1 leading-snug">{resource.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-muted-foreground">{resource.readTime}</span>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => toggleSave(resource.id)}>
                      {isSaved ? <BookmarkCheck className="size-4 text-[#7CFC00]" /> : <Bookmark className="size-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((resource) => {
            const Icon = typeIcons[resource.type] || BookOpen
            const isSaved = savedItems.has(resource.id)
            return (
              <div key={resource.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm hover:shadow-md transition-smooth">
                <div className="w-9 h-9 rounded-lg bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-[#2D4A2D] dark:text-[#7CFC00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">{resource.title}</h3>
                    {resource.isPremium && <Lock className="size-3 text-[#2D4A2D] shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.category} &middot; {resource.readTime}</p>
                </div>
                <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => toggleSave(resource.id)}>
                  {isSaved ? <BookmarkCheck className="size-4 text-[#7CFC00]" /> : <Bookmark className="size-4 text-muted-foreground" />}
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No resources found</p>
        </div>
      )}
    </div>
  )
}
