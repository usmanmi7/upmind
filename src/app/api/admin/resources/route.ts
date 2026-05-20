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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const category = searchParams.get("category") || ""
    const isPremium = searchParams.get("isPremium")

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }
    if (type) where.type = type
    if (category) where.category = category
    if (isPremium !== null && isPremium !== "") {
      where.isPremium = isPremium === "true"
    }

    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where,
        include: { _count: { select: { savedBy: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.resource.count({ where }),
    ])

    return NextResponse.json({
      resources,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Admin resources GET error:", error)
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
    const { title, description, type, category, tags, fileUrl, thumbnailUrl, isPremium } = body

    if (!title || !type) {
      return NextResponse.json({ error: "Title and type are required" }, { status: 400 })
    }

    const resource = await db.resource.create({
      data: { title, description, type, category, tags, fileUrl, thumbnailUrl, isPremium: isPremium || false },
    })

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    console.error("Admin resources POST error:", error)
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
    const { resourceId, title, description, type, category, tags, fileUrl, thumbnailUrl, isPremium, downloadCount } = body

    if (!resourceId) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = tags
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl
    if (isPremium !== undefined) updateData.isPremium = isPremium
    if (downloadCount !== undefined) updateData.downloadCount = downloadCount

    const resource = await db.resource.update({
      where: { id: resourceId },
      data: updateData,
    })

    return NextResponse.json({ resource })
  } catch (error) {
    console.error("Admin resources PUT error:", error)
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
    const resourceId = searchParams.get("id")

    if (!resourceId) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 })
    }

    await db.savedResource.deleteMany({ where: { resourceId } })
    await db.resource.delete({ where: { id: resourceId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin resources DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
