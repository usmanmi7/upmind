import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <h1 className="text-[120px] sm:text-[180px] font-heading font-bold text-muted-foreground/10 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center shadow-lg shadow-[#7CFC00]/25">
              <Search className="size-10 text-white" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button
            asChild
            className="bg-[#7CFC00] hover:bg-[#6BE000] text-[#1A2E1A]"
          >
            <Link href="/">
              <Home className="size-4 mr-2" /> Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
