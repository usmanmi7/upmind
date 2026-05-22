import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkResourceAchievements } from "@/lib/achievements"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { resourceId } = body

    if (!resourceId) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 })
    }

    // Check if already saved
    const existing = await db.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId: session.user.id,
          resourceId,
        },
      },
    })

    if (existing) {
      // Unsave
      await db.savedResource.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ saved: false })
    } else {
      // Save
      await db.savedResource.create({
        data: {
          userId: session.user.id,
          resourceId,
        },
      })

      // Check and award resource achievements
      checkResourceAchievements(session.user.id).catch(() => {})

      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error("Resource save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
