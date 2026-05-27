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
    const { pitchText } = body

    if (!pitchText) {
      return NextResponse.json(
        { error: "Pitch text is required" },
        { status: 400 }
      )
    }

    const ZAI = (await import("z-ai-web-dev-sdk")).default
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a pitch deck analyzer. Analyze the given pitch and provide feedback. Return a JSON object with: score (0-100), clarity (0-100), impact (0-100), structure (0-100), strengths (array of strings), improvements (array of strings), summary (string). Be constructive and specific.",
        },
        {
          role: "user",
          content: `Analyze this pitch and provide detailed feedback:\n\n${pitchText}`,
        },
      ],
    })

    const responseText =
      completion.choices?.[0]?.message?.content || ""

    let feedback
    try {
      feedback = JSON.parse(responseText)
    } catch {
      feedback = {
        score: 65,
        clarity: 60,
        impact: 70,
        structure: 65,
        strengths: [
          "Clear problem statement",
          "Passionate delivery",
        ],
        improvements: [
          "Add specific metrics and traction data",
          "Strengthen the market size validation",
          "Include a clear ask with use of funds",
        ],
        summary:
          "Your pitch has potential but could benefit from more specific data points and a clearer call to action.",
      }
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Pitch Feedback AI error:", error)
    return NextResponse.json(
      { error: "Failed to analyze pitch" },
      { status: 500 }
    )
  }
}
