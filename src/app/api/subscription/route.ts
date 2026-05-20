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

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
      include: { payments: { orderBy: { createdAt: "desc" } } },
    })

    if (!subscription) {
      const newSub = await db.subscription.create({
        data: { userId: session.user.id },
        include: { payments: true },
      })
      return NextResponse.json(newSub)
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Subscription GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { plan, autoRenew, status } = body

    const subscription = await db.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        ...(plan !== undefined && { plan }),
        ...(autoRenew !== undefined && { autoRenew }),
        ...(status !== undefined && { status }),
      },
      create: {
        userId: session.user.id,
        plan: plan || "FREE",
        autoRenew: autoRenew ?? true,
      },
      include: { payments: true },
    })

    if (plan) {
      const roleMap: Record<string, string> = {
        FREE: "FREE_USER",
        GROWTH_PRO: "PAID_USER",
        ENTERPRISE: "PAID_USER",
      }
      await db.user.update({
        where: { id: session.user.id },
        data: { role: (roleMap[plan] || "FREE_USER") as "FREE_USER" | "PAID_USER" | "CONSULTANT" | "ADMIN" | "SUPER_ADMIN" },
      })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Subscription PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
