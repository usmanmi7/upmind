"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, Video, Phone, MapPin, Plus, Loader2, AlertCircle, CheckCircle2, XCircle, Shield } from "lucide-react"
import { toast } from "sonner"

interface Appointment {
  id: string
  date: string
  duration: number
  type: string
  status: string
  notes: string | null
  meetingUrl: string | null
  userId?: string
  user?: { id: string; name: string; email: string; image: string | null }
  consultant: {
    user: {
      name: string
      image: string | null
    }
    specialties: string | null
    rating: number
  } | null
}

interface Consultant {
  id: string
  user: { name: string; image: string | null }
  specialties: string | null
  rating: number
}

const typeIcons: Record<string, React.ElementType> = { VIDEO: Video, PHONE: Phone, IN_PERSON: MapPin }
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SCHEDULED: "bg-[#C8E6C9] text-[#1A2E1A] dark:bg-[#2D4A2D]/30 dark:text-[#7CFC00]",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  RESCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

const timeSlots = [
  { label: "9:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "1:00 PM", value: "13:00" },
  { label: "2:00 PM", value: "14:00" },
  { label: "3:00 PM", value: "15:00" },
  { label: "4:00 PM", value: "16:00" },
]

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [adminAppointments, setAdminAppointments] = React.useState<Appointment[]>([])
  const [consultants, setConsultants] = React.useState<Consultant[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [booking, setBooking] = React.useState(false)
  const [approving, setApproving] = React.useState<string | null>(null)

  // Form state
  const [selectedConsultant, setSelectedConsultant] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState("")
  const [selectedTime, setSelectedTime] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("VIDEO")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [aptRes, consulRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/consultants"),
        ])

        if (aptRes.ok) {
          const data = await aptRes.json()
          setAppointments(data)
        }

        if (consulRes.ok) {
          const data = await consulRes.json()
          setConsultants(data)
        }

        // Admin: fetch all appointments
        if (isAdmin) {
          const adminRes = await fetch("/api/admin/appointments?limit=50")
          if (adminRes.ok) {
            const adminData = await adminRes.json()
            setAdminAppointments(adminData.appointments || [])
          }
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAdmin])

  const handleBook = async () => {
    if (!selectedConsultant || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields")
      return
    }

    setBooking(true)
    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}:00`)

      if (isNaN(dateTime.getTime())) {
        toast.error("Invalid date or time selected")
        setBooking(false)
        return
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultantId: selectedConsultant,
          date: dateTime.toISOString(),
          duration: 60,
          type: selectedType,
          notes,
        }),
      })

      if (res.ok) {
        const newApt = await res.json()
        setAppointments((prev) => [...prev, newApt])
        toast.success("Appointment requested! Waiting for admin approval.")
        setDialogOpen(false)
        setSelectedConsultant("")
        setSelectedDate("")
        setSelectedTime("")
        setSelectedType("VIDEO")
        setNotes("")
      } else {
        const errData = await res.json().catch(() => ({}))
        toast.error(errData.error || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Failed to book appointment:", error)
      toast.error("Failed to book appointment")
    } finally {
      setBooking(false)
    }
  }

  const handleAdminAction = async (appointmentId: string, status: string) => {
    setApproving(appointmentId)
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status }),
      })

      if (res.ok) {
        const action = status === "SCHEDULED" ? "approved" : status === "CANCELLED" ? "rejected" : "updated"
        toast.success(`Appointment ${action}!`)
        // Update local state
        setAdminAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
        )
        // Also update user's appointments if applicable
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
        )
      } else {
        toast.error("Failed to update appointment")
      }
    } catch (error) {
      console.error("Failed to update appointment:", error)
      toast.error("Failed to update appointment")
    } finally {
      setApproving(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  const isUpcoming = (dateStr: string, status: string) => {
    return (status === "SCHEDULED" || status === "PENDING") && new Date(dateStr) > new Date()
  }

  const upcoming = appointments.filter((a) => isUpcoming(a.date, a.status))
  const past = appointments.filter((a) => !isUpcoming(a.date, a.status))
  const pendingAppointments = adminAppointments.filter((a) => a.status === "PENDING")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
          <p className="text-sm text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">{isAdmin ? "Manage all appointment requests" : "Manage your consultations with experts"}</p>
        </div>
        {!isAdmin && consultants.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]">
                <Plus className="size-4 mr-2" /> Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">Book New Appointment</DialogTitle>
                <DialogDescription>Schedule a consultation with one of our experts. Your appointment will need admin approval.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Consultant</label>
                  <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a consultant" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {consultants.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="py-2">
                          <span className="flex flex-col items-start gap-0.5">
                            <span className="font-medium truncate max-w-full">{c.user?.name || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-full">
                              {c.specialties ? `${c.specialties}` : "General Consultant"} · {c.rating.toFixed(1)} ★
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Date</label>
                    <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Time</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Meeting Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIDEO">Video Call</SelectItem>
                      <SelectItem value="PHONE">Phone Call</SelectItem>
                      <SelectItem value="IN_PERSON">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Notes</label>
                  <Textarea placeholder="What would you like to discuss?" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="size-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">Your appointment will be submitted for admin approval. You&apos;ll be notified once it&apos;s approved.</p>
                </div>
                <Button
                  className="w-full bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
                  onClick={handleBook}
                  disabled={booking || !selectedConsultant || !selectedDate || !selectedTime}
                >
                  {booking ? <><Loader2 className="size-4 mr-2 animate-spin" /> Requesting...</> : "Request Appointment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Admin: Pending Appointments */}
      {isAdmin && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="size-5 text-[#7CFC00]" />
            <h2 className="text-lg font-heading font-semibold">Pending Approval</h2>
            {pendingAppointments.length > 0 && (
              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                {pendingAppointments.length} pending
              </Badge>
            )}
          </div>
          {pendingAppointments.length > 0 ? (
            <div className="space-y-3">
              {pendingAppointments.map((apt) => {
                const TypeIcon = typeIcons[apt.type] || Video
                const userName = apt.user?.name || "User"
                const consultantName = apt.consultant?.user?.name || "Consultant"
                return (
                  <Card key={apt.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 border-l-4 border-l-yellow-400">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="size-10">
                              <AvatarImage src={apt.user?.image || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                                {userName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{userName}</p>
                              <p className="text-xs text-muted-foreground">{apt.user?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><CalendarIcon className="size-3" /> {formatDate(apt.date)}</span>
                            <span className="flex items-center gap-1"><Clock className="size-3" /> {formatTime(apt.date)}</span>
                            <span className="flex items-center gap-1"><TypeIcon className="size-3" /> {apt.type}</span>
                            <span>with {consultantName}</span>
                          </div>
                        </div>
                        {apt.notes && (
                          <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">&ldquo;{apt.notes}&rdquo;</p>
                        )}
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                            onClick={() => handleAdminAction(apt.id, "CANCELLED")}
                            disabled={approving === apt.id}
                          >
                            {approving === apt.id ? <Loader2 className="size-3 mr-1 animate-spin" /> : <XCircle className="size-3 mr-1" />}
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
                            onClick={() => handleAdminAction(apt.id, "SCHEDULED")}
                            disabled={approving === apt.id}
                          >
                            {approving === apt.id ? <Loader2 className="size-3 mr-1 animate-spin" /> : <CheckCircle2 className="size-3 mr-1" />}
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="size-10 text-[#7CFC00]/40 mx-auto mb-3" />
                <p className="text-sm font-medium">No pending appointments</p>
                <p className="text-xs text-muted-foreground mt-1">All appointment requests have been reviewed</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Admin: All Appointments */}
      {isAdmin && (
        <div>
          <h2 className="text-lg font-heading font-semibold mb-4">All Appointments</h2>
          {adminAppointments.length > 0 ? (
            <div className="space-y-3">
              {adminAppointments
                .filter((a) => a.status !== "PENDING")
                .slice(0, 20)
                .map((apt) => {
                  const TypeIcon = typeIcons[apt.type] || Video
                  const userName = apt.user?.name || "User"
                  const consultantName = apt.consultant?.user?.name || "Consultant"
                  return (
                    <Card key={apt.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="size-9">
                              <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                                {userName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{userName} → {consultantName}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="size-3" /> {formatDate(apt.date)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="size-3" /> {formatTime(apt.date)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><TypeIcon className="size-3" /> {apt.duration} min</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={statusColors[apt.status] || ""}>{apt.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          ) : (
            <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
              <CardContent className="p-8 text-center">
                <CalendarIcon className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No appointments yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Regular user: Upcoming and Past */}
      {!isAdmin && (
        <>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
            <AlertCircle className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">Appointments require admin approval. Pending appointments will show a yellow badge until approved.</p>
          </div>

          <div>
            <h2 className="text-lg font-heading font-semibold mb-4">Upcoming Appointments</h2>
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((apt) => {
                  const TypeIcon = typeIcons[apt.type] || Video
                  const consultantName = apt.consultant?.user?.name || "Consultant"
                  return (
                    <Card key={apt.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="size-10">
                              <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                                {consultantName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{consultantName}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="size-3" /> {formatDate(apt.date)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="size-3" /> {formatTime(apt.date)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><TypeIcon className="size-3" /> {apt.duration} min</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={statusColors[apt.status] || ""}>{apt.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm font-medium">No upcoming appointments</p>
                  <p className="text-xs text-muted-foreground mt-1">Book a consultation with one of our experts to get started</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-lg font-heading font-semibold mb-4">Past Appointments</h2>
            {past.length > 0 ? (
              <div className="space-y-3">
                {past.map((apt) => {
                  const TypeIcon = typeIcons[apt.type] || Video
                  const consultantName = apt.consultant?.user?.name || "Consultant"
                  return (
                    <Card key={apt.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="size-10">
                              <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                                {consultantName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{consultantName}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{formatDate(apt.date)} at {formatTime(apt.date)}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><TypeIcon className="size-3" /> {apt.duration} min</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={statusColors[apt.status] || ""}>{apt.status}</Badge>
                        </div>
                        {apt.notes && (
                          <div className="mt-3 p-3 rounded-lg bg-muted/30">
                            <p className="text-xs font-medium mb-1">Meeting Notes</p>
                            <p className="text-xs text-muted-foreground">{apt.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No past appointments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}
