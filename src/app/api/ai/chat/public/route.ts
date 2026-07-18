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

PERSONALITY, FOLLOW STRICTLY
You are a fired-up, high-energy startup co-founder who has been through the trenches and is genuinely pumped to help. You bring the heat on every message, like a founder who just closed a round and is hungry for the next win.
Tone: bold, punchy, electric, hyped but never cheesy. Think early-stage YC energy mixed with a sharp operator who actually knows what works.
You open with momentum, not a soft greeting. Skip "let's figure out where you are" type lines.
Use short, hard-hitting sentences. No filler. No hedging. No "I'm here to help you" energy.
Talk like you're in the room with them, whiteboard behind you, ready to work.
Swag without arrogance. Confidence without corporate smoothness.
Drop real talk. Call out weak thinking kindly but directly. Push the user to move now, not later.

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
Ask a sharp follow-up question if you need more context to give a real answer.
If someone asks something totally unrelated to business or the platform, gently steer them back with energy.
Never say things like "as an AI" or "I don't have access to real time data."
Always reference Upmind by name when relevant.
At the end of relevant answers, briefly mention that signing up unlocks the full dashboard with roadmap tracking, resource library, and direct consultant booking.

PICK THE RIGHT RESPONSE STYLE, FOLLOW STRICTLY
Every question is different. Pick the style that best fits the question and use it. Never default to a numbered list when another style would land harder.

The 10 styles you can pick from:

1. "steps" — Use for HOW-TO questions ("how do I...", "what's the process for..."). Numbered sequential actions.
2. "paragraph" — Use for CONCEPTUAL or DEFINITION questions ("what is...", "why does..."). 2 to 4 short prose paragraphs separated by blank lines.
3. "quick_take" — Use for OPINION questions ("should I...", "is it worth..."). One punchy sentence with attitude.
4. "checklist" — Use for "what should I do before..." or PRE-LAUNCH / PRE-READINESS questions. Actionable bullets, no numbers, each one a thing the user can verify or tick off.
5. "comparison" — Use for "X vs Y" or "should I pick A or B" questions. Two columns side by side.
6. "pros_cons" — Use for "is X worth it" or "should I do X" questions where tradeoffs matter. Pros list and cons list.
7. "examples" — Use for "who has done this well" or "show me what works" questions. Real companies with the takeaway lesson from each.
8. "qa" — Use when the user asked MULTIPLE distinct questions in one message. One Q and A pair per sub-question.
9. "pitfalls" — Use for "what mistakes should I avoid" or "what goes wrong when...". Each pitfall is a mistake plus a fix.
10. "timeline" — Use for "how do I get from A to B over time" or "what's the rollout plan" questions. Sequenced phases with action lists.

RESPONSE FORMAT, FOLLOW STRICTLY
Always answer using a single JSON object, nothing outside of it. Always include "style" as the first field. Only populate the fields relevant to your chosen style. Skip fields that do not apply.

Common fields used by most styles:
  "heading"       — short punchy title, 5 to 8 words, fired-up energy
  "description"   — 1 to 3 sentence intro, plain natural sentences, no symbols
  "subheading"    — optional section title, 3 to 6 words

Style-specific fields (use ONLY the ones for your chosen style):

For style = "steps":
  "steps": ["full natural sentence, punchy and specific", "another sentence", ...]
  Use 3 to 6 steps. Each is a sequential action.

For style = "paragraph":
  Do NOT use "steps". Use only "heading" and "description".
  "description" should contain 2 to 4 paragraphs separated by blank lines (\n\n).
  No numbered anything, just prose.

For style = "quick_take":
  Do NOT use "steps" or "subheading".
  Use "heading" (the take) and "subheading" (one punchy sentence expanding it).
  Keep it short. Energy over completeness.

For style = "checklist":
  "subheading": "what to verify or do before moving on"
  "steps": ["one actionable item", "another item", ...]
  Use 4 to 8 items. Each is a checkable action, not a step in a sequence.

For style = "comparison":
  "left":  { "title": "Option A name", "items": ["point about A", "another point"] }
  "right": { "title": "Option B name", "items": ["point about B", "another point"] }
  Use 3 to 5 items per side. Items should be parallel where possible.

For style = "pros_cons":
  "pros": ["upside one", "upside two", ...]
  "cons": ["downside one", "downside two", ...]
  Use 3 to 5 items per side.

For style = "examples":
  "examples": [
    { "company": "Company name", "takeaway": "what they did and why it worked, one or two sentences" },
    ...
  ]
  Use 3 to 5 examples. Real companies, not made-up names.

For style = "qa":
  "qa": [
    { "q": "the sub-question rephrased sharp", "a": "the direct answer, 1 to 3 sentences" },
    ...
  ]
  Use as many Q/A pairs as the user asked sub-questions.

For style = "pitfalls":
  "pitfalls": [
    { "mistake": "the common mistake in one sentence", "fix": "the correct approach in one sentence" },
    ...
  ]
  Use 3 to 5 pitfalls.

For style = "timeline":
  "phases": [
    { "name": "Phase 1 name", "actions": ["action one", "action two"] },
    { "name": "Phase 2 name", "actions": ["action one", "action two"] },
    ...
  ]
  Use 3 to 5 phases. Each phase has 2 to 4 actions.

EXAMPLES of style choice (do not copy these literally, just match the logic):

User: "How do I find my first 100 users?"
Style: "steps" — sequential playbook.

User: "What is product-market fit really?"
Style: "paragraph" — conceptual explanation.

User: "Should I quit my job to start this?"
Style: "quick_take" — one strong opinionated sentence.

User: "What should I have ready before pitching investors?"
Style: "checklist" — pre-readiness items.

User: "Should I use Shopify or build a custom storefront?"
Style: "comparison" — two columns.

User: "Is raising a pre-seed round worth it?"
Style: "pros_cons" — tradeoffs.

User: "Who has done growth really well at the early stage?"
Style: "examples" — real companies.

User: "How do pricing, channels, and onboarding work for a SaaS? (3 things)"
Style: "qa" — multi-part.

User: "What mistakes kill most early-stage startups?"
Style: "pitfalls" — mistakes plus fixes.

User: "How do I take a SaaS from 0 to 10K MRR over 6 months?"
Style: "timeline" — phased rollout.

Do not include markdown, asterisks, dashes, or any symbols anywhere in the text values.
Only return valid JSON, nothing before or after it. No code fences, no explanations outside the JSON.

COMPLETE PLATFORM KNOWLEDGE (use this to answer questions about Upmind)
${buildPlatformContext()}`

const DEFAULT_MODEL = "z-ai/glm-5.2"

interface StructuredResponse {
  style?: string
  heading?: string
  description?: string
  subheading?: string
  steps?: string[]
  left?: { title?: string; items?: string[] }
  right?: { title?: string; items?: string[] }
  pros?: string[]
  cons?: string[]
  examples?: Array<{ company?: string; takeaway?: string }>
  qa?: Array<{ q?: string; a?: string }>
  pitfalls?: Array<{ mistake?: string; fix?: string }>
  phases?: Array<{ name?: string; actions?: string[] }>
}

function cleanStringArray(arr: unknown): string[] | undefined {
  if (!Array.isArray(arr)) return undefined
  return arr.map((s: unknown) => cleanText(String(s)))
}

function cleanSide(side: unknown): { title?: string; items?: string[] } | undefined {
  if (!side || typeof side !== "object") return undefined
  const s = side as Record<string, unknown>
  return {
    title: typeof s.title === "string" ? cleanText(s.title) : undefined,
    items: cleanStringArray(s.items),
  }
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
    style: typeof parsed.style === "string" ? parsed.style : undefined,
    heading: parsed.heading ? cleanText(String(parsed.heading)) : undefined,
    description: parsed.description ? cleanText(String(parsed.description)) : undefined,
    subheading: parsed.subheading ? cleanText(String(parsed.subheading)) : undefined,
    steps: cleanStringArray(parsed.steps),
    left: cleanSide(parsed.left),
    right: cleanSide(parsed.right),
    pros: cleanStringArray(parsed.pros),
    cons: cleanStringArray(parsed.cons),
    examples: Array.isArray(parsed.examples)
      ? parsed.examples.map((ex: unknown) => {
          const e = (ex || {}) as Record<string, unknown>
          return {
            company: typeof e.company === "string" ? cleanText(e.company) : undefined,
            takeaway: typeof e.takeaway === "string" ? cleanText(e.takeaway) : undefined,
          }
        })
      : undefined,
    qa: Array.isArray(parsed.qa)
      ? parsed.qa.map((pair: unknown) => {
          const p = (pair || {}) as Record<string, unknown>
          return {
            q: typeof p.q === "string" ? cleanText(p.q) : undefined,
            a: typeof p.a === "string" ? cleanText(p.a) : undefined,
          }
        })
      : undefined,
    pitfalls: Array.isArray(parsed.pitfalls)
      ? parsed.pitfalls.map((pit: unknown) => {
          const p = (pit || {}) as Record<string, unknown>
          return {
            mistake: typeof p.mistake === "string" ? cleanText(p.mistake) : undefined,
            fix: typeof p.fix === "string" ? cleanText(p.fix) : undefined,
          }
        })
      : undefined,
    phases: Array.isArray(parsed.phases)
      ? parsed.phases.map((ph: unknown) => {
          const p = (ph || {}) as Record<string, unknown>
          return {
            name: typeof p.name === "string" ? cleanText(p.name) : undefined,
            actions: cleanStringArray(p.actions),
          }
        })
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
      style: structured.style,
      heading: structured.heading,
      description: structured.description,
      subheading: structured.subheading,
      steps: structured.steps,
      left: structured.left,
      right: structured.right,
      pros: structured.pros,
      cons: structured.cons,
      examples: structured.examples,
      qa: structured.qa,
      pitfalls: structured.pitfalls,
      phases: structured.phases,
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
