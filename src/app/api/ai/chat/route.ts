import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  AI_SYSTEM_PROMPT,
  cleanText,
  parseStructuredResponseSafe,
  derivePlainResponse,
  looksLikeJson,
  type StructuredAIResponse,
} from "@/lib/ai-prompt"

export const runtime = "nodejs"
export const maxDuration = 60 // NVIDIA inference can take 10-30s on cold start

const systemPrompt = AI_SYSTEM_PROMPT

// Default model is GLM-5.2 (https://build.nvidia.com/z-ai/glm-5.2).
// Override with NVIDIA_MODEL env var if you want to switch to e.g.
// "meta/llama-3.1-70b-instruct" or "google/gemma-3-12b-it".
const DEFAULT_MODEL = "z-ai/glm-5.2"

export async function POST(req: NextRequest) {
  try {
    // Auth: protect your NVIDIA credits from anonymous abuse
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

    // Build conversation: system prompt + last 10 history turns + new message
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ]

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      }
    }

    messages.push({ role: "user", content: message })

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.NVIDIA_MODEL || DEFAULT_MODEL,
          messages,
          max_tokens: 700,
          temperature: 0.85,
          stream: false,
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error(
        `NVIDIA API error ${response.status}:`,
        errText.slice(0, 500)
      )
      return NextResponse.json(
        {
          error: "AI service error",
          details: `NVIDIA returned ${response.status}`,
          response:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
        { status: 500 }
      )
    }

    const data = await response.json()
    const raw =
      data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again."

    // Parse the structured JSON response with a regex-based fallback so we
    // never dump raw JSON at the user when the model emits slightly
    // malformed JSON (extra quotes, trailing commas, unescaped newlines).
    let structured: StructuredAIResponse = {}
    let plainResponse = raw

    const { structured: parsed } = parseStructuredResponseSafe(raw)
    structured = parsed
    const derived = derivePlainResponse(structured)

    if (derived) {
      plainResponse = derived
    } else if (looksLikeJson(raw)) {
      plainResponse =
        "I had trouble formatting that response. Could you try asking again?"
      structured = {}
    } else {
      plainResponse = cleanText(raw)
      structured = {}
    }

    return NextResponse.json({
      // Always present: plain text version (for history, errors, fallback UI)
      response: plainResponse,
      // Structured fields: only present when JSON parse succeeded
      responseType: structured.responseType,
      heading: structured.heading,
      description: structured.description,
      subheading: structured.subheading,
      steps: structured.steps,
      paragraphs: structured.paragraphs,
      answer: structured.answer,
      optionA: structured.optionA,
      optionB: structured.optionB,
      question: structured.question,
      model: process.env.NVIDIA_MODEL || DEFAULT_MODEL,
      provider: "nvidia",
    })
  } catch (error: unknown) {
    console.error("AI Chat error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
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
 * GET endpoint: AI service status.
 * Used by the dashboard search bar to display the active model badge.
 */
export async function GET() {
  const configured = !!process.env.NVIDIA_API_KEY
  const model = process.env.NVIDIA_MODEL || DEFAULT_MODEL
  const withoutOrg = model.split("/").pop() || model
  // Pretty label: z-ai/glm-5.2 -> GLM-5.2, meta/llama-3.1-70b-instruct -> Llama 3.1 70B instruct
  const label = withoutOrg
    .replace(/^glm/i, "GLM")
    .replace(/^llama/i, "Llama")
    .replace(/^gemma/i, "Gemma")
    .replace(/-/g, " ")
    .replace(/\b(\d+b)\b/gi, (m) => m.toUpperCase())

  return NextResponse.json({
    online: configured,
    provider: configured ? "nvidia" : "none",
    model,
    label,
    nvidiaConfigured: configured,
    hint: configured
      ? undefined
      : "Set NVIDIA_API_KEY in Vercel env vars to enable the AI. Get a free key at https://build.nvidia.com/z-ai/glm-5.2",
  })
}
