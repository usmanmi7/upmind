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

    // Get user's subscription
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    const plan = subscription?.plan || "FREE"

    // Get real usage metrics
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Consultations this month (appointments in current month)
    const consultationsThisMonth = await db.appointment.count({
      where: {
        userId: session.user.id,
        date: { gte: startOfMonth },
        status: { in: ["SCHEDULED", "COMPLETED"] },
      },
    })

    // Resources downloaded (saved resources count)
    const resourcesDownloaded = await db.savedResource.count({
      where: { userId: session.user.id },
    })

    // Documents count
    const documentsCount = await db.document.count({
      where: { userId: session.user.id },
    })

    // Team members (for now, just 1 since it's a single user startup)
    const startup = await db.startup.findUnique({
      where: { userId: session.user.id },
    })

    // Payment history from actual payments
    const payments = await db.payment.findMany({
      where: {
        subscription: { userId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    // Plan limits
    const planLimits: Record<string, { consultations: number; resources: number; documents: number; teamMembers: number }> = {
      FREE: { consultations: 1, resources: 5, documents: 5, teamMembers: 1 },
      GROWTH_PRO: { consultations: 4, resources: Infinity, documents: 50, teamMembers: 5 },
      ENTERPRISE: { consultations: Infinity, resources: Infinity, documents: Infinity, teamMembers: Infinity },
    }

    const limits = planLimits[plan] || planLimits.FREE

    return NextResponse.json({
      subscription: subscription ? {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        autoRenew: subscription.autoRenew,
      } : null,
      usage: {
        consultations: { used: consultationsThisMonth, limit: limits.consultations },
        resources: { used: resourcesDownloaded, limit: limits.resources },
        documents: { used: documentsCount, limit: limits.documents },
        teamMembers: { used: startup ? 1 : 0, limit: limits.teamMembers },
      },
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        method: p.method,
        date: p.createdAt,
      })),
    })
  } catch (error) {
    console.error("Subscription GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Toggle auto-renew
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    const updated = await db.subscription.update({
      where: { userId: session.user.id },
      data: { autoRenew: !subscription.autoRenew },
    })

    return NextResponse.json({ subscription: updated })
  } catch (error) {
    console.error("Subscription PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
