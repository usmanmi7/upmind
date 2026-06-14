// Centralized plan configuration, single source of truth
// All plan-related data (prices, features, limits, display info) lives here.

import { Zap, Crown, Building2 } from "lucide-react"

export type PlanKey = "FREE" | "GROWTH_PRO" | "ENTERPRISE"

export interface PlanConfig {
  key: PlanKey
  name: string
  price: number // monthly price in USD
  annualPrice: number // annual monthly-equivalent price
  icon: typeof Zap
  popular?: boolean
  description: string
  features: string[]
  limits: {
    consultations: number
    resources: number
    documents: number
    teamMembers: number
  }
  role: string // maps to User.role
  tier: number // ordering: 0=Free, 1=Growth, 2=Enterprise
}

export const PLANS: Record<PlanKey, PlanConfig> = {
  FREE: {
    key: "FREE",
    name: "Free",
    price: 0,
    annualPrice: 0,
    icon: Zap,
    description: "Get started with the essentials for your startup journey.",
    features: [
      "1 startup profile",
      "Basic resources (5/mo)",
      "1 consultation/mo",
      "Community access",
      "5 documents",
      "Email support",
    ],
    limits: {
      consultations: 1,
      resources: 5,
      documents: 5,
      teamMembers: 1,
    },
    role: "FREE_USER",
    tier: 0,
  },
  GROWTH_PRO: {
    key: "GROWTH_PRO",
    name: "Growth Pro",
    price: 49,
    annualPrice: 39,
    popular: true,
    icon: Crown,
    description: "Unlock premium tools to accelerate your startup growth.",
    features: [
      "Unlimited startup profiles",
      "Premium resources (unlimited)",
      "4 consultations/mo",
      "AI insights & analytics",
      "Dedicated consultant chat",
      "Document vault (50 docs)",
      "Custom roadmap builder",
      "Business plan generator",
      "Pitch deck feedback",
    ],
    limits: {
      consultations: 4,
      resources: Infinity,
      documents: 50,
      teamMembers: 5,
    },
    role: "PAID_USER",
    tier: 1,
  },
  ENTERPRISE: {
    key: "ENTERPRISE",
    name: "Enterprise",
    price: 149,
    annualPrice: 119,
    icon: Building2,
    description: "Full power for teams that need everything, unlimited.",
    features: [
      "Everything in Growth Pro",
      "Unlimited consultations",
      "Unlimited documents",
      "Team collaboration (unlimited)",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated account manager",
      "Priority support",
    ],
    limits: {
      consultations: Infinity,
      resources: Infinity,
      documents: Infinity,
      teamMembers: Infinity,
    },
    role: "PAID_USER",
    tier: 2,
  },
}

export const PLAN_LIST = [PLANS.FREE, PLANS.GROWTH_PRO, PLANS.ENTERPRISE]

// Helper: get plan config by key
export function getPlan(planKey: string): PlanConfig {
  return PLANS[planKey as PlanKey] || PLANS.FREE
}

// Helper: is this an upgrade?
export function isUpgrade(from: PlanKey, to: PlanKey): boolean {
  return PLANS[to].tier > PLANS[from].tier
}

// Helper: is this a downgrade?
export function isDowngrade(from: PlanKey, to: PlanKey): boolean {
  return PLANS[to].tier < PLANS[from].tier
}

// Helper: get features gained when upgrading
export function getGainedFeatures(from: PlanKey, to: PlanKey): string[] {
  const toPlan = PLANS[to]
  const fromPlan = PLANS[from]
  // Return features in the new plan that aren't conceptually in the old one
  return toPlan.features.filter(
    (f) => !fromPlan.features.some((existing) => existing.toLowerCase() === f.toLowerCase())
  )
}

// Helper: get features lost when downgrading
export function getLostFeatures(from: PlanKey, to: PlanKey): string[] {
  const fromPlan = PLANS[from]
  const toPlan = PLANS[to]
  // Return features in the current plan that aren't in the target plan
  return fromPlan.features.filter(
    (f) => !toPlan.features.some((existing) => existing.toLowerCase() === f.toLowerCase())
  )
}

// Helper: calculate proration amount
export function calculateProration(from: PlanKey, to: PlanKey, daysRemaining: number, daysInMonth: number): number {
  const currentDailyRate = PLANS[from].price / daysInMonth
  const newDailyRate = PLANS[to].price / daysInMonth
  const proration = (newDailyRate - currentDailyRate) * daysRemaining
  return Math.round(Math.max(0, proration) * 100) / 100
}
