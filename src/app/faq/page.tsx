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
    { q: "What is Upmind?", a: "Upmind is an engineering innovation platform. We curate real-world problems from WHO, UN, IEA, IPCC, and other authoritative sources, then use AI to match them to your engineering skills — so you spend your time on problems you can actually solve." },
    { q: "Who is Upmind for?", a: "Upmind is for engineers, researchers, builders, and innovators who want their work to matter. Whether you're a student looking for a meaningful project, a senior engineer considering a startup, or a research lab hunting for high-impact problems — Upmind helps you find what to build." },
    { q: "How does Upmind differ from startup consulting?", a: "Traditional consulting starts from your idea and tries to find a market. Upmind flips the workflow — we start from real, documented problems and match them to engineering skills. No more clever tech in search of a problem." },
    { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption, follow SOC 2 best practices, and never share your data with third parties. Your skill profile and project notes are protected with the highest security standards." },
  ],
  Pricing: [
    { q: "Is there a free plan?", a: "Yes! Our Free plan includes browsing all 30+ curated problems, public metrics, 1 Innovation Engine run per month, and community access. It's a great way to experience Upmind before upgrading." },
    { q: "Can I switch plans at any time?", a: "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing, and downgrades take effect at the next billing cycle." },
    { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund." },
    { q: "Do you offer discounts for students, researchers, or nonprofits?", a: "Yes! We offer special pricing for students, academic research labs, and nonprofit engineering teams. Contact our team for details." },
  ],
  "Solve Them": [
    { q: "Where do the problems come from?", a: "Problems are curated from authoritative multilateral sources — WHO, UN, UNICEF, World Bank, IEA, IPCC, FAO, UNESCO, UNEP, NIST, ESA, and WEF. Each problem includes a source citation and is validated for engineering leverage." },
    { q: "How are problems scored?", a: "Each problem has severity (0-100), impact score, innovation score, market need, global demand, and future importance — all derived from source data and editorial review. Difficulty is rated Easy / Medium / Hard / Frontier based on technical complexity." },
    { q: "How often are new problems added?", a: "We add new problems monthly. The curated database grows over time as we cover more categories and dive deeper into specific domains." },
    { q: "Can I suggest a problem?", a: "Yes — Team plan subscribers can request custom problems. We also accept community suggestions through our contact form." },
  ],
  "Innovation Engine": [
    { q: "How does the AI matching work?", a: "The Innovation Engine scores each problem against your profile using a weighted algorithm: skill coverage (60%), interest overlap (30%), plus bonuses for difficulty fit, time commitment, and team size. Each match includes reason highlights explaining why." },
    { q: "What should I enter as my skills?", a: "Enter 5-8 specific engineering skills — e.g., 'Python, Machine Learning, Distributed Systems, React, Embedded C'. The more specific, the better the matches. Avoid vague terms like 'programming'." },
    { q: "How many matches do I get?", a: "The Engine returns your top 12 matches, sorted by match score. Matches below 50 are filtered out — they're likely not the right problems for your current skill set." },
    { q: "Can I save my matches?", a: "Yes — Builder Pro and Team plans include project tracking. Save matched problems, add notes, and track your build progress over time." },
  ],
  Resources: [
    { q: "What types of resources are available?", a: "Field guides, templates, and frameworks written for engineers — problem-discovery guides, build-vs-research decision frameworks, team templates, 12-month roadmap templates, ethics frameworks, funding field guides, and reading lists." },
    { q: "Are resources free?", a: "Most resources are free to read. Some premium templates and deep-dive guides require a Builder Pro or Team plan. Sign-in is required to read full articles." },
  ],
  Technical: [
    { q: "What browsers are supported?", a: "Upmind works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience." },
    { q: "Is there a mobile app?", a: "Our platform is fully responsive and works great on mobile browsers. A dedicated mobile app is on our roadmap." },
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
          highlight="we've got answers"
          description="Find answers to the most common questions about Upmind, the Solve Them database, the Innovation Engine, and our pricing."
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
                  className={activeCategory === cat ? "bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D]" : ""}
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
                <Loader2 className="size-6 animate-spin text-[#3B82F6]" />
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
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] relative overflow-hidden">
              <div className="relative z-10">
                <MessageCircle className="size-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Still have questions?</h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="bg-white text-[#1E3A8A] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
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
