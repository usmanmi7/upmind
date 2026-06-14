"use client"

import Link from "next/link"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Users, Target, Award, Lightbulb, Globe, Heart } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Strategy First",
    description: "Every decision starts with data and strategy. We don't guess, we analyze, plan, and execute with precision.",
  },
  {
    icon: Users,
    title: "Client Obsessed",
    description: "Your success is our success. We go above and beyond to ensure every client achieves their growth targets.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Driven",
    description: "We embrace new technologies and methodologies to stay ahead of the curve and deliver cutting-edge solutions.",
  },
  {
    icon: Heart,
    title: "People Centered",
    description: "We believe the best strategies are built on understanding people, their needs, behaviors, and aspirations.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "With experience across markets and industries, we bring a worldwide view to every local challenge.",
  },
  {
    icon: Award,
    title: "Results Oriented",
    description: "We measure everything. Every engagement is tied to clear KPIs and tangible, trackable outcomes.",
  },
]

const stats = [
  { value: "500+", label: "Startups Served" },
  { value: "95%", label: "Client Satisfaction" },
  { value: "12+", label: "Years of Experience" },
  { value: "$5M+", label: "Revenue Generated" },
]

const team = [
  {
    name: "Sarah Mitchell",
    role: "CEO & Co-Founder",
    description: "Former VP of Strategy at Deloitte. 15+ years guiding startups from seed to Series C.",
  },
  {
    name: "David Chen",
    role: "Head of Product",
    description: "Ex-Google PM. Specializes in product-market fit and growth strategy for B2B SaaS.",
  },
  {
    name: "Amara Okafor",
    role: "Lead Consultant",
    description: "MBA from Wharton. Expert in fundraising, investor relations, and financial modeling.",
  },
  {
    name: "James Rivera",
    role: "AI & Tech Lead",
    description: "Former ML engineer at Meta. Leads our AI-powered insights and digital transformation practice.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="About Us"
          title="We help startups build"
          highlight="smarter"
          description="Upmind is a strategic consulting platform that combines expert guidance with AI-powered tools to help startups validate, launch, and scale with confidence."
        />

        {/* Story Section */}
        <section className="py-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
                  Our Story
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                  Born from the trenches of startup life
                </h2>
                <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-6">
                  Upmind was founded by a team of entrepreneurs, consultants, and technologists who experienced firsthand the challenges of building and scaling startups. We saw too many promising ideas fail, not because of bad products, but because of bad strategy.
                </p>
                <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-6">
                  That's why we built Upmind: a platform that bridges the gap between raw ambition and structured execution. We combine the human expertise of seasoned consultants with AI-powered tools that give founders the insights they need, when they need them.
                </p>
                <p className="text-[#666666] text-base sm:text-lg leading-relaxed">
                  Today, we've helped over 500 startups across 20+ industries turn their visions into viable, growing businesses. And we're just getting started.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <div key={stat.label} className="bg-[#1A2E1A] rounded-2xl p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#7CFC00] font-heading">{stat.value}</div>
                      <div className="text-white/60 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-[#F5F5F5]">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
                Our Values
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                What drives everything we do
              </h2>
              <p className="text-[#666666] text-base sm:text-lg">
                Our core values shape our culture, our decisions, and the way we serve our clients every day.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#7CFC00]/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1A2E1A] flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-[#7CFC00]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{value.title}</h3>
                  <p className="text-[#666666] text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
                Our Team
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                Meet the people behind Upmind
              </h2>
              <p className="text-[#666666] text-base sm:text-lg">
                A diverse team of strategists, builders, and innovators committed to your success.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center bg-[#F5F5F5] rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-full bg-[#1A2E1A] flex items-center justify-center mx-auto mb-4 text-[#7CFC00] text-2xl font-bold font-heading">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{member.name}</h3>
                  <p className="text-[#7CFC00] text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-[#666666] text-sm leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1A2E1A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to grow with us?
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Join 500+ startups who have accelerated their growth with Upmind's strategic guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/20 flex items-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="text-white/80 border border-white/15 rounded-full px-8 py-3.5 text-base font-medium hover:bg-white/5 hover:border-white/25 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
