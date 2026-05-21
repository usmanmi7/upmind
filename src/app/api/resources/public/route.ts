import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

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
    if (search) where.title = { contains: search, mode: "insensitive" }
    if (premium === "true") where.isPremium = true
    if (premium === "false") where.isPremium = false

    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          type: true,
          category: true,
          tags: true,
          readTime: true,
          coverImage: true,
          thumbnailUrl: true,
          isPremium: true,
          downloadCount: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      }),
      db.resource.count({ where }),
    ])

    // Determine user's subscription status if logged in
    let subscription = null
    if (session?.user?.id) {
      const sub = await db.subscription.findUnique({
        where: { userId: session.user.id },
        select: { plan: true, status: true },
      })
      subscription = sub
    }

    return NextResponse.json({
      resources,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      user: session?.user
        ? {
            id: session.user.id,
            role: (session.user as { role: string }).role,
            subscription: subscription
              ? { plan: subscription.plan, status: subscription.status }
              : null,
          }
        : null,
    })
  } catch (error) {
    console.error("Public resources GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
