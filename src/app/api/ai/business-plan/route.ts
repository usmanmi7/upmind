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
    const { startupName, industry, stage, goals, description } = body

    if (!startupName) {
      return NextResponse.json(
        { error: "Startup name is required" },
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
            "You are a business plan generator for startups. Generate a structured, professional business plan in JSON format with the following sections: executiveSummary, marketAnalysis, strategy, financialProjections, timeline. Each section should be a detailed string. Be specific and actionable.",
        },
        {
          role: "user",
          content: `Generate a business plan for:
Startup Name: ${startupName}
Industry: ${industry || "Technology"}
Stage: ${stage || "Early Stage"}
Goals: ${goals || "Growth and market penetration"}
Description: ${description || "A startup looking to disrupt its industry"}

Provide a comprehensive business plan with these sections:
1. Executive Summary
2. Market Analysis
3. Strategy
4. Financial Projections
5. Timeline

Format the response as JSON with keys: executiveSummary, marketAnalysis, strategy, financialProjections, timeline`,
        },
      ],
    })

    const responseText =
      completion.choices?.[0]?.message?.content || ""

    // Try to parse JSON, fallback to structured response
    let businessPlan
    try {
      businessPlan = JSON.parse(responseText)
    } catch {
      businessPlan = {
        executiveSummary: responseText.slice(0, 500),
        marketAnalysis: "Market analysis based on your industry and stage.",
        strategy: "Growth strategy tailored to your goals.",
        financialProjections: "Conservative, moderate, and aggressive projections.",
        timeline: "12-month roadmap with key milestones.",
      }
    }

    return NextResponse.json({ businessPlan })
  } catch (error) {
    console.error("Business Plan AI error:", error)
    return NextResponse.json(
      { error: "Failed to generate business plan" },
      { status: 500 }
    )
  }
}
