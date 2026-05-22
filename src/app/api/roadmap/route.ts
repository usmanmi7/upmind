import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkRoadmapAchievements, awardAchievement } from "@/lib/achievements"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const startup = await db.startup.findUnique({
      where: { userId: session.user.id },
      select: { id: true, progress: true },
    })

    if (!startup) {
      return NextResponse.json({ phases: {}, progress: 0 })
    }

    const roadmapItems = await db.roadmapItem.findMany({
      where: { startupId: startup.id },
      orderBy: [{ phase: "asc" }, { order: "asc" }],
    })

    const grouped = roadmapItems.reduce((acc, item) => {
      if (!acc[item.phase]) acc[item.phase] = []
      acc[item.phase].push(item)
      return acc
    }, {} as Record<string, typeof roadmapItems>)

    return NextResponse.json({ phases: grouped, progress: startup.progress })
  } catch (error) {
    console.error("Roadmap GET error:", error)
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
    const { title, phase, description } = body

    if (!title || !phase) {
      return NextResponse.json({ error: "Title and phase are required" }, { status: 400 })
    }

    // Get or create startup
    let startup = await db.startup.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!startup) {
      startup = await db.startup.create({
        data: {
          userId: session.user.id,
          name: "My Startup",
        },
        select: { id: true },
      })
    }

    // Get the max order for this phase
    const maxOrderItem = await db.roadmapItem.findFirst({
      where: { startupId: startup.id, phase },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const roadmapItem = await db.roadmapItem.create({
      data: {
        startupId: startup.id,
        title,
        phase,
        description: description || null,
        order: (maxOrderItem?.order || 0) + 1,
        isCompleted: false,
      },
    })

    // Award roadmap starter achievement
    awardAchievement(session.user.id, "ROADMAP_STARTER").catch(() => {})

    return NextResponse.json(roadmapItem, { status: 201 })
  } catch (error) {
    console.error("Roadmap POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, isCompleted, title, description } = body

    if (!id) {
      return NextResponse.json({ error: "Roadmap item ID is required" }, { status: 400 })
    }

    const startup = await db.startup.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    // Verify the item belongs to this user's startup
    const existing = await db.roadmapItem.findFirst({
      where: { id, startupId: startup.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Roadmap item not found" }, { status: 404 })
    }

    const updated = await db.roadmapItem.update({
      where: { id },
      data: {
        ...(isCompleted !== undefined && { isCompleted }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
    })

    // Recalculate startup progress based on roadmap completion
    const allItems = await db.roadmapItem.findMany({
      where: { startupId: startup.id },
    })
    const completedCount = allItems.filter((item) => item.isCompleted).length
    const progress = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0

    await db.startup.update({
      where: { id: startup.id },
      data: { progress },
    })

    // Check and award roadmap achievements if item was completed
    if (isCompleted === true) {
      checkRoadmapAchievements(session.user.id).catch(() => {})
    }

    return NextResponse.json({ ...updated, progress })
  } catch (error) {
    console.error("Roadmap PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Roadmap item ID required" }, { status: 400 })
    }

    const startup = await db.startup.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    await db.roadmapItem.delete({
      where: { id, startupId: startup.id },
    })

    // Recalculate progress
    const allItems = await db.roadmapItem.findMany({
      where: { startupId: startup.id },
    })
    const completedCount = allItems.filter((item) => item.isCompleted).length
    const progress = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0

    await db.startup.update({
      where: { id: startup.id },
      data: { progress },
    })

    return NextResponse.json({ message: "Roadmap item deleted", progress })
  } catch (error) {
    console.error("Roadmap DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
