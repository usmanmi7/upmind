import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)

    const resource = await db.resource.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, image: true, bio: true },
        },
      },
    })

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Determine access level
    let accessLevel: "full" | "preview" | "none" = "none"
    let subscription = null

    if (!session?.user?.id) {
      // Not logged in - can only see preview (title, description, first paragraph)
      accessLevel = "none"
    } else {
      // Logged in - check subscription
      const sub = await db.subscription.findUnique({
        where: { userId: session.user.id },
        select: { plan: true, status: true },
      })
      subscription = sub

      if (resource.isPremium) {
        // Premium resource - need paid plan
        const hasPaidPlan =
          sub &&
          sub.status === "ACTIVE" &&
          (sub.plan === "GROWTH_PRO" || sub.plan === "ENTERPRISE")

        // Admin and consultants also get full access
        const isAdmin =
          (session.user as { role: string }).role === "ADMIN" ||
          (session.user as { role: string }).role === "SUPER_ADMIN"

        accessLevel = hasPaidPlan || isAdmin ? "full" : "preview"
      } else {
        // Free resource - logged in users get full access
        accessLevel = "full"
      }
    }

    // For non-full access, strip content to only show a preview
    let responseData: Record<string, unknown> = {
      ...resource,
      accessLevel,
    }

    if (accessLevel !== "full" && resource.content) {
      // Show only first ~200 chars as preview
      const previewContent = resource.content.substring(0, 200) + "..."
      responseData = {
        ...resource,
        content: previewContent,
        accessLevel,
      }
    }

    // Increment download count (view count)
    await db.resource.update({
      where: { id: resource.id },
      data: { downloadCount: { increment: 1 } },
    })

    // Track resource view for logged-in users
    if (session?.user?.id) {
      db.resourceView.create({
        data: {
          userId: session.user.id,
          resourceId: resource.id,
        },
      }).catch(() => {}) // Non-blocking
    }

    return NextResponse.json({
      resource: responseData,
      user: session?.user
        ? {
            id: session.user.id,
            role: (session.user as { role: string }).role,
            subscription: subscription
              ? { plan: subscription.plan, status: subscription.status }
              : null,
          }
        : null,
    })
  } catch (error) {
    console.error("Resource slug GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
