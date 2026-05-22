"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Globe,
  Trash2,
  Search,
  Loader2,
  Shield,
  Crown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

const USERS_PER_PAGE = 20

interface ManageUser {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  createdAt: string
  startup: { name: string; industry: string | null; progress: number } | null
  subscription: { id?: string; plan: string; status: string } | null
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Admin: Manage Users */}
      {isAdmin && <AdminUserManager />}

      {/* General Settings */}
      <Card className="border-0 shadow-md shadow-black/5">
        <CardHeader>
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Settings className="size-4" /> General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="text-sm font-medium">Compact sidebar</p>
              <p className="text-xs text-muted-foreground">Collapse the sidebar by default</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="text-sm font-medium">Show quick actions</p>
              <p className="text-xs text-muted-foreground">Display quick action buttons on the dashboard</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="text-sm font-medium">Email notifications</p>
              <p className="text-xs text-muted-foreground">Receive email updates about your account</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="border-0 shadow-md shadow-black/5">
        <CardHeader>
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Globe className="size-4" /> Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Language</label>
            <Select defaultValue="en">
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Time Zone</label>
            <Select defaultValue="pst">
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                <SelectItem value="cst">Central Time (CT)</SelectItem>
                <SelectItem value="est">Eastern Time (ET)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="gmt">GMT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-md shadow-black/5 border-t-4 border-t-red-500">
        <CardHeader>
          <CardTitle className="text-base font-heading text-destructive flex items-center gap-2">
            <Trash2 className="size-4" /> Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800">
            <div>
              <p className="text-sm font-medium text-destructive">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => toast.error("Account deletion is disabled in demo mode")}
                  >
                    Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminUserManager() {
  const [users, setUsers] = React.useState<ManageUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [changingPlan, setChangingPlan] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
        setTotalUsers((data.users || []).length)
      }
    } catch (err) {
      console.error("Failed to fetch users:", err)
    } finally {
      setLoading(false)
    }
  }

  const changePlan = async (userId: string, plan: string) => {
    setChangingPlan(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan }),
      })

      if (res.ok) {
        const planName = plan === "GROWTH_PRO" ? "Growth Pro" : plan === "ENTERPRISE" ? "Enterprise" : "Free"
        toast.success(`Plan updated to ${planName}`)
        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  subscription: { ...(u.subscription || { status: "ACTIVE" }), plan },
                  role: plan === "FREE" ? "FREE_USER" : "PAID_USER",
                }
              : u
          )
        )
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "Failed to update plan")
      }
    } catch (err) {
      console.error("Failed to change plan:", err)
      toast.error("Failed to update plan")
    } finally {
      setChangingPlan(null)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const startIndex = (currentPage - 1) * USERS_PER_PAGE
  const endIndex = startIndex + USERS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const planBadgeColors: Record<string, string> = {
    FREE: "bg-muted text-muted-foreground",
    GROWTH_PRO: "bg-[#C8E6C9] text-[#1A2E1A] dark:bg-[#2D4A2D]/30 dark:text-[#7CFC00]",
    ENTERPRISE: "bg-[#7CFC00]/20 text-[#2D4A2D] dark:bg-[#7CFC00]/10 dark:text-[#7CFC00]",
  }

  const displayCount = expanded ? filteredUsers.length : Math.min(5, filteredUsers.length)
  const displayUsers = expanded ? paginatedUsers : filteredUsers.slice(0, 5)

  return (
    <Card className="border-0 shadow-md shadow-black/5 border-l-4 border-l-[#7CFC00]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Shield className="size-4 text-[#7CFC00]" /> Admin: Manage Users
            </CardTitle>
            <CardDescription>
              {totalUsers} total users - View and manage subscription plans
            </CardDescription>
          </div>
          <Link href="/admin/users">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-[#7CFC00] border-[#7CFC00]/30 hover:bg-[#7CFC00]/10"
            >
              <ExternalLink className="size-3.5" />
              Full User Management
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!expanded && filteredUsers.length > 5 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(true)}
              className="gap-1.5"
            >
              <Users className="size-3.5" />
              Show All ({filteredUsers.length})
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-[#7CFC00]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="size-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        ) : (
          <>
            {/* User list */}
            <div className="space-y-2">
              {displayUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                        {(user.name || user.email).split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-11 sm:pl-0">
                    {user.startup && (
                      <span className="text-xs text-muted-foreground/70 truncate max-w-[120px] hidden md:inline">
                        {user.startup.name}
                      </span>
                    )}
                    <Badge className={planBadgeColors[user.subscription?.plan || "FREE"] || planBadgeColors.FREE}>
                      <Crown className="size-3 mr-1" />
                      {user.subscription?.plan === "GROWTH_PRO" ? "Growth Pro" : user.subscription?.plan === "ENTERPRISE" ? "Enterprise" : "Free"}
                    </Badge>
                    <Select
                      value={user.subscription?.plan || "FREE"}
                      onValueChange={(value) => changePlan(user.id, value)}
                      disabled={changingPlan === user.id}
                    >
                      <SelectTrigger className="w-[130px] h-7 text-xs">
                        {changingPlan === user.id ? (
                          <span className="flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Updating...</span>
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREE">Free</SelectItem>
                        <SelectItem value="GROWTH_PRO">Growth Pro</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - only show when expanded */}
            {expanded && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A] w-8 h-8 p-0"
                              : "w-8 h-8 p-0"
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Collapsed view - show count summary */}
            {!expanded && filteredUsers.length > 5 && (
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing 5 of {filteredUsers.length} users
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(true)}
                  className="text-[#7CFC00] hover:text-[#6BE000] gap-1 text-xs"
                >
                  View all users
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
