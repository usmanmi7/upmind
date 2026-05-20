'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="w-3 h-3 rounded-full bg-[#7CFC00] group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold text-xl tracking-tight font-heading">
              Upmind
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {['HOME', 'SERVICES', 'ABOUT US'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#7CFC00] transition-all group-hover:w-full" />
              </a>
            ))}
            <button className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors flex items-center gap-1 group">
              MORE
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#"
              className="text-white border border-white/60 rounded-full px-6 py-2 text-sm font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300"
            >
              BUY TEMPLATE
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
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
            className="md:hidden bg-[#1A2E1A] border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {['HOME', 'SERVICES', 'ABOUT US', 'MORE'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  className="block text-white/80 hover:text-white text-sm font-medium tracking-wide py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link}
                </a>
              ))}
              <a
                href="#"
                className="block text-white border border-white/60 rounded-full px-6 py-2 text-sm font-medium text-center hover:bg-white hover:text-[#1A2E1A] transition-all duration-300 mt-4"
              >
                BUY TEMPLATE
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
