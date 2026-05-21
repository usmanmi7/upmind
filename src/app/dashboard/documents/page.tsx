"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Upload,
  Search,
  Folder,
  Grid,
  List,
  Download,
  Trash2,
  Eye,
  File,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

interface Document {
  id: string
  name: string
  fileUrl: string
  fileType: string
  size: number
  folder: string
  createdAt: string
}

const fileTypeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileText,
  zip: File,
  png: FileImage,
  jpg: FileImage,
}

const fileTypeColors: Record<string, string> = {
  pdf: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  xlsx: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  docx: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 text-[#2D4A2D] dark:text-[#7CFC00]",
  zip: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 text-[#1A2E1A] dark:text-[#7CFC00]",
  png: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 text-[#2D4A2D] dark:text-[#7CFC00]",
  jpg: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 text-[#2D4A2D] dark:text-[#7CFC00]",
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export default function DocumentsPage() {
  const [documents, setDocuments] = React.useState<Document[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [activeFolder, setActiveFolder] = React.useState("All")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [newDocName, setNewDocName] = React.useState("")
  const [newDocFolder, setNewDocFolder] = React.useState("General")

  React.useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/documents")
        if (res.ok) {
          const data = await res.json()
          setDocuments(data)
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const folders = ["All", ...Array.from(new Set(documents.map((d) => d.folder))).sort()]

  const filtered = documents.filter((doc) => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase())
    const matchFolder = activeFolder === "All" || doc.folder === activeFolder
    return matchSearch && matchFolder
  })

  const handleUpload = async () => {
    if (!newDocName.trim()) {
      toast.error("Please enter a document name")
      return
    }

    setUploading(true)
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDocName.trim(),
          fileUrl: `/uploads/${newDocName.trim().replace(/\s+/g, "-").toLowerCase()}`,
          fileType: newDocName.split(".").pop()?.toLowerCase() || "pdf",
          size: 0,
          folder: newDocFolder,
        }),
      })

      if (res.ok) {
        const newDoc = await res.json()
        setDocuments((prev) => [newDoc, ...prev])
        toast.success("Document uploaded successfully!")
        setUploadDialogOpen(false)
        setNewDocName("")
      } else {
        toast.error("Failed to upload document")
      }
    } catch (error) {
      console.error("Failed to upload document:", error)
      toast.error("Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents?id=${docId}`, { method: "DELETE" })
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId))
        toast.success("Document deleted")
      }
    } catch (error) {
      console.error("Failed to delete document:", error)
      toast.error("Failed to delete document")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">Manage your startup documents and files</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]">
              <Upload className="size-4 mr-2" /> Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Document Name</label>
                <Input
                  placeholder="e.g., Pitch Deck v3.pdf"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Folder</label>
                <Select value={newDocFolder} onValueChange={setNewDocFolder}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["General", "Pitch Deck", "Financials", "Legal", "Marketing"].map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
                onClick={handleUpload}
                disabled={uploading || !newDocName.trim()}
              >
                {uploading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Uploading...</> : "Upload Document"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Drag & Drop Upload Area */}
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center hover:border-[#7CFC00]/50 hover:bg-[#E8F5E9]/50 dark:hover:bg-[#2D4A2D]/10 transition-all duration-200 cursor-pointer"
        onClick={() => setUploadDialogOpen(true)}
      >
        <Upload className="size-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm font-medium">Drag & drop files here</p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse (PDF, DOCX, XLSX, ZIP, max 25MB)</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Select value={activeFolder} onValueChange={setActiveFolder}>
            <SelectTrigger className="w-40">
              <Folder className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {folders.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 border rounded-lg p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="size-8" onClick={() => setViewMode("grid")}>
              <Grid className="size-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="size-8" onClick={() => setViewMode("list")}>
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Documents */}
      {filtered.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((doc) => {
              const Icon = fileTypeIcons[doc.fileType] || File
              const colorClass = fileTypeColors[doc.fileType] || "bg-muted text-muted-foreground"
              return (
                <Card key={doc.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 group hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-3`}>
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-sm font-medium truncate mb-1">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)} &middot; {new Date(doc.createdAt).toLocaleDateString()}</p>
                    <Badge variant="outline" className="text-[10px] mt-2">{doc.folder}</Badge>
                    <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-7"><Download className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((doc) => {
              const Icon = fileTypeIcons[doc.fileType] || File
              const colorClass = fileTypeColors[doc.fileType] || "bg-muted text-muted-foreground"
              return (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm hover:shadow-md transition-all duration-200">
                  <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.folder} &middot; {formatFileSize(doc.size)} &middot; {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="size-8"><Download className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <File className="size-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No documents found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search || activeFolder !== "All" ? "Try adjusting your filters" : "Upload your first document to get started"}
          </p>
        </div>
      )}
    </div>
  )
}
