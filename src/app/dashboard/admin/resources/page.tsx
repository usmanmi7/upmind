"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  FileText,
  Video,
  FileSpreadsheet,
  Lightbulb,
  Lock,
  Unlock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Resource {
  id: string
  title: string
  description: string | null
  type: string
  category: string | null
  tags: string | null
  isPremium: boolean
  downloadCount: number
  createdAt: string
  _count: { savedBy: number }
}

const typeIcons: Record<string, React.ElementType> = {
  BLOG: FileText,
  TEMPLATE: FileSpreadsheet,
  VIDEO: Video,
  PDF: BookOpen,
  GUIDE: Lightbulb,
}

const typeColors: Record<string, string> = {
  BLOG: "bg-[#3B82F6]/20 text-[#3B82F6]",
  TEMPLATE: "bg-[#3B82F6]/20 text-[#3B82F6]",
  VIDEO: "bg-red-500/20 text-red-400",
  PDF: "bg-green-500/20 text-green-400",
  GUIDE: "bg-yellow-500/20 text-yellow-400",
}

export default function AdminResourcesPage() {
  const { toast } = useToast()
  const [resources, setResources] = React.useState<Resource[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [premiumFilter, setPremiumFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [addOpen, setAddOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [selectedResource, setSelectedResource] = React.useState<Resource | null>(null)
  const [form, setForm] = React.useState({
    title: "", description: "", type: "GUIDE", category: "", tags: "", isPremium: false,
  })

  const fetchResources = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", page.toString())
      params.set("limit", "10")
      if (search) params.set("search", search)
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter)
      if (categoryFilter && categoryFilter !== "all") params.set("category", categoryFilter)
      if (premiumFilter === "premium") params.set("isPremium", "true")
      else if (premiumFilter === "free") params.set("isPremium", "false")

      const res = await fetch(`/api/admin/resources?${params}`)
      if (res.ok) {
        const json = await res.json()
        setResources(json.resources)
        setTotalPages(json.pagination.totalPages)
        setTotal(json.pagination.total)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, search, typeFilter, categoryFilter, premiumFilter])

  React.useEffect(() => { fetchResources() }, [fetchResources])

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: "Resource created successfully" })
        setAddOpen(false)
        setForm({ title: "", description: "", type: "GUIDE", category: "", tags: "", isPremium: false })
        fetchResources()
      }
    } catch {
      toast({ title: "Failed to create resource", variant: "destructive" })
    }
  }

  const handleEdit = async () => {
    if (!selectedResource) return
    try {
      const res = await fetch("/api/admin/resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: selectedResource.id, ...form }),
      })
      if (res.ok) {
        toast({ title: "Resource updated successfully" })
        setEditOpen(false)
        fetchResources()
      }
    } catch {
      toast({ title: "Failed to update resource", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!selectedResource) return
    try {
      const res = await fetch(`/api/admin/resources?id=${selectedResource.id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Resource deleted successfully" })
        setDeleteOpen(false)
        fetchResources()
      }
    } catch {
      toast({ title: "Failed to delete resource", variant: "destructive" })
    }
  }

  const openEditDialog = (resource: Resource) => {
    setSelectedResource(resource)
    setForm({
      title: resource.title,
      description: resource.description || "",
      type: resource.type,
      category: resource.category || "",
      tags: resource.tags || "",
      isPremium: resource.isPremium,
    })
    setEditOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Resource Management</h2>
          <p className="text-sm text-muted-foreground">{total} resources</p>
        </div>
        <Button
          onClick={() => {
            setForm({ title: "", description: "", type: "GUIDE", category: "", tags: "", isPremium: false })
            setAddOpen(true)
          }}
          className="bg-gradient-to-r from-[#5CBF00] to-[#1E3A8A] hover:from-[#2563EB] hover:to-[#0F1B3D] text-white"
        >
          <Plus className="size-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search resources..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BLOG">Blog</SelectItem>
                <SelectItem value="TEMPLATE">Template</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="GUIDE">Guide</SelectItem>
              </SelectContent>
            </Select>
            <Select value={premiumFilter} onValueChange={(v) => { setPremiumFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Access" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="hidden lg:table-cell">Downloads</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={7} className="h-16"><div className="animate-pulse bg-muted rounded h-8" /></TableCell></TableRow>
                  ))
                ) : resources.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No resources found</TableCell></TableRow>
                ) : (
                  resources.map((resource) => {
                    const TypeIcon = typeIcons[resource.type] || BookOpen
                    return (
                      <TableRow key={resource.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[resource.type] || "bg-muted"}`}>
                              <TypeIcon className="size-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium max-w-[200px] truncate">{resource.title}</p>
                              <p className="text-xs text-muted-foreground">{resource._count.savedBy} saves</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={typeColors[resource.type] || ""}>
                            {resource.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {resource.category || "—"}
                        </TableCell>
                        <TableCell>
                          {resource.isPremium ? (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Lock className="size-3 mr-1" />Premium</Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Unlock className="size-3 mr-1" />Free</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <Download className="size-3 text-muted-foreground" />
                            {resource.downloadCount}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(resource)}>
                                <Edit className="size-4 mr-2" />Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { setSelectedResource(resource); setDeleteOpen(true) }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-4 mr-2" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages} ({total} resources)</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Resource Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>Create a new resource</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Resource title" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe the resource..." rows={3} /></div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLOG">Blog</SelectItem>
                  <SelectItem value="TEMPLATE">Template</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="GUIDE">Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g., Startup Tips" /></div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="e.g., marketing, growth" /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div><Label>Premium</Label><p className="text-xs text-muted-foreground">Only for paid users</p></div>
              <Switch checked={form.isPremium} onCheckedChange={(checked) => setForm((p) => ({ ...p, isPremium: checked }))} />
            </div>
            <Button onClick={handleAdd} className="w-full bg-gradient-to-r from-[#5CBF00] to-[#1E3A8A] text-white">Create Resource</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update resource details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} /></div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLOG">Blog</SelectItem>
                  <SelectItem value="TEMPLATE">Template</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="GUIDE">Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} /></div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div><Label>Premium</Label><p className="text-xs text-muted-foreground">Only for paid users</p></div>
              <Switch checked={form.isPremium} onCheckedChange={(checked) => setForm((p) => ({ ...p, isPremium: checked }))} />
            </div>
            <Button onClick={handleEdit} className="w-full bg-gradient-to-r from-[#5CBF00] to-[#1E3A8A] text-white">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
