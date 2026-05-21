"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import {
  Rocket,
  BarChart3,
  Megaphone,
  DollarSign,
  Users,
  Bot,
  ArrowRight,
  CheckCircle2,
  Search,
  Lightbulb,
  Wrench,
  Zap,
} from "lucide-react"

const services = [
  {
    icon: Rocket,
    title: "Startup Strategy & Validation",
    description: "Validate your idea before investing time and money. We help you test assumptions, identify your market, and build a solid foundation.",
    features: ["Market Research & Analysis", "Idea Validation Sprints", "Business Model Canvas", "Competitive Landscape Mapping"],
    color: "from-[#2D4A2D] to-[#8FBC8F]",
  },
  {
    icon: BarChart3,
    title: "Product Development & Growth",
    description: "From MVP to scale. Get expert guidance on product strategy, user acquisition, and growth loops that actually work.",
    features: ["MVP Roadmap Planning", "Product-Market Fit Analysis", "Growth Hacking Strategies", "User Retention Optimization"],
    color: "from-[#7CFC00] to-[#2D4A2D]",
  },
  {
    icon: Megaphone,
    title: "Marketing & Brand Building",
    description: "Build a brand that resonates and a marketing engine that scales. From content strategy to paid acquisition.",
    features: ["Brand Identity & Positioning", "Content Marketing Strategy", "Paid Acquisition Playbook", "Social Media Growth"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: DollarSign,
    title: "Fundraising & Investor Relations",
    description: "Navigate the fundraising landscape with confidence. We help you prepare, pitch, and close your next round.",
    features: ["Pitch Deck Optimization", "Financial Model Building", "Investor Introduction", "Due Diligence Prep"],
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    title: "Team Building & Culture",
    description: "Your startup is only as strong as your team. Learn to hire, retain, and build a culture that scales.",
    features: ["Hiring Frameworks", "Culture Playbook", "Compensation Strategy", "Remote Team Management"],
    color: "from-[#8FBC8F] to-[#2D4A2D]",
  },
  {
    icon: Bot,
    title: "AI & Digital Transformation",
    description: "Leverage AI to automate, optimize, and innovate. Stay ahead of the curve with practical AI implementation.",
    features: ["AI Strategy Assessment", "Automation Roadmap", "AI-Powered Product Features", "Data Infrastructure"],
    color: "from-yellow-500 to-orange-500",
  },
]

const processSteps = [
  {
    step: "01",
    icon: Search,
    title: "Discovery",
    description: "We start by understanding your vision, market, and challenges through deep-dive sessions.",
  },
  {
    step: "02",
    icon: Lightbulb,
    title: "Strategy",
    description: "We craft a tailored strategy with clear milestones, KPIs, and actionable steps.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Execution",
    description: "We work alongside you to implement the strategy, providing hands-on guidance.",
  },
  {
    step: "04",
    icon: Zap,
    title: "Optimization",
    description: "We measure results, iterate, and optimize for sustainable, long-term growth.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Our Services"
          title="Everything you need to"
          highlight="build & scale"
          description="From idea validation to global expansion, our expert consultants and AI-powered platform guide you through every stage of your startup journey."
        />

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => (
                <motion.div key={service.title} variants={item}>
                  <div className="group p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                    <ul className="space-y-2 mt-auto">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                How We <span className="gradient-text">Work</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                A proven 4-step process that turns ideas into thriving businesses
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="p-6 rounded-2xl bg-card border shadow-sm text-center">
                    <div className="text-4xl font-bold gradient-text mb-4">{step.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="size-6 text-[#2D4A2D] dark:text-[#7CFC00]" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-muted-foreground/30">
                      <ArrowRight className="size-6" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Ready to transform your startup?</h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Book a free consultation and discover how our services can accelerate your growth.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="bg-white text-[#2D4A2D] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
                    <Link href="/auth/signup">
                      Book Free Consultation
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
