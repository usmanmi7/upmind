"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { toast } from "sonner"

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

const notifications = [
  { id: 1, type: "MESSAGE", title: "New message from Dr. Sarah Chen", message: "Let's discuss your market validation results next session.", time: "2 min ago", isRead: false },
  { id: 2, type: "APPOINTMENT", title: "Appointment reminder", message: "You have a consultation with Dr. Sarah Chen tomorrow at 2:00 PM.", time: "1 hour ago", isRead: false },
  { id: 3, type: "RESOURCE", title: "New resource available", message: "AI-Powered Growth Hacking Playbook has been added to the library.", time: "3 hours ago", isRead: false },
  { id: 4, type: "PAYMENT", title: "Payment confirmed", message: "Your Growth Pro subscription payment of $49.00 was processed successfully.", time: "Yesterday", isRead: true },
  { id: 5, type: "APPOINTMENT", title: "Appointment completed", message: "Your consultation with Marcus Johnson has been marked as completed.", time: "2 days ago", isRead: true },
  { id: 6, type: "SYSTEM", title: "Security alert", message: "New login detected from Chrome on macOS in San Francisco, CA.", time: "3 days ago", isRead: true },
  { id: 7, type: "RESOURCE", title: "Resource bookmarked", message: "You saved 'Pitch Deck Template That Raised $5M' to your library.", time: "4 days ago", isRead: true },
  { id: 8, type: "SYSTEM", title: "System update", message: "New features have been added to the roadmap builder. Check it out!", time: "5 days ago", isRead: true },
]

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = React.useState("All")
  const [items, setItems] = React.useState(notifications)

  const filtered = items.filter((n) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Messages") return n.type === "MESSAGE"
    if (activeFilter === "Appointments") return n.type === "APPOINTMENT"
    if (activeFilter === "Payments") return n.type === "PAYMENT"
    if (activeFilter === "System") return n.type === "SYSTEM" || n.type === "RESOURCE"
    return true
  })

  const markAsRead = (id: number) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n))
  }

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success("All notifications marked as read")
  }

  const deleteNotification = (id: number) => {
    setItems((prev) => prev.filter((n) => n.id !== id))
    toast.success("Notification deleted")
  }

  const unreadCount = items.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">{unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "You're all caught up!"}</p>
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
          return (
            <Card
              key={notif.id}
              className={`border-0 shadow-md shadow-black/5 dark:shadow-black/20 transition-smooth ${
                !notif.isRead ? "bg-[#E8F5E9]/50 dark:bg-[#2D4A2D]/10" : ""
              }`}
            >
              <CardContent className="p-4">
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
                    <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.isRead && (
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => markAsRead(notif.id)}>
                        <Check className="size-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(notif.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
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
