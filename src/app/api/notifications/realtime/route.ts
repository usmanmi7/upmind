import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial notification count
        const sendUpdate = async () => {
          try {
            const unreadCount = await db.notification.count({
              where: {
                userId: session.user.id,
                isRead: false,
              },
            })

            const recentNotifications = await db.notification.findMany({
              where: { userId: session.user.id },
              orderBy: { createdAt: "desc" },
              take: 5,
            })

            const data = JSON.stringify({
              unreadCount,
              recentNotifications,
            })

            controller.enqueue(
              encoder.encode(`data: ${data}\n\n`)
            )
          } catch {
            // Silently handle errors
          }
        }

        await sendUpdate()

        // Poll every 10 seconds
        const interval = setInterval(sendUpdate, 10000)

        // Clean up after 5 minutes
        setTimeout(() => {
          clearInterval(interval)
          controller.close()
        }, 300000)
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch {
    return new Response("Internal server error", { status: 500 })
  }
}
