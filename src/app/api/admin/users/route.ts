import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin or consultant
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "CONSULTANT")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: Record<string, unknown> = {
      id: { not: session.user.id }, // Exclude the current user
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          banned: true,
          bannedReason: true,
          country: true,
          createdAt: true,
          startup: {
            select: { name: true, industry: true, progress: true },
          },
          subscription: {
            select: { id: true, plan: true, status: true },
          },
          _count: {
            select: { appointments: true, messagesSent: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error("Admin Users GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can change plans
    const adminUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!adminUser || (adminUser.role !== "ADMIN" && adminUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { userId, plan, banned, bannedReason, role } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Check if user exists
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent banning admins
    if ((targetUser.role === "ADMIN" || targetUser.role === "SUPER_ADMIN") && banned) {
      return NextResponse.json({ error: "Cannot ban admin users" }, { status: 400 })
    }

    // Handle ban/unban
    if (banned !== undefined) {
      await db.user.update({
        where: { id: userId },
        data: {
          banned,
          bannedReason: banned ? (bannedReason || "Account suspended by administrator") : null,
        },
      })

      // If banning, delete all active sessions to force logout
      if (banned) {
        await db.session.deleteMany({
          where: { userId },
        })
      }

      // Notify the user about ban/unban
      await db.notification.create({
        data: {
          userId,
          title: banned ? "Account Suspended" : "Account Reactivated",
          message: banned
            ? `Your account has been suspended. Reason: ${bannedReason || "Violation of terms of service"}. Please contact support for assistance.`
            : "Your account has been reactivated. You can now log in again.",
          type: "SYSTEM",
          link: "/contact",
        },
      })

      return NextResponse.json({
        success: true,
        message: banned ? "User has been banned and logged out" : "User has been unbanned",
      })
    }

    // Handle role change
    if (role) {
      const validRoles = ["FREE_USER", "PAID_USER", "CONSULTANT"]
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role. Must be FREE_USER, PAID_USER, or CONSULTANT" }, { status: 400 })
      }

      await db.user.update({
        where: { id: userId },
        data: { role },
      })

      // If promoting to CONSULTANT, create a Consultant record if one doesn't exist
      if (role === "CONSULTANT") {
        const existingConsultant = await db.consultant.findUnique({
          where: { userId },
        })
        if (!existingConsultant) {
          await db.consultant.create({
            data: {
              userId,
              specialties: "General Consulting",
              bio: null,
              availability: "Mon-Fri, 9am-5pm",
              isActive: true,
            },
          })
        }
      }

      // If demoting from CONSULTANT, deactivate their Consultant record
      if (role !== "CONSULTANT" && targetUser.role === "CONSULTANT") {
        const existingConsultant = await db.consultant.findUnique({
          where: { userId },
        })
        if (existingConsultant) {
          await db.consultant.update({
            where: { userId },
            data: { isActive: false },
          })
        }
      }

      await db.notification.create({
        data: {
          userId,
          title: "Role Updated",
          message: `Your account role has been updated to ${role.replace("_", " ")}`,
          type: "SYSTEM",
        },
      })

      return NextResponse.json({ success: true, message: `Role updated to ${role.replace("_", " ")}` })
    }

    // Handle plan change
    if (plan) {
      const validPlans = ["FREE", "GROWTH_PRO", "ENTERPRISE"]
      if (!validPlans.includes(plan)) {
        return NextResponse.json({ error: "Invalid plan. Must be FREE, GROWTH_PRO, or ENTERPRISE" }, { status: 400 })
      }

      // Update or create subscription
      if (targetUser.subscription) {
        await db.subscription.update({
          where: { userId },
          data: {
            plan,
            status: "ACTIVE",
            startDate: new Date(),
          },
        })
      } else {
        await db.subscription.create({
          data: {
            userId,
            plan,
            status: "ACTIVE",
            startDate: new Date(),
          },
        })
      }

      // Update user role based on plan
      const userRole = plan === "FREE" ? "FREE_USER" : "PAID_USER"
      await db.user.update({
        where: { id: userId },
        data: { role: userRole },
      })

      // Notify the user about plan change
      const planName = plan === "GROWTH_PRO" ? "Growth Pro" : plan === "ENTERPRISE" ? "Enterprise" : "Free"
      await db.notification.create({
        data: {
          userId,
          title: "Subscription Updated",
          message: `Your plan has been updated to ${planName}`,
          type: "PAYMENT",
          link: "/dashboard/subscription",
        },
      })

      return NextResponse.json({ success: true, message: `Plan updated to ${planName}` })
    }

    return NextResponse.json({ error: "No valid action specified. Provide plan, banned, or role." }, { status: 400 })
  } catch (error) {
    console.error("Admin Users PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
