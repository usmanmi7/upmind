"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import {
  ArrowRight,
  MapPin,
  Clock,
  Heart,
  Zap,
  GraduationCap,
  Globe,
  Coffee,
  Dumbbell,
  Plane,
} from "lucide-react"

const openings = [
  { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote", type: "Full-time", color: "from-[#2D4A2D] to-[#8FBC8F]" },
  { title: "Product Designer", department: "Design", location: "San Francisco / Remote", type: "Full-time", color: "from-[#7CFC00] to-[#2D4A2D]" },
  { title: "Startup Consultant", department: "Consulting", location: "Remote", type: "Full-time", color: "from-green-500 to-emerald-500" },
  { title: "AI/ML Engineer", department: "Engineering", location: "Remote", type: "Full-time", color: "from-orange-500 to-red-500" },
  { title: "Content Marketing Manager", department: "Marketing", location: "Remote", type: "Full-time", color: "from-[#8FBC8F] to-[#2D4A2D]" },
  { title: "Customer Success Lead", department: "Success", location: "San Francisco", type: "Full-time", color: "from-yellow-500 to-orange-500" },
]

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage for you and your family." },
  { icon: Zap, title: "Flexible Schedule", description: "Work when you're most productive. We trust you to manage your time." },
  { icon: GraduationCap, title: "Learning Budget", description: "$2,000/year for courses, books, conferences, and professional development." },
  { icon: Globe, title: "Work From Anywhere", description: "Remote-first culture. Work from our SF office, your home, or anywhere in between." },
  { icon: Coffee, title: "Home Office Stipend", description: "$1,500 setup budget to create your ideal workspace." },
  { icon: Plane, title: "Unlimited PTO", description: "Take the time you need to rest and recharge. We mean it." },
  { icon: Dumbbell, title: "Wellness Program", description: "Monthly wellness stipend for gym, meditation apps, or whatever keeps you healthy." },
  { icon: Heart, title: "Parental Leave", description: "16 weeks paid parental leave for all parents, no matter how your family grows." },
]

const cultureValues = [
  { title: "Builder's Mindset", description: "We're all builders at heart. We prototype fast, learn from failures, and ship with purpose." },
  { title: "Radical Candor", description: "We give feedback directly and with care. Growth requires honesty." },
  { title: "Founder First", description: "Every decision is filtered through the lens of what's best for our founders." },
  { title: "Stay Curious", description: "We never stop learning. Curiosity drives innovation and keeps us ahead." },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Careers"
          title="Join our"
          highlight="mission"
          description="Help us democratize startup consulting. We're building a team of passionate people who want to make a real impact."
        />

        {/* Open Positions */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                Open <span className="gradient-text">Positions</span>
              </h2>
              <p className="mt-4 text-muted-foreground">Find your next role and help shape the future of startups</p>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              {openings.map((job, i) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="group p-5 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white font-bold text-sm">{job.department[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-heading font-semibold">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="size-3 mr-1" /> {job.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="size-3 mr-1" /> {job.type}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 group-hover:bg-[#E8F5E9] dark:group-hover:bg-[#2D4A2D]/20">
                      Apply <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                Benefits & <span className="gradient-text">Perks</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-5 rounded-2xl bg-card border shadow-sm h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center mb-3">
                      <benefit.icon className="size-5 text-[#2D4A2D] dark:text-[#7CFC00]" />
                    </div>
                    <h3 className="text-sm font-heading font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Culture */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                Our <span className="gradient-text">Culture</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {cultureValues.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-6 rounded-2xl bg-card border shadow-sm h-full">
                    <h3 className="text-base font-heading font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Don&apos;t see the right role?</h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-white text-[#2D4A2D] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
                    <Link href="/contact">
                      Get In Touch
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
