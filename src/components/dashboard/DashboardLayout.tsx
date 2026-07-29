"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Rocket,
  BookOpen,
  Calendar,
  MessageSquare,
  Map,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  ChevronLeft,
  Sparkles,
  UsersRound,
  Shield,
  Crown,
  ArrowLeft,
  Home,
  Lightbulb,
} from "lucide-react"

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
  userOnly?: boolean
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Startup",
    href: "/dashboard/startup",
    icon: Rocket,
    userOnly: true,
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
    icon: BookOpen,
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
    userOnly: true,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: UsersRound,
  },
  {
    title: "Roadmap",
    href: "/dashboard/roadmap",
    icon: Map,
    userOnly: true,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Innovation Engine",
    href: "/dashboard/innovation-engine",
    icon: Lightbulb,
  },
  {
    title: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: Sparkles,
  },
  {
    title: "Subscription",
    href: "/dashboard/subscription",
    icon: CreditCard,
    userOnly: true,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Admin Panel",
    href: "/admin",
    icon: Shield,
    adminOnly: true,
  },
]

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"

  const filteredItems = sidebarItems.filter((item) => {
    if (item.userOnly && isAdmin) return false
    if (item.adminOnly && !isAdmin) return false
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border hover:bg-sidebar-accent/30 transition-colors">
        <Image
          src="/images/logo.png"
          alt="Enginest logo"
          width={220}
          height={44}
          priority
          className="h-11 w-auto shrink-0"
        />
        {isAdmin && !collapsed && (
          <span className="text-[10px] font-medium bg-[#3B82F6]/20 text-[#3B82F6] px-1.5 py-0.5 rounded ml-auto">
            ADMIN
          </span>
        )}
      </Link>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4 sidebar-scroll">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  item.adminOnly && "border border-[#3B82F6]/30 hover:bg-[#3B82F6]/10"
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive ? "text-sidebar-primary" : "",
                    item.adminOnly && "text-[#3B82F6]"
                  )}
                />
                {!collapsed && <span>{item.title}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Back to Home Link */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      )}
      {collapsed && (
        <div className="px-3 pb-3">
          <Link
            href="/"
            className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            title="Back to Home"
          >
            <Home className="size-4" />
          </Link>
        </div>
      )}

      {/* Upgrade Card - Only for FREE_USER (non-admin, non-paid) */}
      {!collapsed && !isAdmin && session?.user?.role === "FREE_USER" && (
        <div className="px-3 pb-4">
          <div className="rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#1E3A8A]/20 border border-sidebar-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-4 text-sidebar-primary" />
              <span className="text-sm font-medium text-sidebar-foreground">
                Upgrade to Pro
              </span>
            </div>
            <p className="text-xs text-sidebar-foreground/60 mb-3">
              Unlock premium resources and priority consulting
            </p>
            <Button
              size="sm"
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] text-xs"
              asChild
            >
              <Link href="/dashboard/subscription">Upgrade Now</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Pro Member Card - For paid users */}
      {!collapsed && !isAdmin && session?.user?.role === "PAID_USER" && (
        <div className="px-3 pb-4">
          <div className="rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#1E3A8A]/10 border border-[#3B82F6]/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="size-4 text-[#3B82F6]" />
              <span className="text-sm font-medium text-sidebar-foreground">
                Pro Member
              </span>
            </div>
            <p className="text-xs text-sidebar-foreground/60 mb-3">
              You have access to all premium features
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-[#3B82F6]/30 text-[#0F1B3D] hover:bg-[#3B82F6]/10 text-xs"
              asChild
            >
              <Link href="/dashboard/subscription">Manage Plan</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Admin Badge Card - Only for admins */}
      {!collapsed && isAdmin && (
        <div className="px-3 pb-4">
          <div className="rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#1E3A8A]/10 border border-[#3B82F6]/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-4 text-[#3B82F6]" />
              <span className="text-sm font-medium text-sidebar-foreground">
                Admin Access
              </span>
            </div>
            <p className="text-xs text-sidebar-foreground/60 mb-3">
              Full platform management & analytics
            </p>
            <Button
              size="sm"
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] text-xs"
              asChild
            >
              <Link href="/admin">Open Admin Panel</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"
  const [unreadCount, setUnreadCount] = React.useState(0)

  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications")
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.unreadCount || 0)
        }
      } catch {
        // silent fail
      }
    }
    fetchUnreadCount()
    // Poll every 30 seconds for updated unread count
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="size-5" />
          </Button>

          {/* Home Button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="size-4" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 w-64">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Admin badge in topbar */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-1.5 text-[#3B82F6] border-[#3B82F6]/30 hover:bg-[#3B82F6]/10"
              >
                <Shield className="size-3.5" />
                Admin
              </Button>
            </Link>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/dashboard/notifications">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3B82F6]" />
              )}
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2"
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {session?.user?.name || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email || ""}
                  </p>
                  {isAdmin && (
                    <span className="text-[10px] font-medium bg-[#3B82F6]/20 text-[#3B82F6] px-1.5 py-0.5 rounded w-fit">
                      ADMIN
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Home className="size-4 mr-2" />
                  Back to Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="size-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {isAdmin ? (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <Shield className="size-4 mr-2" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/subscription" className="cursor-pointer">
                    <CreditCard className="size-4 mr-2" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="size-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          sidebarCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft
              className={cn(
                "size-4 transition-transform",
                sidebarCollapsed && "rotate-180"
              )}
            />
            {!sidebarCollapsed && <span className="text-xs ml-1">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
