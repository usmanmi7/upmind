"use client"

import Link from "next/link"

export default function PublicFooter() {
  return (
    <footer className="border-t py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-base">U</span>
              </div>
              <span className="text-xl font-bold font-heading">Upmind</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Strategic consulting for startups. Clear insights. Real strategy. Sustainable growth.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-foreground transition-smooth">Services</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-smooth">Pricing</Link></li>
              <li><Link href="/resources" className="hover:text-foreground transition-smooth">Resources</Link></li>
              <li><Link href="/success-stories" className="hover:text-foreground transition-smooth">Success Stories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-smooth">About</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-smooth">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-smooth">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-smooth">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-smooth">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-smooth">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-smooth">Twitter</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">LinkedIn</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">YouTube</a></li>
              <li><a href="#" className="hover:text-foreground transition-smooth">Newsletter</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Upmind. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
