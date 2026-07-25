"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, ArrowRight, Send, Twitter, Linkedin, Github } from "lucide-react"
import * as React from "react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "hello@enginest.io",
    description: "We respond within 24 hours",
    color: "from-[#1E3A8A] to-[#93C5FD]",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+1 (555) 123-4567",
    description: "Mon–Fri, 9am–6pm EST",
    color: "from-[#3B82F6] to-[#1E3A8A]",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "123 Innovation Drive",
    description: "San Francisco, CA 94105",
    color: "from-blue-500 to-blue-700",
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Contact"
          title="Let's start a"
          highlight="conversation"
          description="Have a question, idea, or just want to chat? We'd love to hear from you. Our team typically responds within 24 hours."
        />

        {/* Contact Info Cards */}
        <section className="pt-12 pb-12">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 text-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-4`}>
                      <info.icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-base font-heading font-semibold mb-1">{info.title}</h3>
                    <p className="text-sm font-medium text-[#1E3A8A] dark:text-[#3B82F6]">{info.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form + Map */}
        <section className="py-12">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="p-6 sm:p-8 rounded-2xl bg-card border shadow-sm">
                  <h2 className="text-xl font-heading font-bold mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Name</label>
                        <Input placeholder="Your name" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email</label>
                        <Input type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Subject</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="sales">Sales & Plans</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Message</label>
                      <Textarea placeholder="Tell us how we can help..." rows={5} required />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]"
                    >
                      {submitted ? "Message Sent!" : "Send Message"}
                      <Send className="size-4 ml-2" />
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Map Placeholder + Social */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="rounded-2xl bg-muted/50 border h-64 sm:h-80 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                    <p className="text-xs text-muted-foreground mt-1">123 Innovation Drive, San Francisco, CA</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border shadow-sm">
                  <h3 className="text-base font-heading font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A]/30 hover:text-[#1E3A8A] transition-smooth">
                      <Twitter className="size-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A]/30 hover:text-[#1E3A8A] transition-smooth">
                      <Linkedin className="size-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A]/30 hover:text-[#0F1B3D] transition-smooth">
                      <Github className="size-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
