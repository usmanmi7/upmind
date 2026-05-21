import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const consultants = await db.consultant.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { rating: "desc" },
    })

    return NextResponse.json(consultants)
  } catch (error) {
    console.error("Consultants GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
