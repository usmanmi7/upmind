"use client"

import Link from "next/link"
import Image from "next/image"

export default function PublicFooter() {
  return (
    <footer className="bg-[#0F1B3D] text-white">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Enginest logo"
                width={200}
                height={80}
                priority
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-white/60">
              An engineering innovation platform. Find problems worth solving, match your skills with AI, and build things that matter.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/services" className="hover:text-[#3B82F6] transition-smooth">Services</Link></li>
              <li><Link href="/resources" className="hover:text-[#3B82F6] transition-smooth">Resources</Link></li>
              <li><Link href="/success-stories" className="hover:text-[#3B82F6] transition-smooth">Success Stories</Link></li>
              <li><Link href="/solve-them" className="hover:text-[#3B82F6] transition-smooth">Solve Them</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-[#3B82F6] transition-smooth">About</Link></li>
              <li><Link href="/careers" className="hover:text-[#3B82F6] transition-smooth">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-[#3B82F6] transition-smooth">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-[#3B82F6] transition-smooth">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/privacy" className="hover:text-[#3B82F6] transition-smooth">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-[#3B82F6] transition-smooth">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Connect</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-[#3B82F6] transition-smooth">Twitter</a></li>
              <li><a href="#" className="hover:text-[#3B82F6] transition-smooth">LinkedIn</a></li>
              <li><a href="#" className="hover:text-[#3B82F6] transition-smooth">YouTube</a></li>
              <li><a href="#" className="hover:text-[#3B82F6] transition-smooth">Newsletter</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Enginest. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
