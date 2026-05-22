"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { ArrowRight, Search, MessageCircle, Loader2, HelpCircle } from "lucide-react"
import * as React from "react"

// Fallback hardcoded FAQs used when database is empty
const fallbackFaqs: Record<string, { q: string; a: string }[]> = {
  General: [
    { q: "What is Upmind?", a: "Upmind is a strategic consulting platform designed specifically for startups. We combine expert human consultants with AI-powered insights to help founders validate ideas, build products, raise funding, and scale their businesses." },
    { q: "Who is Upmind for?", a: "Upmind is for early-stage and growth-stage startup founders who want access to premium consulting, resources, and tools without the cost of a full-time advisory team. Whether you're pre-launch or scaling, we have something for you." },
    { q: "How does Upmind differ from traditional consulting?", a: "Traditional consulting is expensive and slow. Upmind provides on-demand access to expert consultants, AI-powered insights, and a library of proven resources — all at a fraction of the cost, available 24/7." },
    { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption, follow SOC 2 best practices, and never share your data with third parties. Your startup information is protected with the highest security standards." },
  ],
  Pricing: [
    { q: "Is there a free plan?", a: "Yes! Our Free plan includes 1 startup profile, basic resources, community access, and 1 consultation per month. It's a great way to experience Upmind before upgrading." },
    { q: "Can I switch plans at any time?", a: "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing, and downgrades take effect at the next billing cycle." },
    { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund." },
  ],
  Consulting: [
    { q: "How do consultations work?", a: "Book a session through your dashboard, choose your consultant, pick a time slot, and meet via video, phone, or in-person. Sessions typically last 60 minutes, and you'll receive a summary with action items afterward." },
    { q: "Who are the consultants?", a: "Our consultants are experienced founders, operators, and domain experts with proven track records. They've collectively helped hundreds of startups succeed across various industries." },
    { q: "How often can I book consultations?", a: "Free plan users get 1 consultation per month. Growth Pro users get 4 priority consultations. Enterprise users enjoy unlimited consultations." },
  ],
  Resources: [
    { q: "What types of resources are available?", a: "We offer blog posts, templates, video tutorials, PDF guides, and interactive tools — all curated by our expert consultants for startup relevance." },
    { q: "What's included in premium resources?", a: "Premium resources include advanced templates (pitch decks, financial models), in-depth guides, exclusive video content, and AI-powered analysis tools. They're available on Growth Pro and Enterprise plans." },
  ],
  Technical: [
    { q: "What browsers are supported?", a: "Upmind works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience." },
    { q: "Is there a mobile app?", a: "Our platform is fully responsive and works great on mobile browsers. A dedicated mobile app is on our roadmap for 2025." },
  ],
}

interface DBFAQ {
  id: string
  question: string
  answer: string
  category: string | null
  order: number
}

export default function FAQPage() {
  const [search, setSearch] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("General")
  const [dbFaqs, setDbFaqs] = React.useState<DBFAQ[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch("/api/faqs")
        if (res.ok) {
          const data = await res.json()
          setDbFaqs(data.faqs || [])
        }
      } catch {
        // Use fallback on error
      } finally {
        setLoading(false)
      }
    }
    fetchFAQs()
  }, [])

  // Use database FAQs if available, otherwise fallback
  const useDBFaqs = dbFaqs.length > 0

  // Build categories from data
  const categories = useDBFaqs
    ? [...new Set(dbFaqs.map((f) => f.category || "General"))]
    : Object.keys(fallbackFaqs)

  // Build FAQ map from database
  const faqMap: Record<string, { q: string; a: string }[]> = useDBFaqs
    ? categories.reduce((acc, cat) => {
        acc[cat] = dbFaqs
          .filter((f) => (f.category || "General") === cat)
          .map((f) => ({ q: f.question, a: f.answer }))
        return acc
      }, {} as Record<string, { q: string; a: string }[]>)
    : fallbackFaqs

  // Ensure active category is valid
  React.useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0])
    }
  }, [categories, activeCategory])

  const filteredFaqs = faqMap[activeCategory]?.filter(
    (faq) => faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="FAQ"
          title="Got questions?"
          highlight="We've got answers"
          description="Find answers to the most common questions about Upmind's platform, pricing, and services."
        />

        {/* Search */}
        <section className="pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className={activeCategory === cat ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A]" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-[#7CFC00]" />
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, i) => (
                  <AccordionItem key={`faq-${activeCategory}-${i}`} value={`faq-${activeCategory}-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {filteredFaqs.length === 0 && !loading && (
              <div className="text-center py-12">
                <HelpCircle className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No questions found matching &ldquo;{search}&rdquo;</p>
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] relative overflow-hidden">
              <div className="relative z-10">
                <MessageCircle className="size-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Still have questions?</h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="bg-white text-[#2D4A2D] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
                    <Link href="/contact">
                      Contact Us
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
