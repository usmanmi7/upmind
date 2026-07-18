import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { chatWithLMStudio, isLMStudioConfigured, type ChatMessage } from "@/lib/lmstudio"

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

    // Build conversation messages
    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are an AI startup consultant for the Upmind platform. Help users with startup strategy, business planning, marketing, growth advice, product development, fundraising, and team building. Be concise, actionable, and encouraging. Provide specific recommendations when possible. Format your responses with markdown for readability.",
      },
    ]

    // Add history if provided (last 10 messages for context)
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })
      }
    }

    messages.push({ role: "user", content: message })

    // Try LM Studio first (if configured)
    if (isLMStudioConfigured()) {
      try {
        const response = await chatWithLMStudio({ messages })
        return NextResponse.json({
          response,
          model: "gemma-12b-lmstudio",
        })
      } catch (lmError) {
        console.error("LM Studio error, falling back to Z AI:", lmError)
        // Fall through to Z AI fallback
      }
    }

    // Fallback: Z AI SDK
    const ZAI = (await import("z-ai-web-dev-sdk")).default
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: messages.map((m) => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content,
      })),
    })

    const response =
      completion.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({
      response,
      model: "z-ai-fallback",
    })
  } catch (error: unknown) {
    console.error("AI Chat error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: errorMessage,
        response: "I'm having trouble connecting right now. Please try again in a moment."
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check AI service status
 */
export async function GET() {
  return NextResponse.json({
    lmStudioConfigured: isLMStudioConfigured(),
    lmStudioBaseUrl: process.env.LMSTUDIO_BASE_URL || "not set",
    lmStudioModel: process.env.LMSTUDIO_MODEL || "gemma-3-12b-it (default)",
  })
}
