"use client"

import Link from "next/link"

export default function PublicFooter() {
  return (
    <footer className="bg-[#1A2E1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                <span className="text-[#1A2E1A] font-bold text-base">U</span>
              </div>
              <span className="text-xl font-bold font-heading">Upmind</span>
            </Link>
            <p className="text-sm text-white/60">
              Strategic consulting for startups. Clear insights. Real strategy. Sustainable growth.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/services" className="hover:text-[#7CFC00] transition-smooth">Services</Link></li>
              <li><Link href="/pricing" className="hover:text-[#7CFC00] transition-smooth">Pricing</Link></li>
              <li><Link href="/resources" className="hover:text-[#7CFC00] transition-smooth">Resources</Link></li>
              <li><Link href="/success-stories" className="hover:text-[#7CFC00] transition-smooth">Success Stories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-[#7CFC00] transition-smooth">About</Link></li>
              <li><Link href="/careers" className="hover:text-[#7CFC00] transition-smooth">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-[#7CFC00] transition-smooth">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-[#7CFC00] transition-smooth">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/privacy" className="hover:text-[#7CFC00] transition-smooth">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-[#7CFC00] transition-smooth">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Connect</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-[#7CFC00] transition-smooth">Twitter</a></li>
              <li><a href="#" className="hover:text-[#7CFC00] transition-smooth">LinkedIn</a></li>
              <li><a href="#" className="hover:text-[#7CFC00] transition-smooth">YouTube</a></li>
              <li><a href="#" className="hover:text-[#7CFC00] transition-smooth">Newsletter</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Upmind. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
