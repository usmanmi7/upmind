'use client';

import Link from 'next/link';
import { Linkedin, Twitter, Instagram, ArrowRight } from 'lucide-react';

const productLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Resources', href: '/resources' },
  { label: 'Solve Them', href: '/solve-them' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1228] pt-12 sm:pt-16 pb-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
              <span className="text-[#3B82F6] font-bold text-xl tracking-tight font-heading">
                Enginest
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              An engineering innovation platform. We help engineers find
              problems worth solving, curated, AI-matched, and ready to build.
            </p>
            {/* Newsletter CTA */}
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#3B82F6]/40 w-full max-w-[220px]"
              />
              <button className="bg-[#3B82F6] text-white rounded-full p-2.5 hover:bg-[#2563EB] transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              PRODUCT
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-[#3B82F6] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-[#3B82F6] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              CONNECT
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:hello@enginest.io"
                  className="text-white/50 hover:text-[#3B82F6] text-sm transition-colors duration-200"
                >
                  hello@enginest.io
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="text-white/50 hover:text-[#3B82F6] text-sm transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#3B82F6] hover:border-[#3B82F6]/40 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#3B82F6] hover:border-[#3B82F6]/40 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#3B82F6] hover:border-[#3B82F6]/40 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Enginest. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/30 hover:text-white/50 text-xs sm:text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
