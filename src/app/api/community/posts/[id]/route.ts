import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/community/posts/[id] - Get a single post with comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const post = await db.communityPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            startup: { select: { name: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                startup: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likedBy: {
          where: { userId: session.user.id },
          select: { id: true },
        },
        _count: { select: { comments: true, likedBy: true } },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...post,
      commentCount: post._count.comments,
      likeCount: post._count.likedBy,
      isLikedByUser: post.likedBy.length > 0,
      likedBy: undefined,
      _count: undefined,
    })
  } catch (error) {
    console.error("Community post GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/community/posts/[id] - Delete a post (author or admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const post = await db.communityPost.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
    if (post.authorId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.communityPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Community post DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
