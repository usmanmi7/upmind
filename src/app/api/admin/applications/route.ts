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

    const userRole = (session.user as { role: string }).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status && status !== "ALL") {
      where.status = status
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { jobTitle: { contains: search, mode: "insensitive" } },
      ]
    }

    const [applications, total] = await Promise.all([
      db.jobApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.jobApplication.count({ where }),
    ])

    return NextResponse.json({
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Admin applications GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as { role: string }).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const application = await db.jobApplication.update({
      where: { id },
      data: updateData,
    })

    // Create notification for the applicant when status changes
    if (status && status !== "PENDING") {
      const statusMessages: Record<string, string> = {
        REVIEWING: "Your application is being reviewed",
        SHORTLISTED: "You've been shortlisted!",
        INTERVIEWED: "You've been selected for an interview",
        OFFERED: "Congratulations! You've received an offer",
        REJECTED: "Your application was not selected this time",
        WITHDRAWN: "Your application has been withdrawn",
      }

      await db.notification.create({
        data: {
          userId: application.userId,
          title: `Application Update: ${application.jobTitle}`,
          message: statusMessages[status] || `Your application status has been updated to ${status}`,
          type: "SYSTEM",
          link: "/dashboard",
        },
      })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Admin applications PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
