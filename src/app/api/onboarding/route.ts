import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      phone,
      country,
      startupName,
      industry,
      teamSize,
      businessStage,
      website,
      vision,
      goals,
      plan,
    } = body

    // Update user profile
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name || session.user.name,
        phone,
        country,
      },
    })

    // Create startup if name provided
    if (startupName) {
      const existingStartup = await db.startup.findUnique({
        where: { userId: session.user.id },
      })

      if (!existingStartup) {
        await db.startup.create({
          data: {
            userId: session.user.id,
            name: startupName,
            industry,
            teamSize,
            businessStage,
            website,
            vision,
            goals: goals ? JSON.stringify(goals) : null,
          },
        })
      }
    }

    // Update subscription plan if Growth Pro selected
    if (plan === "GROWTH_PRO") {
      await db.subscription.upsert({
        where: { userId: session.user.id },
        update: {
          plan: "GROWTH_PRO",
          status: "ACTIVE",
          startDate: new Date(),
        },
        create: {
          userId: session.user.id,
          plan: "GROWTH_PRO",
          status: "ACTIVE",
          startDate: new Date(),
        },
      })

      await db.user.update({
        where: { id: session.user.id },
        data: { role: "PAID_USER" },
      })
    }

    // Create welcome notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: "Welcome to Upmind! 🎉",
        message: "Your account is set up and ready to go. Explore your dashboard to get started.",
        type: "SYSTEM",
      },
    })

    return NextResponse.json(
      { message: "Onboarding completed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
