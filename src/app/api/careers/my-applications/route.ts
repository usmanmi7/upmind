import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 }
      )
    }

    const applications = await db.jobApplication.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        jobTitle: true,
        department: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("My applications GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
