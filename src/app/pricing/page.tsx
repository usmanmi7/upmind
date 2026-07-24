"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, X } from "lucide-react"
import * as React from "react"

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Start exploring problems",
    features: [
      "Browse all 30+ curated problems",
      "Public overview & metrics",
      "1 Innovation Engine run",
      "AI Assistant (limited)",
      "Community access",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Builder Pro",
    price: { monthly: 49, annual: 39 },
    description: "For engineers ready to build",
    features: [
      "Everything in Free",
      "Unlimited Innovation Engine runs",
      "Solutions, roadmaps & team templates",
      "Full resources library",
      "Skill-gap analysis",
      "Project tracking",
      "Priority AI Assistant",
      "Chat support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Team",
    price: { monthly: 149, annual: 119 },
    description: "For engineering teams & labs",
    features: [
      "Everything in Builder Pro",
      "Up to 10 team members",
      "Shared problem shortlists",
      "Team skill mapping",
      "Custom problem requests",
      "API access",
      "Priority support",
      "Quarterly build reviews",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const comparisonFeatures = [
  { name: "Curated Problems", free: "Browse all", pro: "Browse all", enterprise: "Browse all + custom" },
  { name: "Innovation Engine runs/mo", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Solutions & Roadmaps", free: "Public preview", pro: "Full access", enterprise: "Full + custom" },
  { name: "Team Templates", free: false, pro: true, enterprise: true },
  { name: "Resources Library", free: "Free guides", pro: "Full library", enterprise: "Full + early access" },
  { name: "Skill-Gap Analysis", free: false, pro: true, enterprise: true },
  { name: "Project Tracking", free: false, pro: true, enterprise: true },
  { name: "Priority AI Assistant", free: false, pro: true, enterprise: true },
  { name: "Team Collaboration", free: false, pro: false, enterprise: "Up to 10" },
  { name: "API Access", free: false, pro: false, enterprise: true },
  { name: "Custom Problem Requests", free: false, pro: false, enterprise: true },
  { name: "SLA Guarantee", free: false, pro: false, enterprise: "99.9%" },
  { name: "Support", free: "Email", pro: "Chat", enterprise: "Priority Phone" },
]

const faqs = [
  { q: "Can I switch plans at any time?", a: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the next billing cycle." },
  { q: "Is there a free trial for paid plans?", a: "Yes, both Builder Pro and Team plans come with a 14-day free trial. No credit card required to start." },
  { q: "What happens when my trial ends?", a: "When your trial ends, you'll be prompted to choose a plan. If you choose not to subscribe, your account will automatically switch to the Free plan — you keep browsing problems and running the Innovation Engine once per month." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time from your dashboard. You'll continue to have access until the end of your billing period." },
  { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund." },
  { q: "Is there a discount for students, researchers, or nonprofits?", a: "Yes! We offer special pricing for students, academic research labs, and nonprofit engineering teams. Contact our team for details." },
]

export default function PricingPage() {
  const [annual, setAnnual] = React.useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Pricing"
          title="Plans for every"
          highlight="builder"
          description="From exploring problems to leading a team — pick the plan that matches where you are in your build journey. No hidden fees."
        />

        {/* Billing Toggle */}
        <section className="pb-8">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
              <Switch checked={annual} onCheckedChange={setAnnual} />
              <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
                Annual
                <span className="ml-1.5 text-xs text-[#3B82F6] dark:text-[#93C5FD] font-semibold">Save 20%</span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative p-6 rounded-2xl border shadow-sm ${
                    plan.popular
                      ? "border-[#3B82F6] shadow-lg shadow-[#3B82F6]/10 md:scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-white text-xs font-bold px-4 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-heading font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold">
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-[#3B82F6] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.name === "Team" ? "/contact" : "/auth/signup"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
              Feature <span className="font-serif-accent-italic gradient-text">comparison</span>
            </h2>
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Free</th>
                      <th className="text-center p-4 font-semibold text-[#3B82F6]">Builder Pro</th>
                      <th className="text-center p-4 font-semibold">Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, i) => (
                      <tr key={feature.name} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                        <td className="p-4 font-medium">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.free === "boolean" ? (
                            feature.free ? <CheckCircle2 className="size-4 text-[#3B82F6] mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            feature.free
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.pro === "boolean" ? (
                            feature.pro ? <CheckCircle2 className="size-4 text-[#3B82F6] mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            feature.pro
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.enterprise === "boolean" ? (
                            feature.enterprise ? <CheckCircle2 className="size-4 text-[#3B82F6] mx-auto" /> : <X className="size-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            feature.enterprise
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-12">
              Pricing <span className="font-serif-accent-italic gradient-text">FAQ</span>
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                  Start your free{' '}
                  <span className="font-serif-accent-italic">build</span>{' '}
                  today
                </h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  No credit card required. 14 days free on all paid plans. Browse 30+ problems and run the Innovation Engine.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-white text-[#1E3A8A] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
                    <Link href="/auth/signup">
                      Get Started Free
                      <ArrowRight className="size-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
