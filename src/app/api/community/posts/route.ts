import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkCommunityAchievements } from "@/lib/achievements"

// GET /api/community/posts - List posts with pagination, filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category") || ""
    const search = searchParams.get("search") || ""

    const where: Record<string, unknown> = {}
    if (category && category !== "all") where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const [posts, total] = await Promise.all([
      db.communityPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              startup: { select: { name: true } },
            },
          },
          _count: { select: { comments: true, likedBy: true } },
          likedBy: {
            where: { userId: session.user.id },
            select: { id: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.communityPost.count({ where }),
    ])

    const postsWithMeta = posts.map((post) => ({
      ...post,
      commentCount: post._count.comments,
      likeCount: post._count.likedBy,
      isLikedByUser: post.likedBy.length > 0,
      likedBy: undefined,
      _count: undefined,
    }))

    return NextResponse.json({
      posts: postsWithMeta,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Community posts GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/community/posts - Create a new post (FREE_USER, PAID_USER, CONSULTANT allowed)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = session.user.role
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Admins cannot create community posts" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const validCategories = ["general", "fundraising", "marketing", "product", "culture"]
    const postCategory = validCategories.includes(category) ? category : "general"

    const post = await db.communityPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: postCategory,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            startup: { select: { name: true } },
          },
        },
        _count: { select: { comments: true, likedBy: true } },
        likedBy: {
          where: { userId: session.user.id },
          select: { id: true },
        },
      },
    })

    // Check and award community achievements (non-blocking)
    checkCommunityAchievements(session.user.id).catch(() => {})

    return NextResponse.json({
      ...post,
      commentCount: post._count.comments,
      likeCount: post._count.likedBy,
      isLikedByUser: post.likedBy.length > 0,
      likedBy: undefined,
      _count: undefined,
    }, { status: 201 })
  } catch (error) {
    console.error("Community posts POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
