"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Hammer,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3B82F6]/20 to-[#1E3A8A]/20 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
            <FileText className="size-10 text-white" />
          </div>
          {/* Construction badge */}
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md border-2 border-background">
            <Hammer className="size-5 text-yellow-900" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-bold">Documents, Coming Soon</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            We&apos;re building a powerful document vault for your startup. Upload, organize, and share pitch decks, financials, legal docs, and more, all in one secure place.
          </p>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {[
            { icon: "📁", label: "Smart Folders" },
            { icon: "🔒", label: "Secure Storage" },
            { icon: "📤", label: "Easy Sharing" },
          ].map((feature) => (
            <div key={feature.label} className="p-3 rounded-xl bg-muted/50">
              <span className="text-xl block mb-1">{feature.icon}</span>
              <span className="text-[11px] text-muted-foreground">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Back link */}
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="size-4 mr-1" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
