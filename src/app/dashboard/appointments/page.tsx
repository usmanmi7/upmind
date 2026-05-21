"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar as CalendarIcon, Clock, Video, Phone, MapPin, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Appointment {
  id: string
  date: string
  duration: number
  type: string
  status: string
  notes: string | null
  meetingUrl: string | null
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
  SCHEDULED: "bg-[#C8E6C9] text-[#1A2E1A] dark:bg-[#2D4A2D]/30 dark:text-[#7CFC00]",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  RESCHEDULED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [consultants, setConsultants] = React.useState<Consultant[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [booking, setBooking] = React.useState(false)

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
      } catch (error) {
        console.error("Failed to fetch appointments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleBook = async () => {
    if (!selectedConsultant || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields")
      return
    }

    setBooking(true)
    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`)
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
        toast.success("Appointment booked successfully!")
        setDialogOpen(false)
        // Reset form
        setSelectedConsultant("")
        setSelectedDate("")
        setSelectedTime("")
        setSelectedType("VIDEO")
        setNotes("")
      } else {
        toast.error("Failed to book appointment")
      }
    } catch (error) {
      console.error("Failed to book appointment:", error)
      toast.error("Failed to book appointment")
    } finally {
      setBooking(false)
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
    return status === "SCHEDULED" && new Date(dateStr) > new Date()
  }

  const upcoming = appointments.filter((a) => isUpcoming(a.date, a.status))
  const past = appointments.filter((a) => !isUpcoming(a.date, a.status))

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
          <p className="text-muted-foreground mt-1">Manage your consultations with experts</p>
        </div>
        {consultants.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]">
                <Plus className="size-4 mr-2" /> Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-heading">Book New Appointment</DialogTitle>
                <DialogDescription>Schedule a consultation with one of our experts</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Consultant</label>
                  <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
                    <SelectTrigger><SelectValue placeholder="Select a consultant" /></SelectTrigger>
                    <SelectContent>
                      {consultants.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.user?.name || "Unknown"} {c.specialties ? `— ${c.specialties}` : ""} ({c.rating.toFixed(1)} ★)
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
                        {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
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
                <Button
                  className="w-full bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
                  onClick={handleBook}
                  disabled={booking || !selectedConsultant || !selectedDate || !selectedTime}
                >
                  {booking ? <><Loader2 className="size-4 mr-2 animate-spin" /> Booking...</> : "Book Appointment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Upcoming */}
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
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="size-3" /> {formatDate(apt.date)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" /> {formatTime(apt.date)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <TypeIcon className="size-3" /> {apt.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[apt.status] || ""}>{apt.status}</Badge>
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
              <CalendarIcon className="size-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium">No upcoming appointments</p>
              <p className="text-xs text-muted-foreground mt-1">Book a consultation with one of our experts to get started</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past */}
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
    </div>
  )
}
