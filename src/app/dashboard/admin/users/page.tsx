"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, UserCog, Ban, CheckCircle, Eye, ChevronLeft, ChevronRight, Filter, ShieldAlert, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  country: string | null
  image: string | null
  emailVerified: boolean
  banned: boolean
  bannedReason: string | null
  createdAt: string
  subscription: { plan: string; status: string } | null
  startup: { name: string } | null
  _count: { appointments: number; messagesSent: number }
}

const roleColors: Record<string, string> = {
  FREE_USER: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  PAID_USER: "bg-green-500/20 text-green-400 border-green-500/30",
  CONSULTANT: "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30",
  ADMIN: "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30",
  SUPER_ADMIN: "bg-orange-500/20 text-orange-400 border-orange-500/30",
}

const planColors: Record<string, string> = {
  FREE: "bg-slate-500/20 text-slate-400",
  GROWTH_PRO: "bg-[#3B82F6]/20 text-[#3B82F6]",
  ENTERPRISE: "bg-[#93C5FD]/20 text-[#3B82F6]",
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [banDialogOpen, setBanDialogOpen] = React.useState(false)
  const [banTarget, setBanTarget] = React.useState<User | null>(null)
  const [banReason, setBanReason] = React.useState("")
  const [banning, setBanning] = React.useState(false)

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", page.toString())
      params.set("limit", "10")
      if (search) params.set("search", search)
      if (roleFilter && roleFilter !== "all") params.set("role", roleFilter)

      const res = await fetch(`/api/admin/users?${params}`)
      if (res.ok) {
        const json = await res.json()
        setUsers(json.users)
        setTotalPages(json.totalPages || Math.ceil((json.total || 0) / 10))
        setTotal(json.total || 0)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      })
      if (res.ok) {
        toast({ title: "User role updated successfully" })
        fetchUsers()
      } else {
        const err = await res.json().catch(() => ({}))
        toast({ title: err.error || "Failed to update role", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to update user role", variant: "destructive" })
    }
  }

  const handleBan = async () => {
    if (!banTarget) return
    setBanning(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: banTarget.id,
          banned: !banTarget.banned,
          bannedReason: !banTarget.banned ? banReason : undefined,
        }),
      })
      if (res.ok) {
        toast({
          title: banTarget.banned ? "User unbanned" : "User banned & logged out",
          description: banTarget.banned
            ? "The user can now log in again"
            : "The user has been immediately logged out and cannot log in",
        })
        setBanDialogOpen(false)
        setBanTarget(null)
        setBanReason("")
        fetchUsers()
      } else {
        const err = await res.json().catch(() => ({}))
        toast({ title: err.error || "Failed to update user status", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to update user status", variant: "destructive" })
    } finally {
      setBanning(false)
    }
  }

  const openBanDialog = (user: User) => {
    setBanTarget(user)
    setBanReason("")
    setBanDialogOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground">{total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="FREE_USER">Free User</SelectItem>
                <SelectItem value="PAID_USER">Paid User</SelectItem>
                <SelectItem value="CONSULTANT">Consultant</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/30 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Plan</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6} className="h-16">
                        <div className="animate-pulse bg-muted rounded h-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className={user.banned ? "bg-red-500/5" : "hover:bg-muted/50"}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className={`text-xs ${user.banned ? "bg-red-500/20 text-red-400" : "bg-gradient-to-br from-[#5CBF00] to-[#1E3A8A] text-white"}`}>
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={`text-sm font-medium ${user.banned ? "line-through text-muted-foreground" : ""}`}>{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={roleColors[user.role] || ""}>
                          {user.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className={planColors[user.subscription?.plan || "FREE"] || ""}>
                          {user.subscription?.plan?.replace("_", " ") || "FREE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.banned ? (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            <ShieldAlert className="size-3 mr-1" />
                            Banned
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setDetailOpen(true) }}>
                              <Eye className="size-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && !user.banned && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "PAID_USER")}>
                                  <UserCog className="size-4 mr-2" />
                                  Make Paid User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "CONSULTANT")}>
                                  <UserCog className="size-4 mr-2" />
                                  Make Consultant
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "FREE_USER")}>
                                  <UserCog className="size-4 mr-2" />
                                  Make Free User
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            {user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && (
                              <DropdownMenuItem
                                onClick={() => openBanDialog(user)}
                                className={user.banned ? "text-green-500 focus:text-green-500" : "text-red-500 focus:text-red-500"}
                              >
                                {user.banned ? (
                                  <><CheckCircle className="size-4 mr-2" />Unban User</>
                                ) : (
                                  <><Ban className="size-4 mr-2" />Ban User</>
                                )}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} ({total} users)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information and activity</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={selectedUser.image || undefined} />
                  <AvatarFallback className={`text-xl ${selectedUser.banned ? "bg-red-500/20 text-red-400" : "bg-gradient-to-br from-[#5CBF00] to-[#1E3A8A] text-white"}`}>
                    {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className={roleColors[selectedUser.role] || ""}>
                      {selectedUser.role.replace("_", " ")}
                    </Badge>
                    <Badge variant="secondary" className={planColors[selectedUser.subscription?.plan || "FREE"] || ""}>
                      {selectedUser.subscription?.plan?.replace("_", " ") || "FREE"}
                    </Badge>
                    {selectedUser.banned && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Banned</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="text-sm font-medium">{selectedUser.country || "Not set"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Appointments</p>
                  <p className="text-sm font-medium">{selectedUser._count.appointments}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Messages</p>
                  <p className="text-sm font-medium">{selectedUser._count.messagesSent}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Startup</p>
                  <p className="text-sm font-medium">{selectedUser.startup?.name || "None"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium">{selectedUser.banned ? "Banned" : "Active"}</p>
                </div>
              </div>

              {selectedUser.banned && selectedUser.bannedReason && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400 font-medium">Ban Reason</p>
                  <p className="text-sm text-red-300">{selectedUser.bannedReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ban Confirmation Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {banTarget?.banned ? (
                <><CheckCircle className="size-5 text-green-500" />Unban User</>
              ) : (
                <><ShieldAlert className="size-5 text-red-500" />Ban User</>
              )}
            </DialogTitle>
            <DialogDescription>
              {banTarget?.banned
                ? `Are you sure you want to unban ${banTarget?.name}? They will be able to log in again.`
                : `Are you sure you want to ban ${banTarget?.name}? They will be immediately logged out and cannot log in again.`}
            </DialogDescription>
          </DialogHeader>

          {!banTarget?.banned && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="ban-reason">Reason for ban (optional)</Label>
                <Textarea
                  id="ban-reason"
                  placeholder="e.g., Violation of terms of service, spam activity..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">
                  <strong>Warning:</strong> This user will be immediately logged out from all devices and will not be able to log in until unbanned.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setBanDialogOpen(false)} disabled={banning}>
              Cancel
            </Button>
            <Button
              variant={banTarget?.banned ? "default" : "destructive"}
              onClick={handleBan}
              disabled={banning}
              className={banTarget?.banned ? "bg-green-500 hover:bg-green-600 text-white" : ""}
            >
              {banning ? (
                <><Loader2 className="size-4 mr-2 animate-spin" />Processing...</>
              ) : banTarget?.banned ? (
                <><CheckCircle className="size-4 mr-2" />Unban User</>
              ) : (
                <><Ban className="size-4 mr-2" />Ban User</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
