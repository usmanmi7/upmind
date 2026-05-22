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

    // Find the first admin or super admin
    const admin = await db.user.findFirst({
      where: {
        role: { in: ["ADMIN", "SUPER_ADMIN"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    })

    if (!admin) {
      return NextResponse.json({ admin: null })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error("Admin contact GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
