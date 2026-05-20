"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Star,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Edit,
  UserCog,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Consultant {
  id: string
  userId: string
  specialties: string | null
  bio: string | null
  rating: number
  availability: string | null
  isActive: boolean
  user: { id: string; name: string; email: string; image: string | null; country: string | null }
  _count: { appointments: number }
  upcomingAppointments: number
  completedAppointments: number
}

interface FreeUser {
  id: string
  name: string
  email: string
  role: string
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function AdminConsultantsPage() {
  const { toast } = useToast()
  const [consultants, setConsultants] = React.useState<Consultant[]>([])
  const [loading, setLoading] = React.useState(true)
  const [addOpen, setAddOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [selectedConsultant, setSelectedConsultant] = React.useState<Consultant | null>(null)
  const [freeUsers, setFreeUsers] = React.useState<FreeUser[]>([])
  const [addForm, setAddForm] = React.useState({ userId: "", specialties: "", bio: "", availability: "" })
  const [editForm, setEditForm] = React.useState({ specialties: "", bio: "", availability: "", isActive: true })

  const fetchConsultants = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/consultants")
      if (res.ok) {
        const json = await res.json()
        setConsultants(json.consultants)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchConsultants() }, [fetchConsultants])

  const fetchFreeUsers = async () => {
    try {
      const res = await fetch("/api/admin/users?limit=50&role=FREE_USER")
      if (res.ok) {
        const json = await res.json()
        setFreeUsers(json.users.map((u: FreeUser) => ({ id: u.id, name: u.name, email: u.email, role: u.role })))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddConsultant = async () => {
    if (!addForm.userId) {
      toast({ title: "Please select a user", variant: "destructive" })
      return
    }
    try {
      const res = await fetch("/api/admin/consultants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      })
      if (res.ok) {
        toast({ title: "Consultant added successfully" })
        setAddOpen(false)
        setAddForm({ userId: "", specialties: "", bio: "", availability: "" })
        fetchConsultants()
      }
    } catch {
      toast({ title: "Failed to add consultant", variant: "destructive" })
    }
  }

  const handleEditConsultant = async () => {
    if (!selectedConsultant) return
    try {
      const res = await fetch("/api/admin/consultants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultantId: selectedConsultant.id, ...editForm }),
      })
      if (res.ok) {
        toast({ title: "Consultant updated successfully" })
        setEditOpen(false)
        fetchConsultants()
      }
    } catch {
      toast({ title: "Failed to update consultant", variant: "destructive" })
    }
  }

  const openEditDialog = (consultant: Consultant) => {
    setSelectedConsultant(consultant)
    setEditForm({
      specialties: consultant.specialties || "",
      bio: consultant.bio || "",
      availability: consultant.availability || "",
      isActive: consultant.isActive,
    })
    setEditOpen(true)
  }

  const totalAppointments = consultants.reduce((sum, c) => sum + c._count.appointments, 0)
  const avgRating = consultants.length > 0 ? (consultants.reduce((sum, c) => sum + c.rating, 0) / consultants.length).toFixed(1) : "0"
  const activeConsultants = consultants.filter((c) => c.isActive).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Consultant Management</h2>
          <p className="text-sm text-muted-foreground">{consultants.length} consultants</p>
        </div>
        <Button
          onClick={() => { fetchFreeUsers(); setAddOpen(true) }}
          className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
        >
          <Plus className="size-4 mr-2" />
          Add Consultant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { title: "Total Consultants", value: consultants.length, icon: UserCog, color: "from-purple-500 to-violet-500" },
          { title: "Active", value: activeConsultants, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
          { title: "Avg Rating", value: avgRating, icon: Star, color: "from-yellow-500 to-orange-500" },
          { title: "Total Appointments", value: totalAppointments, icon: Calendar, color: "from-blue-500 to-cyan-500" },
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

      {/* Consultant Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-48 bg-muted rounded" /></CardContent></Card>
          ))
        ) : (
          consultants.map((consultant) => (
            <motion.div key={consultant.id} variants={itemAnim}>
              <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage src={consultant.user.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                          {consultant.user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{consultant.user.name}</h3>
                        <p className="text-xs text-muted-foreground">{consultant.user.email}</p>
                      </div>
                    </div>
                    <Badge className={consultant.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                      {consultant.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{consultant.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground ml-1">rating</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(consultant.specialties || "").split(",").map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs bg-purple-500/10 text-purple-400">
                        {s.trim()}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{consultant._count.appointments}</p>
                      <p className="text-[10px] text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{consultant.upcomingAppointments}</p>
                      <p className="text-[10px] text-muted-foreground">Upcoming</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{consultant.completedAppointments}</p>
                      <p className="text-[10px] text-muted-foreground">Completed</p>
                    </div>
                  </div>

                  {/* Availability */}
                  <p className="text-xs text-muted-foreground mb-3">
                    📅 {consultant.availability || "Not set"}
                  </p>

                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openEditDialog(consultant)}
                  >
                    <Edit className="size-4 mr-2" />
                    Edit Consultant
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Add Consultant Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Consultant</DialogTitle>
            <DialogDescription>Promote an existing user to consultant</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select User</Label>
              <Select value={addForm.userId} onValueChange={(v) => setAddForm((prev) => ({ ...prev, userId: v }))}>
                <SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger>
                <SelectContent>
                  {freeUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Specialties (comma-separated)</Label>
              <Input
                value={addForm.specialties}
                onChange={(e) => setAddForm((prev) => ({ ...prev, specialties: e.target.value }))}
                placeholder="e.g., Marketing, Fundraising, Product"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={addForm.bio}
                onChange={(e) => setAddForm((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Consultant bio..."
                rows={3}
              />
            </div>
            <div>
              <Label>Availability</Label>
              <Input
                value={addForm.availability}
                onChange={(e) => setAddForm((prev) => ({ ...prev, availability: e.target.value }))}
                placeholder="e.g., Mon-Fri, 9am-5pm EST"
              />
            </div>
            <Button onClick={handleAddConsultant} className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white">
              Add Consultant
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Consultant Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Consultant</DialogTitle>
            <DialogDescription>Update consultant details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Specialties (comma-separated)</Label>
              <Input
                value={editForm.specialties}
                onChange={(e) => setEditForm((prev) => ({ ...prev, specialties: e.target.value }))}
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label>Availability</Label>
              <Input
                value={editForm.availability}
                onChange={(e) => setEditForm((prev) => ({ ...prev, availability: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Active Status</Label>
                <p className="text-xs text-muted-foreground">Enable or disable this consultant</p>
              </div>
              <Switch
                checked={editForm.isActive}
                onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>
            <Button onClick={handleEditConsultant} className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
