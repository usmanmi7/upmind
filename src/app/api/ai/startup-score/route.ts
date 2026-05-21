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
    const { startupName, industry, stage, teamSize, revenue, users, funding } = body

    const ZAI = (await import("z-ai-web-dev-sdk")).default
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a startup evaluation AI. Evaluate the startup across 5 dimensions and return a JSON object with: overallScore (0-100), dimensions (object with: market {score, recommendation}, team {score, recommendation}, product {score, recommendation}, traction {score, recommendation}, financials {score, recommendation}), summary (string). Be realistic and constructive.",
        },
        {
          role: "user",
          content: `Evaluate this startup:
Name: ${startupName || "My Startup"}
Industry: ${industry || "Technology"}
Stage: ${stage || "Early Stage"}
Team Size: ${teamSize || "1-5"}
Revenue: ${revenue || "Pre-revenue"}
Users: ${users || "0-100"}
Funding: ${funding || "Bootstrapped"}

Provide scores and recommendations for each dimension.`,
        },
      ],
    })

    const responseText =
      completion.choices?.[0]?.message?.content || ""

    let evaluation
    try {
      evaluation = JSON.parse(responseText)
    } catch {
      evaluation = {
        overallScore: 52,
        dimensions: {
          market: {
            score: 65,
            recommendation:
              "Your market has potential. Focus on defining a specific niche and validating demand through customer interviews.",
          },
          team: {
            score: 45,
            recommendation:
              "Consider adding co-founders with complementary skills. Investors look for well-rounded teams.",
          },
          product: {
            score: 55,
            recommendation:
              "Focus on building an MVP that solves one core problem exceptionally well before expanding.",
          },
          traction: {
            score: 35,
            recommendation:
              "Prioritize getting early users and gathering feedback. Even small traction metrics can be powerful.",
          },
          financials: {
            score: 40,
            recommendation:
              "Develop a clear financial model and path to revenue. Consider your unit economics early.",
          },
        },
        summary:
          "Your startup shows promise in market opportunity but needs work on traction and financial planning. Focus on validating your core assumptions and building early momentum.",
      }
    }

    return NextResponse.json({ evaluation })
  } catch (error) {
    console.error("Startup Score AI error:", error)
    return NextResponse.json(
      { error: "Failed to evaluate startup" },
      { status: 500 }
    )
  }
}
