import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        order: true,
      },
    })

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error("FAQs GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
