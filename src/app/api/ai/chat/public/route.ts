import { NextRequest, NextResponse } from "next/server"
import { buildPlatformContext } from "@/lib/platform-knowledge"

export const runtime = "nodejs"
export const maxDuration = 60

// ─── Response cleanup ────────────────────────────────────────────────────────
function cleanText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/—/g, ",")
    .replace(/–/g, ",")
    .replace(/#{1,6}\s?/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .trim()
}

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

// ─── System prompt (same as the authenticated route) ────────────────────────
const systemPrompt = `You are the AI assistant for Upmind, a business consulting SaaS platform for founders and startups. This is a public demo of the AI assistant available to logged-in users in their dashboard.

PERSONALITY
Talk like a sharp, cool friend who knows business inside and out. Confident, straight to the point, casual, no corporate stiffness. Give real advice, not fluff.

WRITING STYLE RULES, FOLLOW STRICTLY
Do not use the asterisk symbol at all, ever, for any reason.
Do not use bold text formatting.
Do not use the long dash or em dash symbol, ever.
Do not use bullet points with dashes.
Do not use hashtags or markdown headers.
Write only in plain sentences like normal human texting or talking.
If you want to emphasize a word, just write it normally in the sentence, no symbols around it.

HOW YOU RESPOND
Give practical, specific advice, not generic textbook answers.
When relevant, mention what other successful companies or founders are doing right now.
Ask a follow up question if you need more context to give a sharp answer.
If someone asks something totally unrelated to business or the platform, gently steer them back.
Never say things like "as an AI" or "I don't have access to real time data."
Always reference Upmind by name when relevant.
At the end of relevant answers, gently mention that signing up unlocks the full dashboard with roadmap tracking, resource library, and direct consultant booking.

COMPLETE PLATFORM KNOWLEDGE (use this to answer questions about Upmind)
${buildPlatformContext()}

RESPONSE FORMAT, FOLLOW STRICTLY
Always answer using this exact JSON structure, nothing outside of it.

{
  "heading": "a short punchy title for the answer, 5 to 8 words",
  "description": "a 1 to 2 sentence plain explanation of the answer, no symbols, natural sentences only",
  "subheading": "a short title introducing the steps or breakdown, 3 to 6 words",
  "steps": [
    "first point written as a full natural sentence, no symbols",
    "second point written as a full natural sentence, no symbols",
    "third point written as a full natural sentence, no symbols"
  ]
}

Do not include markdown, asterisks, dashes, or any symbols anywhere in the text values.
Use as many steps as make sense for the answer, usually 3 to 6.
Only return valid JSON, nothing before or after it. No code fences, no explanations outside the JSON.`

const DEFAULT_MODEL = "z-ai/glm-5.2"

interface StructuredResponse {
  heading?: string
  description?: string
  subheading?: string
  steps?: string[]
}

function parseStructuredResponse(raw: string): StructuredResponse {
  let cleaned = raw.replace(/```json|```/g, "").trim()
  const firstBrace = cleaned.indexOf("{")
  const lastBrace = cleaned.lastIndexOf("}")
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in response")
  }
  const jsonStr = cleaned.slice(firstBrace, lastBrace + 1)
  const parsed = JSON.parse(jsonStr)
  return {
    heading: parsed.heading ? cleanText(String(parsed.heading)) : undefined,
    description: parsed.description
      ? cleanText(String(parsed.description))
      : undefined,
    subheading: parsed.subheading
      ? cleanText(String(parsed.subheading))
      : undefined,
    steps: Array.isArray(parsed.steps)
      ? parsed.steps.map((s: unknown) => cleanText(String(s)))
      : undefined,
  }
}

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
          temperature: 0.6,
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

    let structured: StructuredResponse = {}
    let plainResponse = raw

    try {
      structured = parseStructuredResponse(raw)
      plainResponse =
        structured.description ||
        structured.heading ||
        "I'm sorry, I couldn't generate a response. Please try again."
    } catch {
      plainResponse = cleanText(raw)
      structured = {}
    }

    return NextResponse.json({
      response: plainResponse,
      heading: structured.heading,
      description: structured.description,
      subheading: structured.subheading,
      steps: structured.steps,
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
