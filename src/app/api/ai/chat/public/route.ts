import { NextRequest, NextResponse } from "next/server"
import {
  AI_SYSTEM_PROMPT,
  cleanText,
  parseStructuredResponseSafe,
  derivePlainResponse,
  looksLikeJson,
  type StructuredAIResponse,
} from "@/lib/ai-prompt"

export const runtime = "nodejs"
export const maxDuration = 60

// ─── Simple in-memory rate limiting (per IP) ─────────────────────────────────
// Allows 10 requests per IP per 60-second window. Resets on serverless cold
// start (acceptable for a free public demo; for production-scale abuse control
// use Vercel KV or Upstash Redis).
interface RateBucket {
  count: number
  firstRequestAt: number
}

const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10 // 10 requests per minute per IP

const rateBuckets = new Map<string, RateBucket>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)

  if (!bucket || now - bucket.firstRequestAt > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, firstRequestAt: now })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetInMs: RATE_LIMIT_WINDOW_MS }
  }

  bucket.count += 1
  const remaining = Math.max(0, RATE_LIMIT_MAX - bucket.count)
  const resetInMs = RATE_LIMIT_WINDOW_MS - (now - bucket.firstRequestAt)

  return {
    allowed: bucket.count <= RATE_LIMIT_MAX,
    remaining,
    resetInMs: Math.max(0, resetInMs),
  }
}

const systemPrompt = AI_SYSTEM_PROMPT

const DEFAULT_MODEL = "z-ai/glm-5.2"

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

export async function POST(req: NextRequest) {
  try {
    // ─── Rate limit check ───
    const ip = getClientIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          details: `Too many requests. Try again in ${Math.ceil(rate.resetInMs / 1000)} seconds.`,
          response:
            "You've sent a lot of questions in a short time. Please wait a minute and try again, or sign up for an account for unlimited access.",
          retryAfter: Math.ceil(rate.resetInMs / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rate.resetInMs / 1000)),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }

    const body = await req.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Cap history at 4 messages for public demo (to limit token cost)
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ]

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-4)) {
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
          max_tokens: 600, // Lower cap for public endpoint
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

    let structured: StructuredAIResponse = {}
    let plainResponse = raw

    const { structured: parsed } = parseStructuredResponseSafe(raw)
    structured = parsed
    const derived = derivePlainResponse(structured)

    if (derived) {
      plainResponse = derived
    } else if (looksLikeJson(raw)) {
      // The model returned something JSON-shaped but we couldn't extract
      // any usable fields. Don't dump raw JSON at the user — show a
      // friendly retry message instead.
      plainResponse =
        "I had trouble formatting that response. Could you try asking again?"
      structured = {}
    } else {
      // Plain text response (no JSON at all) — show as-is.
      plainResponse = cleanText(raw)
      structured = {}
    }

    return NextResponse.json({
      response: plainResponse,
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
      rateLimit: {
        remaining: rate.remaining,
        limit: RATE_LIMIT_MAX,
        resetInMs: rate.resetInMs,
      },
    })
  } catch (error: unknown) {
    console.error("Public AI Chat error:", error)
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
 * GET endpoint: status + rate limit info for the public endpoint.
 */
export async function GET() {
  const configured = !!process.env.NVIDIA_API_KEY
  const model = process.env.NVIDIA_MODEL || DEFAULT_MODEL
  const withoutOrg = model.split("/").pop() || model
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
    public: true,
    rateLimit: {
      max: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
    hint: configured
      ? undefined
      : "Set NVIDIA_API_KEY in Vercel env vars to enable the AI. Get a free key at https://build.nvidia.com/z-ai/glm-5.2",
  })
}
