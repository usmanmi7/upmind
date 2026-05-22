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
    const { message, history, searchWeb } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Import z-ai-web-dev-sdk
    const ZAI = (await import("z-ai-web-dev-sdk")).default
    const zai = await ZAI.create()

    // Web search if requested or if the question seems to need current info
    let searchContext = ""
    const shouldSearch =
      searchWeb === true ||
      /today|current|latest|recent|now|price|news|weather|stock|score|update|2024|2025|2026|who is|what is|where is|how much|how many|when is/i.test(
        message
      )

    if (shouldSearch) {
      try {
        const searchResult = await zai.functions.invoke("web_search", {
          query: message,
          num: 5,
        })

        if (
          Array.isArray(searchResult) &&
          searchResult.length > 0
        ) {
          searchContext = searchResult
            .map(
              (r: { name?: string; snippet?: string; url?: string }, i: number) =>
                `[${i + 1}] ${r.name || ""}: ${r.snippet || ""} (${r.url || ""})`
            )
            .join("\n")
        }
      } catch (searchError) {
        console.error("Web search failed:", searchError)
        // Continue without search results
      }
    }

    // Build conversation messages
    const messages: Array<{ role: string; content: string }> = [
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

    return NextResponse.json({
      response,
      searched: shouldSearch && !!searchContext,
    })
  } catch (error: unknown) {
    console.error("AI Chat error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: errorMessage,
        response:
          "I'm having trouble connecting right now. Please try again in a moment.",
      },
      { status: 500 }
    )
  }
}
