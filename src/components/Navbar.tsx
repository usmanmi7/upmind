'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ChevronDown, Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'Success Stories', href: '/success-stories' },
];

const moreLinks = [
  { label: 'Careers', href: '/careers' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1A2E1A] shadow-lg'
          : 'bg-[#1A2E1A]/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-3 h-3 rounded-full bg-[#7CFC00] group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold text-xl tracking-tight font-heading">
              Upmind
            </span>
          </Link>

          {/* Desktop Nav Links + CTA - Right Aligned */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white text-base font-medium capitalize transition-colors relative group"
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
                className="text-white/80 hover:text-white text-base font-medium capitalize transition-colors flex items-center gap-1 group"
              >
                More
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
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
                        className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 text-sm capitalize transition-colors"
                        onClick={() => setMoreOpen(false)}
                      >
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
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-2 text-sm font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/20"
                >
                  Dashboard
                </Link>
                {/* User Icon with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                    aria-label="User menu"
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-[#1A2E1A] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white text-sm font-medium truncate">{session.user?.name || 'User'}</p>
                          <p className="text-white/50 text-xs truncate">{session.user?.email}</p>
                        </div>
                        {/* Menu Items */}
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/5 text-sm transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#1A2E1A] border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                ...navLinks,
                ...moreLinks,
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-white/80 hover:text-white text-base font-medium capitalize py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-white/10 mt-2">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-2.5 text-sm font-semibold text-center hover:bg-[#6BE000] transition-all duration-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                        {session.user?.image ? (
                          <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{session.user?.name || 'User'}</p>
                        <p className="text-white/40 text-xs truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm py-2 px-3 rounded-lg hover:bg-white/5 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block text-white border border-white/30 rounded-full px-6 py-2.5 text-sm font-medium text-center hover:bg-white hover:text-[#1A2E1A] transition-all duration-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-2.5 text-sm font-semibold text-center hover:bg-[#6BE000] transition-all duration-300"
                      onClick={() => setMobileOpen(false)}
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
    </motion.nav>
  );
}
