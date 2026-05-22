import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAIResponse } from "@/lib/ai"

const SYSTEM_PROMPT = `You are a helpful AI assistant on the Upmind platform. You can help users with ANY topic — not just startups. Feel free to answer questions about technology, science, health, education, business, creative writing, programming, current events, and anything else. Be helpful, accurate, and conversational.

Format your responses clearly. Use markdown formatting when helpful (headers, bullet points, bold, code blocks). Be concise but thorough.`

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { message, history, searchWeb } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Determine if web search is needed
    const shouldSearch =
      searchWeb === true ||
      /today|current|latest|recent|now|price|news|weather|stock|score|update|2024|2025|2026|who is|what is|where is|how much|how many|when is/i.test(
        message
      )

    // Build conversation messages from history
    const messages: Array<{ role: string; content: string }> = []

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      }
    }

    messages.push({ role: "user", content: message })

    // Use the unified AI response function (tries Z AI first, then Gemini)
    const result = await getAIResponse(messages, {
      searchWeb: shouldSearch,
      searchQuery: message,
      systemPrompt: SYSTEM_PROMPT,
    })

    return NextResponse.json({
      response: result.response,
      searched: result.searched,
    })
  } catch (error: unknown) {
    console.error("AI Chat error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"

    // Return a helpful error message
    return NextResponse.json(
      {
        error: "AI service unavailable",
        details: errorMessage,
      },
      { status: 503 }
    )
  }
}
