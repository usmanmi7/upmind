"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Globe, Trash2, Users, Search, Loader2, Shield, Crown } from "lucide-react"
import { toast } from "sonner"

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

  const planBadgeColors: Record<string, string> = {
    FREE: "bg-muted text-muted-foreground",
    GROWTH_PRO: "bg-[#C8E6C9] text-[#1A2E1A] dark:bg-[#2D4A2D]/30 dark:text-[#7CFC00]",
    ENTERPRISE: "bg-[#7CFC00]/20 text-[#2D4A2D] dark:bg-[#7CFC00]/10 dark:text-[#7CFC00]",
  }

  return (
    <Card className="border-0 shadow-md shadow-black/5 border-l-4 border-l-[#7CFC00]">
      <CardHeader>
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <Shield className="size-4 text-[#7CFC00]" /> Admin: Manage Users
        </CardTitle>
        <CardDescription>View users and manage their subscription plans</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                        {(user.name || user.email).split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {user.startup && (
                        <p className="text-xs text-muted-foreground/70 truncate">{user.startup.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={planBadgeColors[user.subscription?.plan || "FREE"] || planBadgeColors.FREE}>
                      <Crown className="size-3 mr-1" />
                      {user.subscription?.plan === "GROWTH_PRO" ? "Growth Pro" : user.subscription?.plan === "ENTERPRISE" ? "Enterprise" : "Free"}
                    </Badge>
                    <Select
                      value={user.subscription?.plan || "FREE"}
                      onValueChange={(value) => changePlan(user.id, value)}
                      disabled={changingPlan === user.id}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
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
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
