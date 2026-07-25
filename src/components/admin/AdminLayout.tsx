"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Users,
  UserCog,
  BookOpen,
  Calendar,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  Menu,
  LogOut,
  User,
  ChevronLeft,
  ArrowLeft,
  Shield,
  Sparkles,
  Briefcase,
} from "lucide-react"

const adminSidebarItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Consultants", href: "/admin/consultants", icon: UserCog },
  { title: "Resources", href: "/admin/resources", icon: BookOpen },
  { title: "Appointments", href: "/admin/appointments", icon: Calendar },
  { title: "Applications", href: "/admin/applications", icon: Briefcase },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "CMS", href: "/admin/cms", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

function AdminSidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5CBF00] to-[#1E3A8A] flex items-center justify-center shrink-0">
          <Shield className="size-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold font-heading text-sidebar-foreground">
              Enginest
            </span>
            <span className="text-[10px] text-[#3B82F6] font-medium uppercase tracking-wider">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {adminSidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30"
                    : "text-sidebar-foreground/70 hover:bg-[#1E3A8A]/50 hover:text-sidebar-foreground border border-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive ? "text-[#3B82F6]" : ""
                  )}
                />
                {!collapsed && <span>{item.title}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Back to Site */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      )}
    </div>
  )
}

function AdminTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "A"

  const getPageTitle = () => {
    const item = adminSidebarItems.find(
      (item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
    )
    return item?.title || "Dashboard"
  }

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

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            <Badge className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
              <Shield className="size-3 mr-1" />
              {session?.user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </Badge>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="size-8">
                  <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "Admin"} />
                  <AvatarFallback className="bg-gradient-to-br from-[#5CBF00] to-[#1E3A8A] text-[#0F1B3D] text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {session?.user?.name || "Admin"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session?.user?.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email || ""}</p>
                  <Badge className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs w-fit mt-1">
                    {session?.user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">
                  <Settings className="size-4 mr-2" />
                  Admin Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Sparkles className="size-4 mr-2" />
                  View Main Site
                </Link>
              </DropdownMenuItem>
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

export default function AdminLayout({
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
        <AdminSidebarContent collapsed={sidebarCollapsed} />
        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-[#1E3A8A]/50"
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
          <AdminSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
