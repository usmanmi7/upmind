"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Calendar,
  CreditCard,
  BookOpen,
  AlertTriangle,
  Bell,
  Check,
  Trash2,
  CheckCheck,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const filterTabs = ["All", "Messages", "Appointments", "Payments", "System"]

const typeIcons: Record<string, React.ElementType> = {
  MESSAGE: MessageSquare,
  APPOINTMENT: Calendar,
  PAYMENT: CreditCard,
  RESOURCE: BookOpen,
  SYSTEM: AlertTriangle,
}

const typeColors: Record<string, string> = {
  MESSAGE: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 text-[#2D4A2D] dark:text-[#7CFC00]",
  APPOINTMENT: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 text-[#1A2E1A] dark:text-[#7CFC00]",
  PAYMENT: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  RESOURCE: "bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 text-[#2D4A2D] dark:text-[#7CFC00]",
  SYSTEM: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  link: string | null
  createdAt: string
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = React.useState("All")
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications")
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Messages") return n.type === "MESSAGE"
    if (activeFilter === "Appointments") return n.type === "APPOINTMENT"
    if (activeFilter === "Payments") return n.type === "PAYMENT"
    if (activeFilter === "System") return n.type === "SYSTEM" || n.type === "RESOURCE"
    return true
  })

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: "DELETE" })
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast.success("Notification deleted")
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#7CFC00]" />
          <p className="text-sm text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">{unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="size-4 mr-2" /> Mark all as read
          </Button>
        )}
      </div>

      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList>
          {filterTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.map((notif) => {
          const Icon = typeIcons[notif.type] || Bell
          const colorClass = typeColors[notif.type] || "bg-muted text-muted-foreground"
          const content = (
            <>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${colorClass} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${!notif.isRead ? "font-semibold" : ""}`}>{notif.title}</p>
                    {!notif.isRead && <div className="w-2 h-2 rounded-full bg-[#7CFC00] shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatTime(notif.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!notif.isRead && (
                    <Button variant="ghost" size="icon" className="size-7" onClick={(e) => { e.stopPropagation(); markAsRead(notif.id) }}>
                      <Check className="size-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id) }}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )

          return (
            <Card
              key={notif.id}
              className={`border-0 shadow-md shadow-black/5 dark:shadow-black/20 transition-all duration-200 ${
                !notif.isRead ? "bg-[#E8F5E9]/50 dark:bg-[#2D4A2D]/10" : ""
              }`}
            >
              <CardContent className="p-4">
                {notif.link ? (
                  <Link href={notif.link} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell className="size-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No notifications to show</p>
        </div>
      )}
    </div>
  )
}
