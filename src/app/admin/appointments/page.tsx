"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarDays,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  date: string
  duration: number
  type: string
  status: string
  notes: string | null
  meetingUrl: string | null
  user: { id: string; name: string; email: string; image: string | null }
  consultant: { id: string; user: { id: string; name: string; image: string | null } } | null
}

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  RESCHEDULED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

const typeIcons: Record<string, React.ElementType> = {
  VIDEO: Video,
  PHONE: Phone,
  IN_PERSON: MapPin,
}

export default function AdminAppointmentsPage() {
  const { toast } = useToast()
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [consultantFilter, setConsultantFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null)
  const [consultants, setConsultants] = React.useState<Array<{ id: string; user: { name: string } }>>([])

  const fetchAppointments = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", page.toString())
      params.set("limit", "10")
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter)
      if (consultantFilter && consultantFilter !== "all") params.set("consultantId", consultantFilter)

      const res = await fetch(`/api/admin/appointments?${params}`)
      if (res.ok) {
        const json = await res.json()
        setAppointments(json.appointments)
        setTotalPages(json.pagination.totalPages)
        setTotal(json.pagination.total)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, consultantFilter])

  const fetchConsultants = async () => {
    try {
      const res = await fetch("/api/admin/consultants")
      if (res.ok) {
        const json = await res.json()
        setConsultants(json.consultants)
      }
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => { fetchAppointments() }, [fetchAppointments])
  React.useEffect(() => { fetchConsultants() }, [])

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status }),
      })
      if (res.ok) {
        toast({ title: `Appointment ${status.toLowerCase()}` })
        fetchAppointments()
        setDetailOpen(false)
      }
    } catch {
      toast({ title: "Failed to update appointment", variant: "destructive" })
    }
  }

  const openDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDetailOpen(true)
  }

  const stats = {
    scheduled: appointments.filter((a) => a.status === "SCHEDULED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Appointments Management</h2>
        <p className="text-sm text-muted-foreground">{total} total appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { title: "Total", value: total, icon: CalendarDays, color: "from-purple-500 to-violet-500" },
          { title: "Scheduled", value: stats.scheduled, icon: Clock, color: "from-blue-500 to-cyan-500" },
          { title: "Completed", value: stats.completed, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
          { title: "Cancelled", value: stats.cancelled, icon: XCircle, color: "from-red-500 to-orange-500" },
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

      {/* Filters */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-48"><Filter className="size-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={consultantFilter} onValueChange={(v) => { setConsultantFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Consultant" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Consultants</SelectItem>
                {consultants.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Consultant</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={6} className="h-16"><div className="animate-pulse bg-muted rounded h-8" /></TableCell></TableRow>
                  ))
                ) : appointments.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No appointments found</TableCell></TableRow>
                ) : (
                  appointments.map((apt) => {
                    const TypeIcon = typeIcons[apt.type] || Video
                    return (
                      <TableRow key={apt.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => openDetail(apt)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xs">
                                {apt.user.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{apt.user.name}</p>
                              <p className="text-xs text-muted-foreground">{apt.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {apt.consultant?.user.name || <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">Unassigned</Badge>}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(apt.date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(apt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {apt.duration}min
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <TypeIcon className="size-4 text-muted-foreground" />
                            <span className="text-sm">{apt.type.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[apt.status] || ""}>
                            {apt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDetail(apt) }}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft className="size-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}><ChevronRight className="size-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View and manage this appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                    {selectedAppointment.user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedAppointment.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Consultant</p>
                  <p className="text-sm font-medium">{selectedAppointment.consultant?.user.name || "Unassigned"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={statusColors[selectedAppointment.status] || ""}>{selectedAppointment.status}</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="text-sm font-medium">{new Date(selectedAppointment.date).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{selectedAppointment.duration} minutes</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">{selectedAppointment.type.replace("_", " ")}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}

              {selectedAppointment.status === "SCHEDULED" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "COMPLETED")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="size-4 mr-2" />Mark Complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "CANCELLED")}
                    className="text-destructive hover:text-destructive"
                  >
                    <XCircle className="size-4 mr-2" />Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
