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
} from "lucide-react"
import { toast } from "sonner"

const folders = ["All", "General", "Pitch Deck", "Financials", "Legal", "Marketing"]

const documents = [
  { id: 1, name: "Pitch Deck v3.pdf", folder: "Pitch Deck", type: "pdf", size: "2.4 MB", date: "Mar 12, 2024" },
  { id: 2, name: "Financial Model.xlsx", folder: "Financials", type: "xlsx", size: "1.1 MB", date: "Mar 10, 2024" },
  { id: 3, name: "Business Plan.docx", folder: "General", type: "docx", size: "850 KB", date: "Mar 8, 2024" },
  { id: 4, name: "Logo Assets.zip", folder: "Marketing", type: "zip", size: "5.2 MB", date: "Mar 5, 2024" },
  { id: 5, name: "NDA Template.pdf", folder: "Legal", type: "pdf", size: "120 KB", date: "Mar 3, 2024" },
  { id: 6, name: "Competitive Analysis.pdf", folder: "General", type: "pdf", size: "3.1 MB", date: "Mar 1, 2024" },
  { id: 7, name: "Revenue Projections.xlsx", folder: "Financials", type: "xlsx", size: "980 KB", date: "Feb 28, 2024" },
  { id: 8, name: "Brand Guidelines.pdf", folder: "Marketing", type: "pdf", size: "4.7 MB", date: "Feb 25, 2024" },
]

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
  docx: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  zip: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  png: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  jpg: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
}

export default function DocumentsPage() {
  const [search, setSearch] = React.useState("")
  const [activeFolder, setActiveFolder] = React.useState("All")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")

  const filtered = documents.filter((doc) => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase())
    const matchFolder = activeFolder === "All" || doc.folder === activeFolder
    return matchSearch && matchFolder
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">Manage your startup documents and files</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          onClick={() => toast.success("Upload dialog would open here")}
        >
          <Upload className="size-4 mr-2" /> Upload File
        </Button>
      </div>

      {/* Drag & Drop Upload Area */}
      <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-smooth">
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
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((doc) => {
            const Icon = fileTypeIcons[doc.type] || File
            const colorClass = fileTypeColors[doc.type] || "bg-muted text-muted-foreground"
            return (
              <Card key={doc.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-3`}>
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-sm font-medium truncate mb-1">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground">{doc.size} &middot; {doc.date}</p>
                  <Badge variant="outline" className="text-[10px] mt-2">{doc.folder}</Badge>
                  <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="size-7"><Download className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="size-7 text-destructive"><Trash2 className="size-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => {
            const Icon = fileTypeIcons[doc.type] || File
            const colorClass = fileTypeColors[doc.type] || "bg-muted text-muted-foreground"
            return (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border shadow-sm hover:shadow-md transition-smooth">
                <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.folder} &middot; {doc.size} &middot; {doc.date}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="size-8"><Download className="size-4" /></Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive"><Trash2 className="size-4" /></Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No documents found</p>
        </div>
      )}
    </div>
  )
}
