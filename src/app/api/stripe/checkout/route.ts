import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe, STRIPE_PLANS, isStripeConfigured } from "@/lib/stripe"
import { PLANS, type PlanKey } from "@/lib/plans"

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please add your Stripe keys to environment variables." },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { planKey, billingPeriod = "monthly" } = body as {
      planKey: string
      billingPeriod?: "monthly" | "annual"
    }

    // Validate plan
    const validPlans: PlanKey[] = ["GROWTH_PRO", "ENTERPRISE"]
    if (!validPlans.includes(planKey as PlanKey)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    const planConfig = PLANS[planKey as PlanKey]
    if (!planConfig) {
      return NextResponse.json({ error: "Plan not found" }, { status: 400 })
    }

    // Get or create Stripe customer
    let stripeCustomerId: string
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (subscription?.stripeCustomerId) {
      stripeCustomerId = subscription.stripeCustomerId
    } else {
      // Create a Stripe customer
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true },
      })

      const customer = await stripe.customers.create({
        email: user?.email,
        name: user?.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      })

      stripeCustomerId = customer.id

      // Save the customer ID
      if (subscription) {
        await db.subscription.update({
          where: { userId: session.user.id },
          data: { stripeCustomerId },
        })
      } else {
        await db.subscription.create({
          data: {
            userId: session.user.id,
            stripeCustomerId,
          },
        })
      }
    }

    // Get the price ID for the selected plan and billing period
    const priceId =
      billingPeriod === "annual"
        ? STRIPE_PLANS[planKey].annualPriceId
        : STRIPE_PLANS[planKey].monthlyPriceId

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/dashboard/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/dashboard/subscription?canceled=true`,
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          userId: session.user.id,
          planKey,
        },
      },
      metadata: {
        userId: session.user.id,
        planKey,
        billingPeriod,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
