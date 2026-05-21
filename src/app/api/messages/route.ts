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
    const partnerId = searchParams.get("partnerId")

    if (partnerId) {
      // Get messages with specific partner
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: partnerId },
            { senderId: partnerId, receiverId: session.user.id },
          ],
        },
        orderBy: { createdAt: "asc" },
        take: 200,
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
      })

      // Mark as read
      await db.message.updateMany({
        where: {
          senderId: partnerId,
          receiverId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      })

      return NextResponse.json(messages)
    }

    // Get all conversations (grouped by partner)
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    // Get unique conversation partners with last message
    const conversationMap = new Map()
    for (const msg of messages) {
      const partnerId =
        msg.senderId === session.user.id ? msg.receiverId : msg.senderId
      if (!partnerId) continue

      if (!conversationMap.has(partnerId)) {
        const unreadCount = await db.message.count({
          where: {
            senderId: partnerId,
            receiverId: session.user.id,
            isRead: false,
          },
        })

        // Get partner info
        const partner = await db.user.findUnique({
          where: { id: partnerId },
          select: { id: true, name: true, image: true, role: true },
        })

        conversationMap.set(partnerId, {
          id: partnerId,
          user: partner || { id: partnerId, name: "Unknown User", image: null, role: "FREE_USER" },
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unread: unreadCount,
        })
      }
    }

    return NextResponse.json({
      conversations: Array.from(conversationMap.values()),
    })
  } catch (error) {
    console.error("Messages GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { receiverId, content } = body

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Receiver and content are required" },
        { status: 400 }
      )
    }

    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    // Create notification for receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        title: "New Message",
        message: `${session.user.name || "Someone"} sent you a message`,
        type: "MESSAGE",
        link: "/dashboard/messages",
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Messages POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
