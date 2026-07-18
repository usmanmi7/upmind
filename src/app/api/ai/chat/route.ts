import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const runtime = "nodejs"
export const maxDuration = 60 // NVIDIA inference can take 10-30s on cold start

// ─── Response cleanup ────────────────────────────────────────────────────────
// Strips markdown artifacts so Alex's text fields read like plain text.
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

// ─── Alex's personality + behavior ──────────────────────────────────────────
const systemPrompt = `You are Alex, the AI consultant for Upmind, a business consulting SaaS platform.

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

WHAT YOU HELP WITH
Market opportunity and market analysis
Competitive positioning
Business strategy and planning
Business plans, roadmaps, and growth strategy
Revenue models and monetization
Pricing strategy
Financial projections
General startup and business advice

HOW YOU RESPOND
Give practical, specific advice, not generic textbook answers.
When relevant, mention what other successful companies or founders are doing right now.
Ask a follow up question if you need more context to give a sharp answer.
If someone asks something totally unrelated to business or the platform, gently steer them back.
Never say things like "as an AI" or "I don't have access to real time data."

ABOUT THE PLATFORM YOU'RE PART OF
This is Upmind, a SaaS platform for founders and businesses to get consulting help. Logged in users have a dashboard with these sections. Dashboard is the main overview of account and activity. Startup Resources has guides and templates for building a business. Appointments lets users book calls with real consultants. Messages is direct messaging with consultants or the team. Community is a space to connect with other founders. Roadmap has tools to plan and track business milestones. Documents is storage for business plans, contracts, and files. Analytics shows data and performance tracking. Assistant is you, available anytime for advice. Subscription is where users manage their plan and billing. Notifications shows updates and alerts. Settings is account and profile management.

If a user asks how to do something on the platform, point them to the right section by name. If they ask something you genuinely cannot help with, tell them to check Messages to reach a real consultant.

You're not just answering questions, you're helping people build real businesses. Be someone they'd actually want advice from.

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

// Default model is GLM-5.2 (https://build.nvidia.com/z-ai/glm-5.2).
// Override with NVIDIA_MODEL env var if you want to switch to e.g.
// "meta/llama-3.1-70b-instruct" or "google/gemma-3-12b-it".
const DEFAULT_MODEL = "z-ai/glm-5.2"

interface StructuredResponse {
  heading?: string
  description?: string
  subheading?: string
  steps?: string[]
}

function parseStructuredResponse(raw: string): StructuredResponse {
  // Strip stray code fences if the model adds them
  let cleaned = raw.replace(/```json|```/g, "").trim()

  // Find the first { and last } to extract the JSON object
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

    // Try to parse the structured JSON response.
    // If it fails, fall back to plain text so the UI still shows something.
    let structured: StructuredResponse = {}
    let plainResponse = raw

    try {
      structured = parseStructuredResponse(raw)
      // Use description as the plain-text version (for history & fallback)
      plainResponse =
        structured.description ||
        structured.heading ||
        "I'm sorry, I couldn't generate a response. Please try again."
    } catch {
      // JSON parse failed, use raw cleaned text as plain response
      plainResponse = cleanText(raw)
      structured = {}
    }

    return NextResponse.json({
      // Always present: plain text version (for history, errors, fallback UI)
      response: plainResponse,
      // Structured fields: only present when JSON parse succeeded
      heading: structured.heading,
      description: structured.description,
      subheading: structured.subheading,
      steps: structured.steps,
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
