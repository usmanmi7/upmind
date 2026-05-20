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

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const premium = searchParams.get("premium")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")

    const where: Record<string, unknown> = {}
    if (type) where.type = type
    if (category) where.category = category
    if (search) where.title = { contains: search }
    if (premium === "true") where.isPremium = true
    if (premium === "false") where.isPremium = false

    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          savedBy: {
            where: { userId: session.user.id },
            select: { id: true },
          },
        },
      }),
      db.resource.count({ where }),
    ])

    return NextResponse.json({
      resources: resources.map((r) => ({
        ...r,
        isSaved: r.savedBy.length > 0,
        savedBy: undefined,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Resources GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
