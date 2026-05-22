import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get("type") || "all"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const result: Record<string, unknown> = {}

    if (contentType === "all" || contentType === "faqs") {
      const [faqs, faqTotal] = await Promise.all([
        db.fAQ.findMany({
          orderBy: { order: "asc" },
        }),
        db.fAQ.count(),
      ])
      result.faqs = faqs
      result.faqTotal = faqTotal
    }

    if (contentType === "all" || contentType === "testimonials") {
      const [testimonials, testimonialTotal] = await Promise.all([
        db.testimonial.findMany({
          orderBy: { order: "asc" },
        }),
        db.testimonial.count(),
      ])
      result.testimonials = testimonials
      result.testimonialTotal = testimonialTotal
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Admin CMS GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { contentType } = body

    if (contentType === "faq") {
      const { question, answer, category, order, isPublished } = body
      if (!question || !answer) {
        return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
      }
      const faq = await db.fAQ.create({ data: { question, answer, category, order: order || 0, isPublished: isPublished !== undefined ? isPublished : true } })
      return NextResponse.json({ faq }, { status: 201 })
    }

    if (contentType === "testimonial") {
      const { name, role, company, content, image, rating, isPublished, order } = body
      if (!name || !content) {
        return NextResponse.json({ error: "Name and content are required" }, { status: 400 })
      }
      const testimonial = await db.testimonial.create({ data: { name, role, company, content, image, rating, isPublished: isPublished !== undefined ? isPublished : true, order: order || 0 } })
      return NextResponse.json({ testimonial }, { status: 201 })
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
  } catch (error) {
    console.error("Admin CMS POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { contentType } = body

    if (contentType === "faq") {
      const { id, question, answer, category, order, isPublished } = body
      if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })
      const faq = await db.fAQ.update({ where: { id }, data: { question, answer, category, order, isPublished } })
      return NextResponse.json({ faq })
    }

    if (contentType === "testimonial") {
      const { id, name, role, company, content, image, rating, isPublished, order } = body
      if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })
      const testimonial = await db.testimonial.update({ where: { id }, data: { name, role, company, content, image, rating, isPublished, order } })
      return NextResponse.json({ testimonial })
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
  } catch (error) {
    console.error("Admin CMS PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get("type")
    const id = searchParams.get("id")

    if (!contentType || !id) {
      return NextResponse.json({ error: "Content type and ID are required" }, { status: 400 })
    }

    if (contentType === "faq") {
      await db.fAQ.delete({ where: { id } })
    } else if (contentType === "testimonial") {
      await db.testimonial.delete({ where: { id } })
    } else {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin CMS DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
