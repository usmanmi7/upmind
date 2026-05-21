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

    const startup = await db.startup.findUnique({
      where: { userId: session.user.id },
      include: {
        tasks: { orderBy: { createdAt: "desc" } },
        roadmapItems: { orderBy: { order: "asc" } },
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Startup GET error:", error)
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
    const { name, industry, teamSize, vision, goals, pitchDeckUrl, businessStage, revenueStage, website, socialLinks } = body

    const existing = await db.startup.findUnique({
      where: { userId: session.user.id },
    })

    let startup
    if (existing) {
      startup = await db.startup.update({
        where: { userId: session.user.id },
        data: {
          ...(name !== undefined && { name }),
          ...(industry !== undefined && { industry }),
          ...(teamSize !== undefined && { teamSize }),
          ...(vision !== undefined && { vision }),
          ...(goals !== undefined && { goals }),
          ...(pitchDeckUrl !== undefined && { pitchDeckUrl }),
          ...(businessStage !== undefined && { businessStage }),
          ...(revenueStage !== undefined && { revenueStage }),
          ...(website !== undefined && { website }),
          ...(socialLinks !== undefined && { socialLinks }),
        },
      })
    } else {
      startup = await db.startup.create({
        data: {
          userId: session.user.id,
          name: name || "My Startup",
          industry,
          teamSize,
          vision,
          goals,
          pitchDeckUrl,
          businessStage,
          revenueStage,
          website,
          socialLinks,
        },
      })
    }

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Startup PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
