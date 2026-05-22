import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/admin/migrate - Run database schema migrations
// Visit this URL once after deployment to update the database
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

    // Create ResourceView table if it doesn't exist
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ResourceView" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "resourceId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ResourceView_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "ResourceView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "ResourceView_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `)
      results.push('Created "ResourceView" table')

      // Create indexes if they don't exist
      try {
        await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ResourceView_userId_idx" ON "ResourceView"("userId")`)
        await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ResourceView_resourceId_idx" ON "ResourceView"("resourceId")`)
        results.push('Created indexes on ResourceView')
      } catch (idxErr: unknown) {
        const idxMsg = idxErr instanceof Error ? idxErr.message : String(idxErr)
        results.push(`Index creation note: ${idxMsg}`)
      }
    } catch (tableErr: unknown) {
      const tableMsg = tableErr instanceof Error ? tableErr.message : String(tableErr)
      if (tableMsg.includes("already exists")) {
        results.push('"ResourceView" table already exists - skipped')
      } else {
        results.push(`Failed to create ResourceView table: ${tableMsg}`)
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
