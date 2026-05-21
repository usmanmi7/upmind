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

    const achievements = await db.achievement.findMany({
      where: { userId: session.user.id },
      orderBy: { earnedAt: "desc" },
    })

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error("Achievements GET error:", error)
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
    const { type, title, description } = body

    if (!type || !title) {
      return NextResponse.json({ error: "Type and title are required" }, { status: 400 })
    }

    // Check if achievement already earned
    const existing = await db.achievement.findFirst({
      where: { userId: session.user.id, type },
    })

    if (existing) {
      return NextResponse.json({ achievement: existing, alreadyEarned: true })
    }

    const achievement = await db.achievement.create({
      data: {
        userId: session.user.id,
        type,
        title,
        description: description || "",
      },
    })

    // Create notification for the new achievement
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: "Achievement Unlocked!",
        message: `You earned the "${title}" achievement!`,
        type: "SYSTEM",
        link: "/dashboard/profile",
      },
    })

    return NextResponse.json({ achievement, alreadyEarned: false }, { status: 201 })
  } catch (error) {
    console.error("Achievements POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
