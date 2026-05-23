"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
  Check,
  Briefcase,
  X,
  Loader2,
  Sparkles,
  User,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
} from "lucide-react"
import * as React from "react"

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
  const { data: session, status } = useSession()
  const [applyDialogOpen, setApplyDialogOpen] = React.useState(false)
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false)
  const [selectedJob, setSelectedJob] = React.useState<typeof openings[0] | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [alreadyApplied, setAlreadyApplied] = React.useState<string[]>([])
  const [submitError, setSubmitError] = React.useState("")

  // Form state
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: "",
    linkedIn: "",
    portfolio: "",
  })

  // Pre-fill form from session
  React.useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        fullName: session.user.name || prev.fullName,
        email: session.user.email || prev.email,
      }))
    }
  }, [session])

  const handleApplyClick = (job: typeof openings[0]) => {
    if (status !== "authenticated") {
      setSelectedJob(job)
      setAuthDialogOpen(true)
      return
    }
    setSelectedJob(job)
    setSubmitError("")
    setSubmitted(false)
    setApplyDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedJob || !session?.user) return

    if (!form.fullName.trim() || !form.email.trim()) {
      setSubmitError("Full name and email are required")
      return
    }

    setSubmitting(true)
    setSubmitError("")

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: selectedJob.title,
          department: selectedJob.department,
          ...form,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setAlreadyApplied(prev => [...prev, selectedJob.title])
          setSubmitError(data.error)
        } else {
          setSubmitError(data.error || "Failed to submit application")
        }
        return
      }

      setSubmitted(true)
      setAlreadyApplied(prev => [...prev, selectedJob.title])
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const closeApplyDialog = () => {
    setApplyDialogOpen(false)
    setSelectedJob(null)
    setSubmitted(false)
    setSubmitError("")
  }

  const isJobApplied = (jobTitle: string) => alreadyApplied.includes(jobTitle)

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
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
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
                    {isJobApplied(job.title) ? (
                      <Badge className="bg-[#7CFC00]/20 text-[#2D4A2D] border-[#7CFC00]/30 shrink-0">
                        <Check className="size-3 mr-1" /> Applied
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 group-hover:bg-[#E8F5E9] dark:group-hover:bg-[#2D4A2D]/20"
                        onClick={() => handleApplyClick(job)}
                      >
                        Apply <ArrowRight className="size-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Auth Gate Dialog — for non-logged-in users */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center mb-4">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-[#1A2E1A]">
              Apply for {selectedJob?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              You need an account to apply for this position. Sign in to submit your application and track its status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4 mb-6">
            {[
              "Submit your application in seconds",
              "Track your application status",
              "Get notified about updates",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#7CFC00]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#2D4A2D]" />
                </div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/auth/login"
            className="w-full flex items-center justify-center gap-2 bg-[#1A2E1A] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#243824] transition-colors"
          >
            Sign In to Apply
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-center text-sm text-gray-500 mt-3">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#2D4A2D] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </DialogContent>
      </Dialog>

      {/* Application Form Dialog — for logged-in users */}
      <Dialog open={applyDialogOpen} onOpenChange={closeApplyDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {submitted ? (
            /* Success State */
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#7CFC00]/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#2D4A2D]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A2E1A] mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your application for <span className="font-semibold">{selectedJob?.title}</span> has been received. We&apos;ll review it and get back to you soon.
              </p>
              <Button onClick={closeApplyDialog} className="bg-[#1A2E1A] hover:bg-[#243824]">
                Done
              </Button>
            </div>
          ) : (
            /* Application Form */
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedJob?.color} flex items-center justify-center`}>
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-[#1A2E1A]">
                      Apply for {selectedJob?.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      {selectedJob?.department} · {selectedJob?.location}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}

              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        className="pl-9"
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        className="pl-9"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Resume / CV Link</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                      value={form.resumeUrl}
                      onChange={(e) => setForm(prev => ({ ...prev, resumeUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cover Letter</label>
                  <Textarea
                    placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                    rows={4}
                    value={form.coverLetter}
                    onChange={(e) => setForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        className="pl-9"
                        placeholder="linkedin.com/in/yourname"
                        value={form.linkedIn}
                        onChange={(e) => setForm(prev => ({ ...prev, linkedIn: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Portfolio</label>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        className="pl-9"
                        placeholder="yourportfolio.com"
                        value={form.portfolio}
                        onChange={(e) => setForm(prev => ({ ...prev, portfolio: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-6 bg-[#1A2E1A] hover:bg-[#243824] text-white h-12 text-base font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
