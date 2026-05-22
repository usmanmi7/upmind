import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { PLANS, type PlanKey, isUpgrade, isDowngrade, calculateProration } from "@/lib/plans"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { targetPlan, confirmedDowngrade } = body as {
      targetPlan: string
      confirmedDowngrade?: boolean
    }

    // Validate target plan
    const validPlans: PlanKey[] = ["FREE", "GROWTH_PRO", "ENTERPRISE"]
    if (!validPlans.includes(targetPlan as PlanKey)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    const target = targetPlan as PlanKey

    // Get current subscription
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    const currentPlan: PlanKey = (subscription?.plan as PlanKey) || "FREE"

    // Can't change to the same plan
    if (currentPlan === target) {
      return NextResponse.json({ error: "You are already on this plan" }, { status: 400 })
    }

    // If downgrading, require explicit confirmation
    if (isDowngrade(currentPlan, target) && !confirmedDowngrade) {
      return NextResponse.json(
        { error: "Downgrade confirmation required", needsConfirmation: true },
        { status: 400 }
      )
    }

    // Calculate proration for upgrades
    let prorationAmount = 0
    if (isUpgrade(currentPlan, target) && PLANS[currentPlan].price > 0) {
      const now = new Date()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const daysRemaining = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      prorationAmount = calculateProration(currentPlan, target, daysRemaining, daysInMonth)
    }

    const targetPlanConfig = PLANS[target]
    const now = new Date()
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

    // Update or create subscription
    let updatedSubscription
    if (subscription) {
      updatedSubscription = await db.subscription.update({
        where: { userId: session.user.id },
        data: {
          plan: target,
          status: "ACTIVE",
          startDate: now,
          endDate: isUpgrade(currentPlan, target) ? endDate : subscription.endDate,
          autoRenew: target !== "FREE",
        },
      })
    } else {
      updatedSubscription = await db.subscription.create({
        data: {
          userId: session.user.id,
          plan: target,
          status: "ACTIVE",
          startDate: now,
          endDate: target !== "FREE" ? endDate : null,
          autoRenew: target !== "FREE",
        },
      })
    }

    // Sync user role
    const newRole = targetPlanConfig.role as "FREE_USER" | "PAID_USER"
    await db.user.update({
      where: { id: session.user.id },
      data: { role: newRole },
    })

    // Create payment record for upgrades
    if (isUpgrade(currentPlan, target) && targetPlanConfig.price > 0) {
      const chargeAmount = prorationAmount > 0 ? prorationAmount : targetPlanConfig.price
      await db.payment.create({
        data: {
          subscriptionId: updatedSubscription.id,
          amount: chargeAmount,
          currency: "USD",
          status: "COMPLETED",
          method: "Card",
        },
      })
    }

    // Create notification
    const action = isUpgrade(currentPlan, target) ? "upgraded" : "downgraded"
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: isUpgrade(currentPlan, target) ? "Plan Upgraded!" : "Plan Changed",
        message: isUpgrade(currentPlan, target)
          ? `You've been upgraded to ${targetPlanConfig.name}. Enjoy your new features!`
          : `Your plan has been changed to ${targetPlanConfig.name}. Changes take effect immediately.`,
        type: "PAYMENT",
        link: "/dashboard/subscription",
      },
    })

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        plan: updatedSubscription.plan,
        status: updatedSubscription.status,
        startDate: updatedSubscription.startDate,
        endDate: updatedSubscription.endDate,
        autoRenew: updatedSubscription.autoRenew,
      },
      action,
      fromPlan: currentPlan,
      toPlan: target,
      prorationAmount,
    })
  } catch (error) {
    console.error("Subscription change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
