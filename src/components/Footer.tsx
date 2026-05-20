'use client';

import { Linkedin, Twitter, Instagram } from 'lucide-react';

const pageLinks1 = ['Home', 'Services', 'About Us', 'Contact'];
const pageLinks2 = ['Blog', 'Case Studies', 'Careers', 'FAQ'];
const pageLinks3 = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

export default function Footer() {
  return (
    <footer className="bg-[#0F1F0F] pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <a href="#" className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#7CFC00]" />
              <span className="text-[#7CFC00] font-bold text-xl tracking-tight">
                Upmind
              </span>
            </a>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Strategic consulting for startups and growing teams. Build smarter,
              scale faster.
            </p>
          </div>

          {/* Pages Column 1 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              PAGES
            </h4>
            <ul className="space-y-2.5">
              {pageLinks1.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/50 hover:text-[#7CFC00] text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages Column 2 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              PAGES
            </h4>
            <ul className="space-y-2.5">
              {pageLinks2.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/50 hover:text-[#7CFC00] text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages Column 3 */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              PAGES
            </h4>
            <ul className="space-y-2.5">
              {pageLinks3.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/50 hover:text-[#7CFC00] text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
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
              <li>
                <a
                  href="mailto:hello@upmind.io"
                  className="text-white/50 hover:text-[#7CFC00] text-sm transition-colors duration-200"
                >
                  hello@upmind.io
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="text-white/50 hover:text-[#7CFC00] text-sm transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#7CFC00] hover:border-[#7CFC00]/40 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#7CFC00] hover:border-[#7CFC00]/40 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#7CFC00] hover:border-[#7CFC00]/40 transition-colors duration-200"
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
            &copy; {new Date().getFullYear()} Upmind. All rights reserved.
          </p>
          <p className="text-white/30 text-xs sm:text-sm">
            Designed with strategy in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
