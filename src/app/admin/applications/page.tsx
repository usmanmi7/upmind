"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Linkedin,
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  User,
} from "lucide-react"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  REVIEWING: "bg-blue-100 text-blue-800 border-blue-200",
  SHORTLISTED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  INTERVIEWED: "bg-purple-100 text-purple-800 border-purple-200",
  OFFERED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  WITHDRAWN: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  REVIEWING: Eye,
  SHORTLISTED: CheckCircle2,
  INTERVIEWED: User,
  OFFERED: CheckCircle2,
  REJECTED: XCircle,
  WITHDRAWN: XCircle,
}

interface Application {
  id: string
  userId: string
  jobTitle: string
  department: string
  fullName: string
  email: string
  phone: string | null
  resumeUrl: string | null
  coverLetter: string | null
  linkedIn: string | null
  portfolio: string | null
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export default function AdminApplicationsPage() {
  const { data: session } = useSession()
  const [applications, setApplications] = React.useState<Application[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [updating, setUpdating] = React.useState(false)
  const [adminNotes, setAdminNotes] = React.useState("")

  const fetchApplications = React.useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter !== "ALL") params.set("status", statusFilter)
      params.set("page", page.toString())
      params.set("limit", "10")

      const res = await fetch(`/api/admin/applications?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setApplications(data.applications)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, page])

  React.useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedApp) return
    setUpdating(true)
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          status: newStatus,
          notes: adminNotes,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setApplications(prev =>
          prev.map(app => app.id === selectedApp.id ? { ...app, status: data.application.status, notes: data.application.notes } : app)
        )
        setSelectedApp(prev => prev ? { ...prev, status: data.application.status, notes: data.application.notes } : null)
      }
    } catch (err) {
      console.error("Failed to update application:", err)
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedApp) return
    setUpdating(true)
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          notes: adminNotes,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setApplications(prev =>
          prev.map(app => app.id === selectedApp.id ? { ...app, notes: data.application.notes } : app)
        )
        setSelectedApp(prev => prev ? { ...prev, notes: data.application.notes } : null)
      }
    } catch (err) {
      console.error("Failed to save notes:", err)
    } finally {
      setUpdating(false)
    }
  }

  const openDetail = (app: Application) => {
    setSelectedApp(app)
    setAdminNotes(app.notes || "")
    setDetailOpen(true)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  // Stats
  const pendingCount = applications.filter(a => a.status === "PENDING").length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7CFC00]/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#2D4A2D]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A2E1A]">{total}</p>
              <p className="text-xs text-gray-500">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-card border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A2E1A]">{pendingCount}</p>
              <p className="text-xs text-gray-500">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-card border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A2E1A]">
                {applications.filter(a => a.status === "REVIEWING" || a.status === "SHORTLISTED").length}
              </p>
              <p className="text-xs text-gray-500">In Review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or job title..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REVIEWING">Reviewing</SelectItem>
            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
            <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
            <SelectItem value="OFFERED">Offered</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse p-5 rounded-2xl bg-card border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => {
            const StatusIcon = statusIcons[app.status] || Clock
            const statusColor = statusColors[app.status] || "bg-gray-100 text-gray-800"

            return (
              <div
                key={app.id}
                className="p-4 sm:p-5 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => openDetail(app)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={app.user.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-[#5CBF00] to-[#2D4A2D] text-white text-xs font-bold">
                        {app.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#1A2E1A] truncate group-hover:text-[#2D4A2D] transition-colors">
                        {app.fullName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{app.email}</p>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="flex items-center gap-3 sm:min-w-[200px]">
                    <div className="w-8 h-8 rounded-lg bg-[#2D4A2D]/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-[#2D4A2D]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1A2E1A] truncate">{app.jobTitle}</p>
                      <p className="text-xs text-gray-400">{app.department}</p>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="outline" className={`text-xs ${statusColor}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {app.status}
                    </Badge>
                    <span className="text-xs text-gray-400 hidden sm:inline">{formatDate(app.createdAt)}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2D4A2D] transition-colors shrink-0" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No applications found</h3>
          <p className="text-gray-500">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your search or filters."
              : "Applications will appear here when candidates apply."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedApp.user.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-[#5CBF00] to-[#2D4A2D] text-white font-bold">
                      {selectedApp.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-lg font-bold text-[#1A2E1A]">
                      {selectedApp.fullName}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      Applied for <span className="font-medium text-[#1A2E1A]">{selectedApp.jobTitle}</span> · {selectedApp.department}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={`mailto:${selectedApp.email}`} className="text-[#2D4A2D] hover:underline truncate">
                    {selectedApp.email}
                  </a>
                </div>
                {selectedApp.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-700">{selectedApp.phone}</span>
                  </div>
                )}
                {selectedApp.linkedIn && (
                  <div className="flex items-center gap-2 text-sm">
                    <Linkedin className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={selectedApp.linkedIn.startsWith("http") ? selectedApp.linkedIn : `https://${selectedApp.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-[#2D4A2D] hover:underline truncate">
                      {selectedApp.linkedIn}
                    </a>
                  </div>
                )}
                {selectedApp.portfolio && (
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={selectedApp.portfolio.startsWith("http") ? selectedApp.portfolio : `https://${selectedApp.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-[#2D4A2D] hover:underline truncate">
                      {selectedApp.portfolio}
                    </a>
                  </div>
                )}
                {selectedApp.resumeUrl && (
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={selectedApp.resumeUrl.startsWith("http") ? selectedApp.resumeUrl : `https://${selectedApp.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#2D4A2D] hover:underline truncate">
                      View Resume / CV
                    </a>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-[#1A2E1A] mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Cover Letter
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="mt-5 p-4 rounded-xl border bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <h4 className="text-sm font-semibold text-[#1A2E1A]">Update Status</h4>
                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant="outline" className={`text-xs ${statusColors[selectedApp.status]}`}>
                      Current: {selectedApp.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Applied {formatDateTime(selectedApp.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEWED", "OFFERED", "REJECTED", "WITHDRAWN"].map((status) => {
                    const Icon = statusIcons[status]
                    return (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedApp.status === status ? "default" : "outline"}
                        className={
                          selectedApp.status === status
                            ? "bg-[#1A2E1A] hover:bg-[#243824] text-white"
                            : "border-gray-200"
                        }
                        disabled={updating || selectedApp.status === status}
                        onClick={() => handleStatusChange(status)}
                      >
                        <Icon className="w-3 h-3 mr-1.5" />
                        {status}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-[#1A2E1A] mb-2">Admin Notes</h4>
                <Textarea
                  placeholder="Add internal notes about this candidate..."
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  disabled={updating}
                  onClick={handleSaveNotes}
                >
                  {updating ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : null}
                  Save Notes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
