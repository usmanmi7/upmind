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
  Upload,
  FileText,
} from "lucide-react"
import * as React from "react"

const openings = [
  { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote", type: "Full-time", color: "from-[#1E3A8A] to-[#93C5FD]" },
  { title: "Product Designer", department: "Design", location: "San Francisco / Remote", type: "Full-time", color: "from-[#3B82F6] to-[#1E3A8A]" },
  { title: "Startup Consultant", department: "Consulting", location: "Remote", type: "Full-time", color: "from-green-500 to-emerald-500" },
  { title: "AI/ML Engineer", department: "Engineering", location: "Remote", type: "Full-time", color: "from-orange-500 to-red-500" },
  { title: "Content Marketing Manager", department: "Marketing", location: "Remote", type: "Full-time", color: "from-[#93C5FD] to-[#1E3A8A]" },
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
    coverLetter: "",
    linkedIn: "",
    portfolio: "",
  })
  const [cvFile, setCvFile] = React.useState<File | null>(null)
  const [cvFileName, setCvFileName] = React.useState("")
  const [cvError, setCvError] = React.useState("")

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

  // Pre-fill form from session & fetch existing applications
  React.useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        fullName: session.user.name || prev.fullName,
        email: session.user.email || prev.email,
      }))

      // Fetch user's existing applications to show "Applied" badges
      fetch("/api/careers/my-applications")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.applications) {
            setAlreadyApplied(data.applications.map((a: { jobTitle: string }) => a.jobTitle))
          }
        })
        .catch(() => {})
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
    setCvError("")
    setSubmitted(false)
    setApplyDialogOpen(true)
  }

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError("")
    const file = e.target.files?.[0]
    if (!file) {
      setCvFile(null)
      setCvFileName("")
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setCvError("File size must be less than 5MB")
      setCvFile(null)
      setCvFileName("")
      return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setCvError("Only PDF, DOC, or DOCX files are accepted")
      setCvFile(null)
      setCvFileName("")
      return
    }
    setCvFile(file)
    setCvFileName(file.name)
  }

  const handleSubmit = async () => {
    if (!selectedJob || !session?.user) return

    if (!form.fullName.trim() || !form.email.trim()) {
      setSubmitError("Full name and email are required")
      return
    }

    if (!cvFile) {
      setSubmitError("Please upload your CV / Resume")
      return
    }

    setSubmitting(true)
    setSubmitError("")

    try {
      const formData = new FormData()
      formData.append("jobTitle", selectedJob.title)
      formData.append("department", selectedJob.department)
      formData.append("fullName", form.fullName)
      formData.append("email", form.email)
      formData.append("phone", form.phone)
      formData.append("coverLetter", form.coverLetter)
      formData.append("linkedIn", form.linkedIn)
      formData.append("portfolio", form.portfolio)
      formData.append("cv", cvFile)

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
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
    setCvFile(null)
    setCvFileName("")
    setCvError("")
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
                      <Badge className="bg-[#3B82F6]/20 text-[#1E3A8A] border-[#3B82F6]/30 shrink-0">
                        <Check className="size-3 mr-1" /> Applied
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 group-hover:bg-[#E8F5E9] dark:group-hover:bg-[#1E3A8A]/20"
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
                    <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] dark:bg-[#1E3A8A]/30 flex items-center justify-center mb-3">
                      <benefit.icon className="size-5 text-[#1E3A8A] dark:text-[#3B82F6]" />
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
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Don&apos;t see the right role?</h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-white text-[#1E3A8A] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
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

      {/* Auth Gate Dialog, for non-logged-in users */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center mb-4">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-[#0F1B3D]">
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
                <div className="w-5 h-5 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#1E3A8A]" />
                </div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/auth/login"
            className="w-full flex items-center justify-center gap-2 bg-[#0F1B3D] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#1E3A8A] transition-colors"
          >
            Sign In to Apply
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-center text-sm text-gray-500 mt-3">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#1E3A8A] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </DialogContent>
      </Dialog>

      {/* Application Form Dialog, for logged-in users */}
      <Dialog open={applyDialogOpen} onOpenChange={closeApplyDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {submitted ? (
            /* Success State */
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F1B3D] mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your application for <span className="font-semibold">{selectedJob?.title}</span> has been received. We&apos;ll review it and get back to you soon.
              </p>
              <Button onClick={closeApplyDialog} className="bg-[#0F1B3D] hover:bg-[#1E3A8A] text-white">
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
                    <DialogTitle className="text-lg font-bold text-[#0F1B3D]">
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
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    CV / Resume <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                      cvFile
                        ? "border-[#3B82F6] bg-[#3B82F6]/5"
                        : cvError
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5"
                    }`}
                    onClick={() => document.getElementById("cv-upload")?.click()}
                  >
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleCvChange}
                    />
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#1E3A8A]" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[#0F1B3D] truncate max-w-[200px]">{cvFileName}</p>
                          <p className="text-xs text-gray-500">{(cvFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                        </div>
                        <button
                          type="button"
                          className="ml-auto p-1 rounded-full hover:bg-red-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCvFile(null)
                            setCvFileName("")
                          }}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Click to upload your CV</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX · Max 5MB</p>
                      </div>
                    )}
                  </div>
                  {cvError && (
                    <p className="text-xs text-red-500 mt-1.5">{cvError}</p>
                  )}
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
                className="w-full mt-6 bg-[#0F1B3D] hover:bg-[#1E3A8A] text-white h-12 text-base font-semibold"
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
