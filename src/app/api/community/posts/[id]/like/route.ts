import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST /api/community/posts/[id]/like - Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: postId } = await params

    const post = await db.communityPost.findUnique({ where: { id: postId } })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const existingLike = await db.postLike.findUnique({
      where: { postId_userId: { postId, userId: session.user.id } },
    })

    if (existingLike) {
      // Unlike
      await db.postLike.delete({ where: { id: existingLike.id } })
      await db.communityPost.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
      })
      return NextResponse.json({ liked: false, likeCount: post.likes - 1 })
    } else {
      // Like
      await db.postLike.create({
        data: { postId, userId: session.user.id },
      })
      await db.communityPost.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      })
      return NextResponse.json({ liked: true, likeCount: post.likes + 1 })
    }
  } catch (error) {
    console.error("Post like toggle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
