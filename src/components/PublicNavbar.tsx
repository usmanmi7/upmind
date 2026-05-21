"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { ChevronDown, Menu, X, HelpCircle, Phone, Briefcase } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/success-stories" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Success Stories", href: "/success-stories" },
]

const moreLinks = [
  { label: "Careers", href: "/careers", icon: Briefcase },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Contact", href: "/contact", icon: Phone },
]

export default function PublicNavbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#1A2E1A]/95 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-3 h-3 rounded-full bg-[#7CFC00] group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold text-xl tracking-tight font-heading">
              Upmind
            </span>
          </Link>

          {/* Desktop Nav + CTA - Right Aligned */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium capitalize transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7CFC00] transition-all group-hover:w-full" />
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
                className="text-white/80 hover:text-white text-sm font-medium capitalize transition-colors flex items-center gap-1 group"
              >
                More
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#1A2E1A] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                  >
                    {moreLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-2 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 text-sm capitalize transition-colors"
                        onClick={() => setMoreOpen(false)}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/15" />

            {/* CTA Buttons */}
            {session ? (
              <Link
                href="/dashboard"
                className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-2 text-sm font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/20 flex items-center gap-2"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-white border border-white/30 rounded-full px-5 py-2 text-sm font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-2 text-sm font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
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
              className="lg:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-1">
                {[...navLinks, ...moreLinks].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-white/80 hover:text-white text-sm font-medium capitalize py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-3 border-t border-white/10 mt-2">
                  {session ? (
                    <Link
                      href="/dashboard"
                      className="block bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-2.5 text-sm font-semibold text-center hover:bg-[#6BE000] transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block text-white border border-white/30 rounded-full px-6 py-2.5 text-sm font-medium text-center hover:bg-white hover:text-[#1A2E1A] transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-2.5 text-sm font-semibold text-center hover:bg-[#6BE000] transition-all duration-300"
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
