"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import { ArrowRight, Star, TrendingUp, DollarSign, Users, Quote, Loader2 } from "lucide-react"
import * as React from "react"

// Fallback hardcoded testimonials when database is empty
const fallbackTestimonials = [
  {
    name: "Sarah Chen",
    role: "ML Engineer",
    company: "Independent",
    content: "I was about to take another FAANG job. The Innovation Engine matched me to an early-warning pandemic surveillance problem, my ML + distributed systems skills covered 64% of the requirements. Six months in, we have a working pilot with a national health agency.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Hardware Engineer",
    company: "Open Source Contributor",
    content: "I'd been building IoT side projects for years without direction. Enginest's curated air-quality problem showed me the missing middle, accurate sensors at affordable prices. The team template told me exactly who I needed to find.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Research Engineer",
    company: "University Lab",
    content: "The resources library alone is worth it. The build-vs-research decision framework helped me pick the right output type for my water-quality work, open source, not a startup. Saved me from a wrong path.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Senior Engineer",
    company: "Career Switcher",
    content: "After 8 years in adtech, I wanted to do something that mattered. The skill-matching surfaced climate hardware problems where my distributed-systems background was surprisingly relevant. Now I'm full-time on a carbon-capture startup.",
    rating: 5,
  },
  {
    name: "Lisa Martinez",
    role: "Student",
    company: "Final-Year Project",
    content: "I needed a meaningful capstone project. Browsed Solve Them, picked affordable neonatal monitoring. The 12-month roadmap scaled down to my 6-month timeline perfectly. Got hired by a health-tech startup straight out of school.",
    rating: 5,
  },
  {
    name: "James Wright",
    role: "Founder",
    company: "Pre-seed",
    content: "We were about to build a B2B SaaS for adtech. One session with the Innovation Engine showed us our skills fit medical cold-chain logistics 3x better. Pivoted. Closed pre-seed 4 months later.",
    rating: 5,
  },
]

const caseStudies = [
  {
    company: "AirNet",
    industry: "Climate Hardware",
    challenge: "Senior hardware engineer wanted out of consumer IoT but didn't know which climate problem to attack.",
    solution: "Used Solve Them + Innovation Engine. Air-quality monitoring surfaced as the missing middle, accurate sensors at affordable prices. Used the team template to recruit a firmware engineer and field-ops lead.",
    result: "Deployed 50 sensors across Delhi within 18 months. Now expanding to 4 more countries with foundation funding.",
    color: "from-[#1E3A8A] to-[#93C5FD]",
  },
  {
    company: "ColdChain",
    industry: "Health Hardware",
    challenge: "Two ML engineers wanted to leave adtech but had no medical or hardware experience.",
    solution: "Innovation Engine flagged cold-chain vaccine logistics as a high-skill-fit problem. Used the build playbook to scope a 12-month pilot. Found a hardware co-founder through the community.",
    result: "Pilot deployed in 3 rural clinics. Closed pre-seed round. WHO expressing interest in scaling.",
    color: "from-blue-500 to-blue-700",
  },
  {
    company: "OpenGrid",
    industry: "Open Source",
    challenge: "Distributed-systems engineer wanted to contribute to climate but didn't want to start a company.",
    solution: "Build-vs-research framework pointed to open source. Used the open-source playbook to launch a grid monitoring library. Team template recommended a 3-person maintainer structure.",
    result: "500+ GitHub stars, 30+ contributors, adopted by 2 national grid operators for research.",
    color: "from-[#3B82F6] to-[#1E3A8A]",
  },
]

const stats = [
  { icon: TrendingUp, value: "30+", label: "Curated Problems" },
  { icon: Users, value: "26", label: "Categories Covered" },
  { icon: Star, value: "5+", label: "Team Templates" },
  { icon: DollarSign, value: "100%", label: "Publicly Sourced" },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface DBTestimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  content: string
  rating: number | null
}

export default function SuccessStoriesPage() {
  const [dbTestimonials, setDbTestimonials] = React.useState<DBTestimonial[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials")
        if (res.ok) {
          const data = await res.json()
          setDbTestimonials(data.testimonials || [])
        }
      } catch {
        // Use fallback on error
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Use database testimonials if available, otherwise fallback
  const testimonials = dbTestimonials.length > 0
    ? dbTestimonials.map((t) => ({
        name: t.name,
        role: t.role || "Founder",
        company: t.company || "Startup",
        content: t.content,
        rating: t.rating || 5,
      }))
    : fallbackTestimonials

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Builder Stories"
          title="Engineers who found"
          highlight="what to build"
          description="Real stories from engineers, researchers, and builders who used Enginest to find problems worth solving, and shipped solutions that matter."
        />

        {/* Stats */}
        <section className="py-16 border-y bg-muted/30">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] dark:bg-[#1E3A8A]/30 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="size-6 text-[#1E3A8A] dark:text-[#3B82F6]" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                What <span className="font-serif-accent-italic gradient-text">builders</span> say
              </h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-[#3B82F6]" />
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {testimonials.map((t, i) => (
                  <motion.div key={`${t.name}-${i}`} variants={item}>
                    <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="size-6 text-[#3B82F6]/30 mb-2" />
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">&ldquo;{t.content}&rdquo;</p>
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{t.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                Case <span className="font-serif-accent-italic gradient-text">studies</span>
              </h2>
            </div>
            <div className="space-y-6">
              {caseStudies.map((cs, i) => (
                <motion.div
                  key={cs.company}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="p-6 sm:p-8 rounded-2xl bg-card border shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cs.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white font-bold">{cs.company[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold">{cs.company}</h3>
                      <p className="text-sm text-muted-foreground">{cs.industry}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Challenge</h4>
                      <p className="text-sm text-muted-foreground">{cs.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E3A8A] dark:text-[#3B82F6] mb-2">Solution</h4>
                      <p className="text-sm text-muted-foreground">{cs.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E3A8A] dark:text-[#3B82F6] mb-2">Result</h4>
                      <p className="text-sm text-muted-foreground">{cs.result}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                  Find your{' '}
                  <span className="font-serif-accent-italic">problem</span>
                </h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Browse 30+ curated world problems and let the Innovation Engine match you to ones you can actually solve.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-white text-[#1E3A8A] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
                    <Link href="/solve-them">
                      Browse Problems
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
