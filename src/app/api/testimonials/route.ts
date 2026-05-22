import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        company: true,
        content: true,
        image: true,
        rating: true,
        order: true,
      },
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("Testimonials GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
