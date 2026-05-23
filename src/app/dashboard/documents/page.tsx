"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  Hammer,
  Clock,
  ArrowLeft,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  const [notifyEmail, setNotifyEmail] = React.useState("")
  const [notified, setNotified] = React.useState(false)

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    if (notifyEmail.trim()) {
      setNotified(true)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7CFC00]/20 to-[#2D4A2D]/20 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center shadow-lg shadow-[#7CFC00]/20">
            <FileText className="size-10 text-white" />
          </div>
          {/* Construction badge */}
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md border-2 border-background">
            <Hammer className="size-5 text-yellow-900" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-bold">Documents — Coming Soon</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            We&apos;re building a powerful document vault for your startup. Upload, organize, and share pitch decks, financials, legal docs, and more — all in one secure place.
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

        {/* Notify Me */}
        <Card className="border-0 shadow-md shadow-black/5 dark:shadow-black/20 max-w-sm mx-auto">
          <CardContent className="p-5">
            {notified ? (
              <div className="flex items-center gap-2 justify-center text-sm text-[#7CFC00]">
                <Bell className="size-4" />
                <span className="font-medium">You&apos;ll be notified when it&apos;s ready!</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium">Get notified when we launch</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background outline-none focus:ring-2 focus:ring-[#7CFC00]/30 focus:border-[#7CFC00]/50 transition-all"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] hover:opacity-90"
                  >
                    Notify Me
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ETA */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>Expected launch: Q3 2025</span>
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
