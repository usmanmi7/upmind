import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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

    if (!consultantId || !date) {
      return NextResponse.json({ error: "Consultant and date are required" }, { status: 400 })
    }

    const appointment = await db.appointment.create({
      data: {
        userId: session.user.id,
        consultantId,
        date: new Date(date),
        duration: duration || 60,
        type: type || "VIDEO",
        notes,
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Appointments POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
