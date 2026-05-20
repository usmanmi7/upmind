import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Import z-ai-web-dev-sdk
    const ZAI = (await import("z-ai-web-dev-sdk")).default
    const zai = await ZAI.create()

    // Build conversation messages
    const messages: Array<{ role: string; content: string }> = [
      {
        role: "system",
        content:
          "You are an AI startup consultant for the Upmind platform. Help users with startup strategy, business planning, marketing, growth advice, product development, fundraising, and team building. Be concise, actionable, and encouraging. Provide specific recommendations when possible. Format your responses with markdown for readability.",
      },
    ]

    // Add history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      }
    }

    messages.push({ role: "user", content: message })

    const completion = await zai.chat.completions.create({
      messages: messages.map((m) => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content,
      })),
    })

    const response =
      completion.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
