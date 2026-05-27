import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe, getPlanByPriceId } from "@/lib/stripe"
import { db } from "@/lib/db"
import { PLANS, type PlanKey } from "@/lib/plans"
import Stripe from "stripe"

// Disable body parsing — Stripe needs the raw body to verify the signature
export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET is not set")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planKey = session.metadata?.planKey as PlanKey | undefined

        if (!userId || !planKey) break

        // Get the subscription from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Update or create subscription in DB
        const existing = await db.subscription.findUnique({
          where: { userId },
        })

        const planConfig = PLANS[planKey]
        const now = new Date()
        const periodEnd = new Date(stripeSubscription.current_period_end * 1000)

        if (existing) {
          await db.subscription.update({
            where: { userId },
            data: {
              plan: planKey,
              status: "ACTIVE",
              startDate: now,
              endDate: periodEnd,
              stripeSubscriptionId: stripeSubscription.id,
              stripePriceId: stripeSubscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: periodEnd,
              autoRenew: true,
            },
          })
        } else {
          await db.subscription.create({
            data: {
              userId,
              plan: planKey,
              status: "ACTIVE",
              startDate: now,
              endDate: periodEnd,
              stripeSubscriptionId: stripeSubscription.id,
              stripePriceId: stripeSubscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: periodEnd,
              autoRenew: true,
            },
          })
        }

        // Update user role
        const newRole = planConfig.role as "FREE_USER" | "PAID_USER"
        await db.user.update({
          where: { id: userId },
          data: { role: newRole },
        })

        // Create payment record
        const amount = session.amount_total ? session.amount_total / 100 : planConfig.price
        await db.payment.create({
          data: {
            subscription: { connect: { userId } },
            amount,
            currency: session.currency?.toUpperCase() || "USD",
            status: "COMPLETED",
            method: "Card (Stripe)",
          },
        })

        // Create notification
        await db.notification.create({
          data: {
            userId,
            title: "Plan Upgraded!",
            message: `You've been upgraded to ${planConfig.name}. Enjoy your new features! Your 14-day free trial has started.`,
            type: "PAYMENT",
            link: "/dashboard/subscription",
          },
        })

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        // Only handle recurring invoices (not the first one, which is handled by checkout.session.completed)
        if (invoice.billing_reason === "subscription_cycle") {
          const stripeSubscriptionId = invoice.subscription as string
          const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

          const subscription = await db.subscription.findUnique({
            where: { stripeSubscriptionId },
          })

          if (!subscription) break

          const periodEnd = new Date(stripeSubscription.current_period_end * 1000)

          // Update subscription period end
          await db.subscription.update({
            where: { stripeSubscriptionId },
            data: {
              status: "ACTIVE",
              endDate: periodEnd,
              stripeCurrentPeriodEnd: periodEnd,
              stripePriceId: stripeSubscription.items.data[0]?.price.id,
            },
          })

          // Create payment record for renewal
          await db.payment.create({
            data: {
              subscription: { connect: { id: subscription.id } },
              amount: invoice.amount_paid / 100,
              currency: invoice.currency.toUpperCase(),
              status: "COMPLETED",
              method: "Card (Stripe)",
            },
          })

          // Notify user
          await db.notification.create({
            data: {
              userId: subscription.userId,
              title: "Payment Successful",
              message: `Your subscription has been renewed. Next billing date: ${periodEnd.toLocaleDateString()}`,
              type: "PAYMENT",
              link: "/dashboard/subscription",
            },
          })
        }

        break
      }

      case "customer.subscription.updated": {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const subscription = await db.subscription.findUnique({
          where: { stripeSubscriptionId: stripeSubscription.id },
        })

        if (!subscription) break

        const periodEnd = new Date(stripeSubscription.current_period_end * 1000)

        // Check if the plan changed (price ID changed)
        const newPriceId = stripeSubscription.items.data[0]?.price.id
        const newPlanKey = newPriceId ? getPlanByPriceId(newPriceId) : null

        const updateData: Record<string, unknown> = {
          endDate: periodEnd,
          stripeCurrentPeriodEnd: periodEnd,
          stripePriceId: newPriceId,
          autoRenew: !stripeSubscription.cancel_at_period_end,
        }

        // If plan changed, update plan and role
        if (newPlanKey && newPlanKey !== subscription.plan) {
          const planConfig = PLANS[newPlanKey as PlanKey]
          updateData.plan = newPlanKey

          const newRole = planConfig.role as "FREE_USER" | "PAID_USER"
          await db.user.update({
            where: { id: subscription.userId },
            data: { role: newRole },
          })

          await db.notification.create({
            data: {
              userId: subscription.userId,
              title: "Plan Changed",
              message: `Your plan has been changed to ${planConfig.name}.`,
              type: "PAYMENT",
              link: "/dashboard/subscription",
            },
          })
        }

        await db.subscription.update({
          where: { stripeSubscriptionId: stripeSubscription.id },
          data: updateData,
        })

        break
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const subscription = await db.subscription.findUnique({
          where: { stripeSubscriptionId: stripeSubscription.id },
        })

        if (!subscription) break

        // Downgrade to Free
        await db.subscription.update({
          where: { stripeSubscriptionId: stripeSubscription.id },
          data: {
            plan: "FREE",
            status: "CANCELLED",
            autoRenew: false,
          },
        })

        // Downgrade user role
        await db.user.update({
          where: { id: subscription.userId },
          data: { role: "FREE_USER" },
        })

        // Create notification
        await db.notification.create({
          data: {
            userId: subscription.userId,
            title: "Subscription Cancelled",
            message: "Your subscription has been cancelled. You've been moved to the Free plan.",
            type: "PAYMENT",
            link: "/dashboard/subscription",
          },
        })

        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const stripeSubscriptionId = invoice.subscription as string

        const subscription = await db.subscription.findUnique({
          where: { stripeSubscriptionId },
        })

        if (!subscription) break

        // Mark as past due
        await db.subscription.update({
          where: { stripeSubscriptionId },
          data: { status: "PAST_DUE" },
        })

        // Create payment record
        await db.payment.create({
          data: {
            subscription: { connect: { id: subscription.id } },
            amount: invoice.amount_due / 100,
            currency: invoice.currency.toUpperCase(),
            status: "FAILED",
            method: "Card (Stripe)",
          },
        })

        // Notify user
        await db.notification.create({
          data: {
            userId: subscription.userId,
            title: "Payment Failed",
            message: "We couldn't process your payment. Please update your payment method to avoid service interruption.",
            type: "PAYMENT",
            link: "/dashboard/subscription",
          },
        })

        break
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`)
    }
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
