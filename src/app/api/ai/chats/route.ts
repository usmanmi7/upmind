import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

/**
 * GET /api/ai/chats
 * List all AI chat conversations for the authenticated user, newest first.
 * Each chat includes id, title, updatedAt, and a count of messages.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const chats = await db.chat.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
    take: 100,
  })

  return NextResponse.json({ chats })
}

/**
 * POST /api/ai/chats
 * Create a new chat conversation. Body: { title?: string }
 * Returns the created chat record.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let title = "New chat"
  try {
    const body = await req.json()
    if (typeof body?.title === "string" && body.title.trim().length > 0) {
      title = body.title.trim().slice(0, 200)
    }
  } catch {
    // empty body is fine — default title used
  }

  const chat = await db.chat.create({
    data: {
      userId: session.user.id,
      title,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({ chat }, { status: 201 })
}
