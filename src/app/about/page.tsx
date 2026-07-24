"use client"

import Link from "next/link"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import { ArrowRight, Compass, Users, Target, Lightbulb, Globe, Code, Wrench } from "lucide-react"

const values = [
  {
    icon: Compass,
    title: "Problem-First",
    description: "We start with real, documented problems — not clever technology in search of a market. Every problem in our database is sourced from authoritative bodies and validated for engineering leverage.",
  },
  {
    icon: Users,
    title: "Engineer-Built",
    description: "Upmind is built by engineers for engineers. We know the pain of building something nobody wanted, and we're obsessed with making problem selection as rigorous as engineering itself.",
  },
  {
    icon: Lightbulb,
    title: "AI-Matched",
    description: "Your time is finite. Our Innovation Engine uses AI to match your specific skills to problems you can actually solve — so you start with leverage instead of uphill battles.",
  },
  {
    icon: Code,
    title: "Open by Default",
    description: "We default to open. Our problem briefs, roadmaps, and team templates are public. We believe engineering innovation compounds when builders can learn from each other.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "The hardest problems are global — climate, health, energy, food. We source from WHO, UN, IEA, IPCC because that's where real, sized, documented problems live.",
  },
  {
    icon: Target,
    title: "Impact-Oriented",
    description: "We measure what matters. Every problem includes severity, people affected, and impact scores — so you can pick work that moves real numbers, not vanity metrics.",
  },
]

const stats = [
  { value: "30+", label: "Curated Problems" },
  { value: "26", label: "Categories" },
  { value: "5+B", label: "People Affected" },
  { value: "100%", label: "Sourced Publicly" },
]

const team = [
  {
    name: "The Curators",
    role: "Problem Discovery",
    description: "Engineers and researchers who read WHO reports, UN briefings, and IPCC chapters so you don't have to. They extract, size, and frame problems for engineering leverage.",
  },
  {
    name: "The Builders",
    role: "Platform & AI",
    description: "The team shipping the Solve Them database, the Innovation Engine, and the resources library. Engineers who care about craft and impact.",
  },
  {
    name: "The Field Network",
    role: "Domain Experts",
    description: "A network of practitioners in climate, health, agriculture, energy, and AI safety who validate problems and review solutions for real-world feasibility.",
  },
  {
    name: "The Community",
    role: "Open Contributors",
    description: "Engineers, students, researchers, and founders who contribute problems, review briefs, and share build lessons. Upmind is theirs as much as ours.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="About Us"
          title="We help engineers build"
          highlight="what matters"
          description="Upmind is an engineering innovation platform. We curate real-world problems, match them to engineering skills with AI, and give builders the playbooks to ship solutions that count."
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
                <span className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
                  Our Story
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                  Built by engineers, for{' '}
                  <span className="font-serif-accent-italic text-[#1E3A8A]">builders</span>
                </h2>
                <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-6">
                  Upmind started with a simple observation: talented engineers keep building clever
                  solutions in search of problems. The technology is rarely the bottleneck —
                  problem selection is. We watched friends burn years on products nobody wanted,
                  while real, documented problems went unsolved.
                </p>
                <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-6">
                  So we flipped the workflow. Instead of starting from what you can build, start
                  from what actually needs building. We curate real, documented problems from WHO,
                  UN, IEA, IPCC, and other authoritative sources — then match them to engineering
                  skills that can actually move the needle.
                </p>
                <p className="text-[#666666] text-base sm:text-lg leading-relaxed">
                  Today, Upmind is the home for engineers who want their work to matter: a curated
                  problem database, an AI Innovation Engine for skill matching, playbooks for
                  building, and a community of people shipping things that count.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-[#0F1B3D] rounded-2xl p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#3B82F6] font-heading">{stat.value}</div>
                      <div className="text-white/60 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-[#F5F7FB]">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
                Our Values
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                What drives everything we{' '}
                <span className="font-serif-accent-italic text-[#1E3A8A]">build</span>
              </h2>
              <p className="text-[#666666] text-base sm:text-lg">
                Our values shape the problems we curate, the AI we build, and the way we serve the engineering community.
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
                  className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#3B82F6]/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0F1B3D] flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-[#3B82F6]" />
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
              <span className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
                Who We Are
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                The people behind{' '}
                <span className="font-serif-accent-italic text-[#1E3A8A]">Upmind</span>
              </h2>
              <p className="text-[#666666] text-base sm:text-lg">
                A small core team, a global field network, and a community of builders — all working to make engineering innovation more accessible.
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
                  className="text-center bg-[#F5F7FB] rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-full bg-[#0F1B3D] flex items-center justify-center mx-auto mb-4 text-[#3B82F6] text-2xl font-bold font-heading">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{member.name}</h3>
                  <p className="text-[#3B82F6] text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-[#666666] text-sm leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#0F1B3D]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to build something{' '}
              <span className="font-serif-accent-italic text-[#93C5FD]">that matters?</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Browse 30+ curated world problems. Run the Innovation Engine. Start your build.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/solve-them"
                className="bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/20 flex items-center gap-2 group"
              >
                Browse Problems
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
