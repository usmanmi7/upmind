"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  HelpCircle,
  Phone,
  Briefcase,
} from "lucide-react"
import * as React from "react"

export default function PublicNavbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
              <span className="text-[#1A2E1A] font-bold text-base">U</span>
            </div>
            <span className="text-xl font-bold font-heading">Upmind</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-smooth px-3 py-2 rounded-md hover:bg-muted/50">
              Home
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-smooth px-3 py-2 rounded-md hover:bg-muted/50">
              About
            </Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-smooth px-3 py-2 rounded-md hover:bg-muted/50">
              Services
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-smooth px-3 py-2 rounded-md hover:bg-muted/50">
              Pricing
            </Link>
            <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-smooth px-3 py-2 rounded-md hover:bg-muted/50">
              Resources
            </Link>
            <Link href="/success-stories" className="text-sm text-muted-foreground hover:text-foreground transition-smooth px-3 py-2 rounded-md hover:bg-muted/50">
              Success Stories
            </Link>

            {/* More Dropdown */}
            <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-smooth px-3 py-2 rounded-md hover:bg-muted/50">
                  More
                  <ChevronDown className={`size-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="cursor-pointer">
                    <HelpCircle className="size-4 mr-2" />
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="cursor-pointer">
                    <Phone className="size-4 mr-2" />
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/careers" className="cursor-pointer">
                    <Briefcase className="size-4 mr-2" />
                    Careers
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <Button
                asChild
                className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] hover:from-[#6BE000] hover:to-[#1A2E1A] text-white"
              >
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] hover:from-[#6BE000] hover:to-[#1A2E1A] text-white"
                >
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t mt-2 pt-4 space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/services", label: "Services" },
              { href: "/pricing", label: "Pricing" },
              { href: "/resources", label: "Resources" },
              { href: "/success-stories", label: "Success Stories" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
              { href: "/careers", label: "Careers" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-md hover:bg-muted/50 transition-smooth"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3">
              {session ? (
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] hover:from-[#6BE000] hover:to-[#1A2E1A] text-white"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] hover:from-[#6BE000] hover:to-[#1A2E1A] text-white"
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
