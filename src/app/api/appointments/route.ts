import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkAppointmentAchievements } from "@/lib/achievements"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appointments = await db.appointment.findMany({
      where: { userId: session.user.id },
      include: {
        consultant: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Appointments GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { consultantId, date, duration, type, notes } = body

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      )
    }

    // Parse and validate the date
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      )
    }

    // Validate meeting type
    const validTypes = ["VIDEO", "PHONE", "IN_PERSON"]
    const meetingType = validTypes.includes(type) ? type : "VIDEO"

    // Try to create appointment with PENDING status
    // If PENDING enum is not in the DB yet, fall back to SCHEDULED
    let appointment
    try {
      appointment = await db.appointment.create({
        data: {
          userId: session.user.id,
          consultantId: consultantId || null,
          date: parsedDate,
          duration: duration || 60,
          type: meetingType,
          notes: notes || null,
          status: "PENDING",
        },
      })
    } catch (createError: unknown) {
      const errMsg =
        createError instanceof Error ? createError.message : String(createError)
      console.warn(
        "PENDING status failed, falling back to SCHEDULED:",
        errMsg
      )

      // If PENDING doesn't exist in the enum, fall back to SCHEDULED
      try {
        appointment = await db.appointment.create({
          data: {
            userId: session.user.id,
            consultantId: consultantId || null,
            date: parsedDate,
            duration: duration || 60,
            type: meetingType,
            notes: notes || null,
            status: "SCHEDULED",
          },
        })
      } catch (fallbackError: unknown) {
        const fallbackMsg =
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError)
        console.error("SCHEDULED fallback also failed:", fallbackMsg)
        return NextResponse.json(
          {
            error: "Failed to create appointment",
            details: fallbackMsg,
          },
          { status: 500 }
        )
      }
    }

    // Try to notify admins about the new appointment
    try {
      const admins = await db.user.findMany({
        where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        select: { id: true },
      })

      if (admins.length > 0) {
        await db.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: "New Appointment Request",
            message: `${session.user.name || "A user"} requested an appointment`,
            type: "APPOINTMENT",
            link: "/dashboard/appointments",
          })),
        })
      }
    } catch (notifError) {
      // Don't fail the appointment if notification fails
      console.error("Failed to send admin notification:", notifError)
    }

    // Check and award appointment achievements
    checkAppointmentAchievements(session.user.id).catch(() => {})

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Appointments POST error:", error)
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    )
  }
}
