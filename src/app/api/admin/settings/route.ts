import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// In-memory settings store (in production, this would be in the database)
let platformSettings = {
  siteName: "Enginest",
  siteDescription: "Engineering innovation platform for builders who want their work to matter",
  contactEmail: "hello@enginest.io",
  contactPhone: "+1 (555) 000-0000",
  socialLinks: {
    twitter: "https://twitter.com/enginest",
    linkedin: "https://linkedin.com/company/enginest",
    github: "https://github.com/enginest",
  },
  emailTemplates: {
    welcome: "Welcome to Enginest! We're excited to have you on board. Start by exploring the Solve Them database and running the Innovation Engine.",
    appointmentReminder: "Hi {name}, this is a reminder for your appointment with {consultant} tomorrow at {time}.",
    paymentConfirmation: "Hi {name}, your payment of ${amount} has been successfully processed. Thank you for your subscription!",
    planExpiryNotice: "Hi {name}, your {plan} subscription will expire on {date}. Renew now to continue enjoying premium features.",
  },
  pricing: {
    free: { name: "Free", price: 0, features: ["1 startup profile", "Basic resources", "Community access", "1 consultation/month"] },
    growthPro: { name: "Growth Pro", price: 49, features: ["5 startup profiles", "Premium resources", "Priority support", "Unlimited consultations", "Custom roadmap", "Analytics dashboard"] },
    enterprise: { name: "Enterprise", price: 149, features: ["Unlimited startups", "All premium resources", "Dedicated consultant", "Custom integrations", "API access", "White-label options"] },
  },
  notifications: {
    newUserSignup: true,
    newAppointment: true,
    paymentReceived: true,
    supportTicket: true,
  },
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ settings: platformSettings })
  } catch (error) {
    console.error("Admin settings GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { settings } = body

    if (!settings) {
      return NextResponse.json({ error: "Settings object is required" }, { status: 400 })
    }

    // Merge settings
    platformSettings = {
      ...platformSettings,
      ...settings,
      socialLinks: { ...platformSettings.socialLinks, ...(settings.socialLinks || {}) },
      emailTemplates: { ...platformSettings.emailTemplates, ...(settings.emailTemplates || {}) },
      pricing: { ...platformSettings.pricing, ...(settings.pricing || {}) },
      notifications: { ...platformSettings.notifications, ...(settings.notifications || {}) },
    }

    return NextResponse.json({ settings: platformSettings })
  } catch (error) {
    console.error("Admin settings PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
