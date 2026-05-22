import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/admin/migrate - Run database schema migrations
// Visit this URL once after deployment to add new enum values
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const results: string[] = []

    // Add new AchievementType enum values if they don't exist
    const newTypes = [
      "ROADMAP_STARTER",
      "RESOURCE_EXPLORER",
      "SOCIAL_BUTTERFLY",
      "CONSULTATION_PRO",
      "VISIONARY",
      "STARTUP_PROFILE",
    ]

    for (const type of newTypes) {
      try {
        await db.$executeRawUnsafe(`ALTER TYPE "AchievementType" ADD VALUE '${type}'`)
        results.push(`Added "${type}" to AchievementType enum`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes("already exists")) {
          results.push(`"${type}" already exists - skipped`)
        } else {
          results.push(`Failed to add "${type}": ${msg}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration complete",
      results,
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: "Migration failed", details: String(error) }, { status: 500 })
  }
}
