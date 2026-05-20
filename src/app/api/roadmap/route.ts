import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const startup = await db.startup.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
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

    return NextResponse.json(grouped)
  } catch (error) {
    console.error("Roadmap GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
