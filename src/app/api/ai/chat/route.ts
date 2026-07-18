import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  chatWithNVIDIA,
  isNVIDIAConfigured,
  getNVIDIAModel,
  getNVIDIAModelLabel,
  type ChatMessage,
} from "@/lib/nvidia"
import { chatWithLMStudio, isLMStudioConfigured } from "@/lib/lmstudio"

export const runtime = "nodejs"
export const maxDuration = 60 // NVIDIA inference can take 10-30s on cold start

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
          "You are a helpful AI assistant on the Upmind platform. You help users with startup strategy, business planning, marketing, growth advice, product development, fundraising, and team building. You can also answer general questions on technology, science, education, health, and creative work. Be concise, actionable, and encouraging. Provide specific recommendations when possible. Format your responses with markdown for readability (headers, bullet points, bold, code blocks when helpful).",
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

    // ── Strategy 1: NVIDIA Build (production-grade, works on Vercel) ──
    if (isNVIDIAConfigured()) {
      try {
        const response = await chatWithNVIDIA({ messages })
        return NextResponse.json({
          response,
          model: getNVIDIAModel(),
          modelLabel: getNVIDIAModelLabel(),
          provider: "nvidia",
        })
      } catch (nvError) {
        console.error(
          "NVIDIA Build error, trying fallback:",
          nvError instanceof Error ? nvError.message : "Unknown error"
        )
        // Fall through to next strategy
      }
    }

    // ── Strategy 2: LM Studio (local dev / tunneled) ──
    if (isLMStudioConfigured()) {
      try {
        const response = await chatWithLMStudio({ messages })
        return NextResponse.json({
          response,
          model: "gemma-12b-lmstudio",
          provider: "lmstudio",
        })
      } catch (lmError) {
        console.error(
          "LM Studio error, trying Z AI fallback:",
          lmError instanceof Error ? lmError.message : "Unknown error"
        )
      }
    }

    // ── Strategy 3: Z AI SDK (last-resort fallback) ──
    try {
      const ZAIModule = await import("z-ai-web-dev-sdk")
      const ZAI = ZAIModule.default
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
        provider: "z-ai",
      })
    } catch (zaiError) {
      console.error(
        "Z AI SDK also failed:",
        zaiError instanceof Error ? zaiError.message : "Unknown error"
      )
      throw zaiError
    }
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

/**
 * GET endpoint to check AI service status
 * Used by the dashboard search bar to show which model is active.
 */
export async function GET() {
  const nvidiaConfigured = isNVIDIAConfigured()
  const lmStudioConfigured = isLMStudioConfigured()

  let activeModel = "none"
  let activeProvider = "none"
  let activeLabel = "AI Offline"

  if (nvidiaConfigured) {
    activeModel = getNVIDIAModel()
    activeProvider = "nvidia"
    activeLabel = getNVIDIAModelLabel()
  } else if (lmStudioConfigured) {
    activeModel = process.env.LMSTUDIO_MODEL || "gemma-3-12b-it"
    activeProvider = "lmstudio"
    activeLabel = "Gemma 12B (Local)"
  }

  return NextResponse.json({
    online: nvidiaConfigured || lmStudioConfigured,
    provider: activeProvider,
    model: activeModel,
    label: activeLabel,
    nvidiaConfigured,
    lmStudioConfigured,
    lmStudioBaseUrl: process.env.LMSTUDIO_BASE_URL || "not set",
    hint:
      !nvidiaConfigured && !lmStudioConfigured
        ? "Set NVIDIA_API_KEY in Vercel env vars to enable the AI. Get a free key at https://build.nvidia.com"
        : undefined,
  })
}
