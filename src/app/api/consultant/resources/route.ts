import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST /api/consultant/resources - Consultant creates a resource
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = session.user.role
    if (role !== "CONSULTANT" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only consultants can add resources" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, type, category, tags, content, fileUrl, thumbnailUrl, isPremium } = body

    if (!title?.trim() || !type) {
      return NextResponse.json({ error: "Title and type are required" }, { status: 400 })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + "-" + Date.now().toString(36)

    const resource = await db.resource.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        content: content || null,
        type,
        category: category || null,
        tags: tags || null,
        fileUrl: fileUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        isPremium: isPremium || false,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    console.error("Consultant resource POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
