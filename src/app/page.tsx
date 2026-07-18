"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Stats from "@/components/Stats"
import Partners from "@/components/Partners"
import About from "@/components/About"
import Services from "@/components/Services"
import HowWeWork from "@/components/HowWeWork"
import Testimonials from "@/components/Testimonials"
import Pricing from "@/components/Pricing"
import Resources from "@/components/Resources"
import CTASection from "@/components/CTASection"
import Footer from "@/components/Footer"
import AIAssistantCTA from "@/components/AIAssistantCTA"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Partners />
        <Services />
        <About />
        <HowWeWork />
        <AIAssistantCTA />
        <Testimonials />
        <Pricing />
        <Resources />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
