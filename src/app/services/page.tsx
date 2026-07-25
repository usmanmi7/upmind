"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import {
  Compass,
  Sparkles,
  Wrench,
  BookOpen,
  Users,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Search,
  Lightbulb,
  Hammer,
  Rocket,
} from "lucide-react"

const services = [
  {
    icon: Compass,
    title: "Solve Them — Problem Database",
    description: "30+ curated world problems across 26 categories. Each problem is sourced from WHO, UN, IEA, IPCC, and other authoritative bodies — with severity, scope, affected populations, and existing-solution analysis.",
    features: ["26 problem categories", "Severity & impact scoring (0-100)", "Regional & scope filters", "Sources from multilateral orgs"],
    color: "from-[#1E3A8A] to-[#93C5FD]",
  },
  {
    icon: Sparkles,
    title: "AI Innovation Engine",
    description: "Tell us your engineering skills, interests, time, and team size. Our matching algorithm scores every problem in the database for fit — so you start with problems you can actually solve.",
    features: ["Skill-coverage scoring (0-60)", "Interest overlap matching (0-30)", "Team & time constraint bonuses", "Reason-highlight explanations"],
    color: "from-[#3B82F6] to-[#1E3A8A]",
  },
  {
    icon: Wrench,
    title: "Engineering Build Playbooks",
    description: "Open any problem to see engineering solutions, a 4-phase build roadmap, required skills, and recommended team templates — everything you need to move from problem to project.",
    features: ["Engineering solution briefs", "12-month roadmap templates", "Skill requirement maps", "Battle-tested team templates"],
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: BookOpen,
    title: "Engineering Resources Library",
    description: "Field guides, templates, and frameworks written for engineers — not generic startup advice. Reading lists, ethics frameworks, funding field guides, and lessons from builders in the field.",
    features: ["Problem-discovery guides", "Engineering skills self-assessment", "Career paths for innovators", "Open-source playbooks"],
    color: "from-[#93C5FD] to-[#1E3A8A]",
  },
  {
    icon: Users,
    title: "Team Templates",
    description: "Five battle-tested team structures for software, hardware, research, open source, and field-deployment projects — including role definitions, sizes, and hiring sequences.",
    features: ["Lean software (3-5 people)", "Hardware + software (5-8)", "Research lab (3-6)", "Field deployment (6-12)"],
    color: "from-indigo-500 to-blue-700",
  },
  {
    icon: Cpu,
    title: "AI Assistant",
    description: "An AI assistant trained on our engineering innovation framework — interview-first protocol, problem framing, build decisions, and pointers to the right resources for where you are.",
    features: ["Interview-first protocol", "Problem framing help", "Build-vs-research guidance", "Resource recommendations"],
    color: "from-sky-500 to-blue-700",
  },
]

const processSteps = [
  {
    step: "01",
    icon: Search,
    title: "Discover",
    description: "Browse curated world problems sourced from WHO, UN, IEA, IPCC and more. Filter by category, scope, and difficulty to find what resonates.",
  },
  {
    step: "02",
    icon: Lightbulb,
    title: "Match",
    description: "Run the Innovation Engine. Tell us your skills, interests, time, and team — get a ranked shortlist of problems you can actually solve.",
  },
  {
    step: "03",
    icon: Hammer,
    title: "Build",
    description: "Use the recommended team templates, build roadmap, and starter solutions to launch a project that actually moves the needle.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Scale",
    description: "Open-source your work, attract collaborators through the Innovation Engine, and turn an engineering project into a real venture.",
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
          badge="What We Built"
          title="A complete platform for"
          highlight="engineering innovators"
          description="From problem discovery to deployment — everything engineers need to find problems worth solving, match them to skills, and ship solutions that matter."
        />

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
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
                          <CheckCircle2 className="size-3.5 text-[#3B82F6] shrink-0" />
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

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                How <span className="gradient-text">Enginest</span> Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                A four-step path from "I want to build something that matters" to a real engineering project.
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
                  <div className="p-6 rounded-2xl bg-card border shadow-sm text-center h-full">
                    <div className="text-4xl font-bold gradient-text mb-4">{step.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] dark:bg-[#1E3A8A]/30 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="size-6 text-[#1E3A8A] dark:text-[#3B82F6]" />
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
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                  Ready to find your{' '}
                  <span className="font-serif-accent-italic">problem?</span>
                </h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Browse 30+ curated world problems and run the Innovation Engine to find the ones you&apos;re uniquely positioned to solve.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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
