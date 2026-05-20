"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import { ArrowRight, Star, TrendingUp, DollarSign, Users, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO",
    company: "TechFlow",
    content: "Upmind helped us validate our idea in just 2 weeks. We saved months of wasted effort and $50K in potential missteps. Their strategic guidance was invaluable during our early stages.",
    rating: 5,
    metrics: { raised: "$2.5M", growth: "300%", employees: "25" },
  },
  {
    name: "Marcus Johnson",
    role: "Founder",
    company: "GreenScale",
    content: "The consulting sessions were game-changing. Our consultant helped us see blind spots we never would have caught on our own. We went from idea to revenue in 4 months.",
    rating: 5,
    metrics: { raised: "$1.2M", growth: "450%", employees: "12" },
  },
  {
    name: "Priya Sharma",
    role: "CTO",
    company: "DataBridge",
    content: "The resources and templates alone are worth the subscription. They saved us hundreds of hours of research. Upmind is like having a seasoned advisor on demand.",
    rating: 5,
    metrics: { raised: "$5M", growth: "200%", employees: "40" },
  },
  {
    name: "David Kim",
    role: "Co-Founder",
    company: "NexGen AI",
    content: "From pitch deck to Series A in 6 months. Upmind's fundraising guidance was the difference between a failed round and a successful one.",
    rating: 5,
    metrics: { raised: "$8M", growth: "500%", employees: "35" },
  },
  {
    name: "Lisa Martinez",
    role: "CEO",
    company: "HealthPulse",
    content: "The AI insights feature identified market opportunities we completely overlooked. It felt like having a crystal ball for our product roadmap.",
    rating: 5,
    metrics: { raised: "$3M", growth: "280%", employees: "18" },
  },
  {
    name: "James Wright",
    role: "Founder",
    company: "FinEdge",
    content: "Upmind's roadmap tool kept us focused and accountable. We hit every milestone on time and under budget. I can't imagine building without it.",
    rating: 5,
    metrics: { raised: "$4.5M", growth: "350%", employees: "22" },
  },
]

const caseStudies = [
  {
    company: "TechFlow",
    industry: "SaaS",
    challenge: "Struggling to find product-market fit after 8 months of development.",
    solution: "Used Upmind's validation framework to pivot strategy and identify the right customer segment.",
    result: "300% user growth in 3 months, raised $2.5M Series A.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    company: "GreenScale",
    industry: "CleanTech",
    challenge: "Needed to prepare for investor meetings with no prior fundraising experience.",
    solution: "Worked with Upmind consultants on pitch deck, financial model, and presentation skills.",
    result: "Closed $1.2M seed round within 2 months of starting the program.",
    color: "from-green-500 to-emerald-500",
  },
  {
    company: "NexGen AI",
    industry: "AI/ML",
    challenge: "Had the technology but couldn't articulate the business value to investors.",
    solution: "Refined go-to-market strategy and messaging with expert guidance from Upmind.",
    result: "Secured $8M Series A at a $40M valuation.",
    color: "from-purple-500 to-pink-500",
  },
]

const stats = [
  { icon: DollarSign, value: "$2B+", label: "Total Funding Raised" },
  { icon: TrendingUp, value: "92%", label: "Success Rate" },
  { icon: Users, value: "500+", label: "Startups Helped" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Success Stories"
          title="Startups that"
          highlight="made it happen"
          description="Real stories from real founders who turned their visions into thriving businesses with Upmind."
        />

        {/* Stats */}
        <section className="py-16 border-y bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="size-6 text-blue-600 dark:text-blue-400" />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                What <span className="gradient-text">founders</span> say
              </h2>
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {testimonials.map((t) => (
                <motion.div key={t.name} variants={item}>
                  <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="size-6 text-blue-500/30 mb-2" />
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">&ldquo;{t.content}&rdquo;</p>
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{t.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-green-600 dark:text-green-400 font-medium">↑ {t.metrics.growth} growth</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{t.metrics.raised} raised</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                Case <span className="gradient-text">Studies</span>
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
                      <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Solution</h4>
                      <p className="text-sm text-muted-foreground">{cs.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Result</h4>
                      <p className="text-sm font-muted-foreground">{cs.result}</p>
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
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Write your own success story</h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Join 500+ founders who&apos;ve accelerated their growth with Upmind.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
                    <Link href="/auth/signup">
                      Start Your Journey
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
