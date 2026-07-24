"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="size-8 text-red-500" />
        </div>
        <h2 className="text-xl font-heading font-bold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]"
          >
            <RefreshCw className="size-4 mr-2" /> Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
