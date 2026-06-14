// Stripe is not configured - placeholder module
// When Stripe is needed, install the package: npm install stripe

// Maps our internal plan keys to Stripe Price IDs
export const STRIPE_PLANS: Record<
  string,
  {
    monthlyPriceId: string
    annualPriceId: string
  }
> = {
  GROWTH_PRO: {
    monthlyPriceId: process.env.STRIPE_GROWTH_PRO_MONTHLY_PRICE_ID || "price_growth_pro_monthly",
    annualPriceId: process.env.STRIPE_GROWTH_PRO_ANNUAL_PRICE_ID || "price_growth_pro_annual",
  },
  ENTERPRISE: {
    monthlyPriceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || "price_enterprise_monthly",
    annualPriceId: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || "price_enterprise_annual",
  },
}

// Reverse lookup: given a Stripe Price ID, find our plan key
export function getPlanByPriceId(priceId: string): string | null {
  for (const [planKey, ids] of Object.entries(STRIPE_PLANS)) {
    if (ids.monthlyPriceId === priceId || ids.annualPriceId === priceId) {
      return planKey
    }
  }
  return null
}

// Check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")
}

// Stub stripe object - will throw if called without Stripe being installed
export const stripe = new Proxy({} as never, {
  get() {
    throw new Error("Stripe package is not installed. Run: npm install stripe")
  }
})
