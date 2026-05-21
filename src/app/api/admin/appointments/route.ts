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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || ""
    const consultantId = searchParams.get("consultantId") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""
    const type = searchParams.get("type") || ""

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (consultantId) where.consultantId = consultantId
    if (type) where.type = type
    if (dateFrom || dateTo) {
      const dateFilter: Record<string, unknown> = {}
      if (dateFrom) dateFilter.gte = new Date(dateFrom)
      if (dateTo) dateFilter.lte = new Date(dateTo)
      where.date = dateFilter
    }

    const [appointments, total] = await Promise.all([
      db.appointment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          consultant: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      db.appointment.count({ where }),
    ])

    return NextResponse.json({
      appointments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Admin appointments GET error:", error)
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
    const { appointmentId, status, consultantId, notes, date, duration, type } = body

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (consultantId !== undefined) updateData.consultantId = consultantId
    if (notes !== undefined) updateData.notes = notes
    if (date) updateData.date = new Date(date)
    if (duration) updateData.duration = duration
    if (type) updateData.type = type

    const appointment = await db.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        consultant: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    })

    // Notify the user about appointment status change
    if (status) {
      const statusMessages: Record<string, { title: string; message: string }> = {
        SCHEDULED: {
          title: "Appointment Approved!",
          message: `Your appointment has been approved and scheduled`,
        },
        CANCELLED: {
          title: "Appointment Cancelled",
          message: `Your appointment has been cancelled by admin`,
        },
        RESCHEDULED: {
          title: "Appointment Rescheduled",
          message: `Your appointment has been rescheduled`,
        },
        COMPLETED: {
          title: "Appointment Completed",
          message: `Your appointment has been marked as completed`,
        },
      }

      const notifData = statusMessages[status]
      if (notifData && appointment.user) {
        await db.notification.create({
          data: {
            userId: appointment.user.id,
            title: notifData.title,
            message: notifData.message,
            type: "APPOINTMENT",
            link: "/dashboard/appointments",
          },
        })
      }
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("Admin appointments PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
