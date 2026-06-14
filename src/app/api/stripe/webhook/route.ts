import { NextResponse } from "next/server"

// Stripe webhook handler - requires stripe package to be installed
export async function POST() {
  return NextResponse.json(
    { error: "Stripe webhooks are not configured. Install the stripe package to enable." },
    { status: 503 }
  )
}
