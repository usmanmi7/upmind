import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ token, req }) {
      const { pathname } = req.nextUrl

      // Public routes that don't require authentication
      const publicRoutes = [
        "/",
        "/auth/login",
        "/auth/signup",
        "/auth/forgot-password",
      ]

      // Check if the route is public
      if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/auth"))) {
        return true
      }

      // Protected routes require authentication
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth/onboarding")) {
        return !!token
      }

      // Admin routes require ADMIN or SUPER_ADMIN role
      if (pathname.startsWith("/admin")) {
        return token?.role === "ADMIN" || token?.role === "SUPER_ADMIN"
      }

      return true
    },
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/onboarding/:path*",
  ],
}
