import { NextResponse } from "next/server"
import { isStripeConfigured } from "@/lib/stripe"

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured. Please add your Stripe keys to environment variables." },
      { status: 503 }
    )
  }

  return NextResponse.json(
    { error: "Stripe package is not installed. Contact support." },
    { status: 503 }
  )
}
