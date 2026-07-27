import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { buildReopenSummary } from "@/lib/ai-context"

type Ctx = { params: Promise<{ id: string }> }

/**
 * GET /api/ai/chats/[id]
 * Fetch a single chat with all its messages, ordered by createdAt asc.
 *
 * Also returns a `reopenSummary` field, a short "Picking up where we left
 * off…" string the frontend can show above the messages so the user gets
 * instant context about what they were last discussing. Generated
 * heuristically (no LLM call) from the last user question + last AI heading.
 */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  const chat = await db.chat.findFirst({
    where: { id, userId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          structuredJson: true,
          createdAt: true,
        },
      },
    },
  })

  if (!chat) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Generate a "where we left off" summary if this is a returning chat
  // (more than 1 message, i.e., not a freshly-created empty chat).
  const reopenSummary =
    chat.messages.length > 1
      ? buildReopenSummary(
          chat.messages.map((m) => ({
            role: m.role,
            content: m.structuredJson || m.content,
          }))
        )
      : null

  return NextResponse.json({ chat, reopenSummary })
}

/**
 * PATCH /api/ai/chats/[id]
 * Update chat title. Body: { title: string }
 */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  let title: string | undefined
  try {
    const body = await req.json()
    if (typeof body?.title === "string" && body.title.trim().length > 0) {
      title = body.title.trim().slice(0, 200)
    }
  } catch {
    // ignore
  }
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 })
  }

  const chat = await db.chat.updateMany({
    where: { id, userId: session.user.id },
    data: { title },
  })

  if (chat.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ id, title })
}

/**
 * DELETE /api/ai/chats/[id]
 * Delete a chat and all its messages (cascade).
 */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  const result = await db.chat.deleteMany({
    where: { id, userId: session.user.id },
  })

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
