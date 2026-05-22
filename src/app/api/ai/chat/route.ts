import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { initZAI, directAIChat } from "@/lib/ai"

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

    // Try using the SDK first, then fall back to direct HTTP calls
    try {
      const zai = await initZAI()

      // Web search if needed
      let searchContext = ""
      if (shouldSearch) {
        try {
          const searchResult = await zai.functions.invoke("web_search", {
            query: message,
            num: 5,
          })

          if (Array.isArray(searchResult) && searchResult.length > 0) {
            searchContext = searchResult
              .map(
                (
                  r: { name?: string; snippet?: string; url?: string },
                  i: number
                ) =>
                  `[${i + 1}] ${r.name || ""}: ${r.snippet || ""} (${r.url || ""})`
              )
              .join("\n")
          }
        } catch {
          // Search failed, continue without it
        }
      }

      // Build full messages with system prompt
      const fullMessages: Array<{ role: string; content: string }> = [
        {
          role: "system",
          content: `You are a helpful AI assistant on the Upmind platform. You can help users with ANY topic — not just startups. Feel free to answer questions about technology, science, health, education, business, creative writing, programming, current events, and anything else. Be helpful, accurate, and conversational.

${
  searchContext
    ? `\nI found some web search results that might be relevant. Use them to provide accurate, up-to-date information. If the search results are helpful, reference them naturally. If they're not relevant, ignore them.\n\nSearch Results:\n${searchContext}\n`
    : ""
}

Format your responses clearly. Use markdown formatting when helpful (headers, bullet points, bold, code blocks). Be concise but thorough.`,
        },
        ...messages,
      ]

      // Call the LLM
      const completion = await zai.chat.completions.create({
        messages: fullMessages.map((m) => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content,
        })),
      })

      const response =
        completion.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response. Please try again."

      return NextResponse.json({
        response,
        searched: shouldSearch && !!searchContext,
      })
    } catch (sdkError) {
      // SDK failed — fall back to direct HTTP calls
      console.warn(
        "SDK failed, trying direct HTTP fallback:",
        sdkError instanceof Error ? sdkError.message : "Unknown"
      )

      try {
        const result = await directAIChat(messages, {
          searchWeb: shouldSearch,
          searchQuery: message,
        })

        return NextResponse.json({
          response: result.response,
          searched: result.searched,
        })
      } catch (directError) {
        console.error(
          "Direct HTTP also failed:",
          directError instanceof Error ? directError.message : "Unknown"
        )
        return NextResponse.json(
          {
            error: "AI service unavailable",
            details:
              directError instanceof Error
                ? directError.message
                : "All AI endpoints failed",
          },
          { status: 503 }
        )
      }
    }
  } catch (error: unknown) {
    console.error("AI Chat unexpected error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
