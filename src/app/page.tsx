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
import Blog from "@/components/Blog"
import CTASection from "@/components/CTASection"
import Footer from "@/components/Footer"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Partners />
        <About />
        <Services />
        <HowWeWork />
        <Testimonials />
        <Pricing />
        <Blog />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
