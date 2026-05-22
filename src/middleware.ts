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

      // No token = not authenticated
      if (!token) return false

      // Banned users are blocked from all protected routes
      // They can only access public pages and the login page
      if (token.banned) {
        // Allow access to auth pages so they can see login page
        if (pathname.startsWith("/auth/")) return true
        // Redirect banned users to login with error
        const url = req.nextUrl.clone()
        url.pathname = "/auth/login"
        url.searchParams.set("error", "banned")
        return NextResponse.redirect(url) as unknown as boolean
      }

      // Redirect admins from /dashboard to /admin
      const isAdmin = token.role === "ADMIN" || token.role === "SUPER_ADMIN"
      if (pathname.startsWith("/dashboard") && isAdmin) {
        // Allow admin to access /dashboard/settings (for account settings)
        // but redirect everything else to /admin
        const adminAllowedPaths = ["/dashboard/settings", "/dashboard/notifications"]
        if (!adminAllowedPaths.some((p) => pathname === p)) {
          const url = req.nextUrl.clone()
          url.pathname = "/admin"
          return NextResponse.redirect(url) as unknown as boolean
        }
      }

      // Protected routes require authentication
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth/onboarding")) {
        return true
      }

      // Admin routes require ADMIN or SUPER_ADMIN role
      if (pathname.startsWith("/admin")) {
        return isAdmin
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
