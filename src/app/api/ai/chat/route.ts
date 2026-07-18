import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const runtime = "nodejs"
export const maxDuration = 60 // NVIDIA inference can take 10-30s on cold start

// ─── Response cleanup ────────────────────────────────────────────────────────
// Strips markdown artifacts so Alex's replies read like plain text messages.
function cleanAIResponse(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/—/g, ",")
    .replace(/–/g, ",")
    .replace(/#{1,6}\s?/g, "")
    .replace(/^\s*-\s+/gm, "")
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
If you need to list things, write them as a flowing sentence or say "First... then... after that..."

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

You're not just answering questions, you're helping people build real businesses. Be someone they'd actually want advice from.`

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
          max_tokens: 600,
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
    let reply =
      data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again."
    reply = cleanAIResponse(reply)

    return NextResponse.json({
      response: reply,
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
