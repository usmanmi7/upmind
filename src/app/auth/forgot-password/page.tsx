"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Something went wrong")
        return
      }

      setIsSubmitted(true)
      toast.success("Reset link sent!")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-[#0A1228] dark:via-[#0F1B3D] dark:to-[#1E3A8A] p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#1E3A8A]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center">
              <span className="font-bold text-lg text-[#0F1B3D]">U</span>
            </div>
            <span className="text-2xl font-bold font-heading text-[#0F1B3D] dark:text-white">
              Upmind
            </span>
          </Link>
        </div>

        <Card className="glass border-0 shadow-xl shadow-black/5 dark:shadow-black/20">
          {isSubmitted ? (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Mail className="size-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-heading">
                  Check your email
                </CardTitle>
                <CardDescription>
                  If an account exists for {email}, we&apos;ve sent you a password reset link.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Didn&apos;t receive the email? Check your spam folder or try again with a different email address.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try again
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-heading">
                  Forgot your password?
                </CardTitle>
                <CardDescription>
                  No worries, we&apos;ll send you a reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      className={error ? "border-destructive" : ""}
                      disabled={isLoading}
                    />
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] shadow-lg shadow-[#3B82F6]/25"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
          <CardFooter className="justify-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ArrowLeft className="size-4" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
