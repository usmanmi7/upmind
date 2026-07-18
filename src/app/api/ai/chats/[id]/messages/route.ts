import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

type Ctx = { params: Promise<{ id: string }> }

interface AppendMessage {
  role: "user" | "assistant"
  content: string
  structuredJson?: string | null
}

/**
 * POST /api/ai/chats/[id]/messages
 * Append one or more messages to a chat and bump its updatedAt.
 * Body: { messages: AppendMessage[] }
 *
 * Used after each AI exchange to persist both the user's prompt and the
 * assistant's reply in a single round-trip.
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  let payload: AppendMessage[] = []
  try {
    const body = await req.json()
    if (Array.isArray(body?.messages)) {
      payload = body.messages
    }
  } catch {
    // ignore parse errors
  }

  if (payload.length === 0) {
    return NextResponse.json({ error: "messages[] is required" }, { status: 400 })
  }

  // Sanitize
  const clean: AppendMessage[] = payload
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, 16000),
      structuredJson:
        typeof m.structuredJson === "string" ? m.structuredJson.slice(0, 65536) : null,
    }))

  if (clean.length === 0) {
    return NextResponse.json({ error: "no valid messages" }, { status: 400 })
  }

  // Verify ownership
  const owned = await db.chat.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  })
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Insert messages + touch chat's updatedAt
  await db.$transaction([
    db.chatMessage.createMany({ data: clean.map((m) => ({ chatId: id, ...m })) }),
    db.chat.update({ where: { id }, data: { updatedAt: new Date() } }),
  ])

  return NextResponse.json({ ok: true, count: clean.length }, { status: 201 })
}
