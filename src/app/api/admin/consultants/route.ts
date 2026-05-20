import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("isActive")

    const where: Record<string, unknown> = {}
    if (isActive !== null && isActive !== "") {
      where.isActive = isActive === "true"
    }

    const consultants = await db.consultant.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true, country: true } },
        _count: { select: { appointments: true } },
      },
      orderBy: { rating: "desc" },
    })

    // Get appointment stats for each consultant
    const consultantsWithStats = await Promise.all(
      consultants.map(async (c) => {
        const upcomingAppointments = await db.appointment.count({
          where: { consultantId: c.id, status: "SCHEDULED", date: { gte: new Date() } },
        })
        const completedAppointments = await db.appointment.count({
          where: { consultantId: c.id, status: "COMPLETED" },
        })
        return { ...c, upcomingAppointments, completedAppointments }
      })
    )

    return NextResponse.json({ consultants: consultantsWithStats })
  } catch (error) {
    console.error("Admin consultants GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, specialties, bio, availability } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if user exists and update role
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user role to CONSULTANT
    await db.user.update({ where: { id: userId }, data: { role: "CONSULTANT" } })

    const consultant = await db.consultant.create({
      data: { userId, specialties, bio, availability, isActive: true },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    })

    return NextResponse.json({ consultant }, { status: 201 })
  } catch (error) {
    console.error("Admin consultants POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { consultantId, specialties, bio, availability, isActive, rating } = body

    if (!consultantId) {
      return NextResponse.json({ error: "Consultant ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (specialties !== undefined) updateData.specialties = specialties
    if (bio !== undefined) updateData.bio = bio
    if (availability !== undefined) updateData.availability = availability
    if (isActive !== undefined) updateData.isActive = isActive
    if (rating !== undefined) updateData.rating = rating

    const consultant = await db.consultant.update({
      where: { id: consultantId },
      data: updateData,
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    })

    return NextResponse.json({ consultant })
  } catch (error) {
    console.error("Admin consultants PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
