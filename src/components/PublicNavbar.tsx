"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { ChevronDown, Menu, X, HelpCircle, Briefcase, Phone, User, LogOut, LayoutDashboard, Settings, Home, CreditCard, Shield, Trophy, Sparkles, type LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import * as React from "react"

interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

const navLinks: NavLink[] = [
  { label: "Enginest AI", href: "/ai-assistant", icon: Sparkles },
  { label: "Resources", href: "/resources" },
  { label: "Solve Them", href: "/solve-them" },
  { label: "About", href: "/about" },
]

const moreLinks: NavLink[] = [
  { label: "Success Stories", href: "/success-stories", icon: Trophy },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Careers", href: "/careers", icon: Briefcase },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
]

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

// `solid` prop is now a no-op kept for backward compatibility — the navbar
// is always solid (white background) since the transparent overlay style was
// only legible on dark hero sections and broke on light-background pages.
export default function PublicNavbar({ solid: _solid }: { solid?: boolean } = {}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const moreHasActive = moreLinks.some((l) => isActive(pathname, l.href))

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo-light.png"
              alt="Enginest logo"
              width={200}
              height={64}
              priority
              className="h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav + CTA - Right Aligned */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href)
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-base font-medium capitalize transition-colors relative group flex items-center gap-1.5 ${
                    active
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            })}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
                className={`text-base font-medium capitalize transition-colors flex items-center gap-1 group relative ${
                  moreHasActive ? "text-blue-600" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                More
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
                <span
                  className={`absolute -bottom-1.5 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    moreHasActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                  >
                    {moreLinks.map((link) => {
                      const Icon = link.icon
                      const active = isActive(pathname, link.href)
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          className={`flex items-center gap-2 px-4 py-3 text-sm capitalize transition-colors ${
                            active
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                          onClick={() => setMoreOpen(false)}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          {link.label}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200" />

            {/* CTA Buttons */}
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/contact"
                  className="bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/20"
                >
                  Contact
                </Link>
                {/* User Icon with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                    className="flex items-center gap-2"
                    aria-label="User menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-all duration-200">
                      {session.user?.image ? (
                        <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-gray-700" />
                      )}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900 text-sm font-medium truncate">{session.user?.name || 'User'}</p>
                            {(session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN") && (
                              <span className="text-[9px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">ADMIN</span>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs truncate">{session.user?.email}</p>
                        </div>
                        {/* Menu Items */}
                        <Link
                          href="/"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Home className="w-4 h-4" />
                          Home
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        {(session.user?.role === "FREE_USER" || session.user?.role === "PAID_USER") && (
                          <Link
                            href="/dashboard/subscription"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-sm transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <CreditCard className="w-4 h-4" />
                            Subscription
                          </Link>
                        )}
                        {(session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN") && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-blue-600 hover:bg-blue-50 text-sm transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-900 bg-white border border-gray-300 rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-900 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="py-4 space-y-1">
                {[...navLinks, ...moreLinks].map((link) => {
                  const Icon = link.icon
                  const active = isActive(pathname, link.href)
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-2 text-base font-medium capitalize py-2.5 px-3 rounded-lg transition-colors ${
                        active
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {link.label}
                    </Link>
                  )
                })}
                <div className="pt-4 space-y-3 border-t border-gray-200 mt-2 px-3 pb-3">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block bg-blue-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold text-center hover:bg-blue-700 transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <div className="flex items-center gap-3 pt-2 pb-1">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          {session.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-gray-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 text-sm font-medium truncate">{session.user?.name || 'User'}</p>
                          <p className="text-gray-500 text-xs truncate">{session.user?.email}</p>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <Link
                          href="/"
                          className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Home className="w-4 h-4" />
                          Home
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        {(session.user?.role === "FREE_USER" || session.user?.role === "PAID_USER") && (
                          <Link
                            href="/dashboard/subscription"
                            className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <CreditCard className="w-4 h-4" />
                            Subscription
                          </Link>
                        )}
                        {(session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN") && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 text-blue-600 text-sm py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                          className="flex items-center gap-2.5 text-red-600 hover:text-red-700 text-sm py-2 px-3 rounded-lg hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block text-gray-900 bg-white border border-gray-300 rounded-full px-6 py-2.5 text-sm font-medium text-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block bg-blue-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold text-center hover:bg-blue-700 transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
