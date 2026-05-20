import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documents = await db.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Documents GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, fileUrl, fileType, size, folder } = body

    if (!name || !fileUrl || !fileType) {
      return NextResponse.json({ error: "Name, fileUrl, and fileType are required" }, { status: 400 })
    }

    const document = await db.document.create({
      data: {
        userId: session.user.id,
        name,
        fileUrl,
        fileType,
        size: size || 0,
        folder: folder || "General",
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Documents POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
