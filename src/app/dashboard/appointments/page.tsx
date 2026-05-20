"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Calendar as CalendarIcon, Clock, Video, Phone, MapPin, Plus, MoreVertical, X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const consultants = [
  { id: "1", name: "Dr. Sarah Chen", specialty: "Startup Strategy", rating: 4.9 },
  { id: "2", name: "Marcus Johnson", specialty: "Fundraising", rating: 4.8 },
  { id: "3", name: "Priya Sharma", specialty: "Product Development", rating: 5.0 },
]

const upcoming = [
  { id: 1, consultant: "Dr. Sarah Chen", date: "Tomorrow, Mar 15", time: "2:00 PM", duration: "60 min", type: "VIDEO", status: "SCHEDULED" },
  { id: 2, consultant: "Marcus Johnson", date: "Fri, Mar 17", time: "10:00 AM", duration: "45 min", type: "PHONE", status: "SCHEDULED" },
]

const past = [
  { id: 3, consultant: "Dr. Sarah Chen", date: "Mar 10, 2024", time: "2:00 PM", duration: "60 min", type: "VIDEO", status: "COMPLETED", notes: "Discussed market validation strategy and identified 3 key customer segments to target." },
  { id: 4, consultant: "Priya Sharma", date: "Mar 5, 2024", time: "11:00 AM", duration: "45 min", type: "VIDEO", status: "COMPLETED", notes: "Reviewed product roadmap and prioritized features for MVP launch." },
  { id: 5, consultant: "Marcus Johnson", date: "Feb 28, 2024", time: "3:00 PM", duration: "30 min", type: "PHONE", status: "CANCELLED", notes: "" },
]

const typeIcons: Record<string, React.ElementType> = { VIDEO: Video, PHONE: Phone, IN_PERSON: MapPin }
const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  RESCHEDULED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
}

export default function AppointmentsPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage your consultations with experts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
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
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select a consultant" /></SelectTrigger>
                  <SelectContent>
                    {consultants.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {c.specialty} (★ {c.rating})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time</label>
                  <Select>
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
                <Select>
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
                <Textarea placeholder="What would you like to discuss?" rows={3} />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={() => {
                  toast.success("Appointment booked successfully!")
                  setDialogOpen(false)
                }}
              >
                Book Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-3">
          {upcoming.map((apt) => {
            const TypeIcon = typeIcons[apt.type] || Video
            return (
              <Card key={apt.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {apt.consultant.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{apt.consultant}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="size-3" /> {apt.date}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" /> {apt.time}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TypeIcon className="size-3" /> {apt.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[apt.status]}>{apt.status}</Badge>
                      <Button variant="outline" size="sm" className="text-xs">Reschedule</Button>
                      <Button variant="ghost" size="sm" className="text-xs text-destructive">Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Past */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Past Appointments</h2>
        <div className="space-y-3">
          {past.map((apt) => {
            const TypeIcon = typeIcons[apt.type] || Video
            return (
              <Card key={apt.id} className="border-0 shadow-md shadow-black/5 dark:shadow-black/20">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {apt.consultant.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{apt.consultant}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{apt.date} at {apt.time}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><TypeIcon className="size-3" /> {apt.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={statusColors[apt.status]}>{apt.status}</Badge>
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
      </div>
    </div>
  )
}
