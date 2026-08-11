"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  Rocket,
  Target,
  CreditCard,
  Check,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

const steps = [
  { id: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Startup Info", icon: Rocket, description: "About your startup" },
  { id: 3, title: "Goals", icon: Target, description: "What you want to achieve" },
  { id: 4, title: "Choose Plan", icon: CreditCard, description: "Select your plan" },
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-Commerce",
  "SaaS",
  "AI/ML",
  "Fintech",
  "CleanTech",
  "Other",
]

const teamSizes = [
  "Solo Founder",
  "2-5",
  "6-10",
  "11-25",
  "26-50",
  "50+",
]

const businessStages = [
  "Idea Stage",
  "Validation",
  "Early Traction",
  "Growth",
  "Scaling",
  "Mature",
]

const goalOptions = [
  "Validate my startup idea",
  "Build an MVP",
  "Find product-market fit",
  "Scale my product",
  "Raise funding",
  "Improve team operations",
  "Enter new markets",
  "Optimize revenue model",
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedGoals, setSelectedGoals] = React.useState<string[]>([])
  const [selectedPlan, setSelectedPlan] = React.useState<"FREE" | "GROWTH_PRO">("FREE")

  const [formData, setFormData] = React.useState({
    // Step 1: Personal Info
    name: "",
    phone: "",
    country: "",
    // Step 2: Startup Info
    startupName: "",
    industry: "",
    teamSize: "",
    businessStage: "",
    website: "",
    // Step 3: Goals
    vision: "",
  })

  // Pre-fill from session
  React.useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
      }))
    }
  }, [session])

  const progress = (currentStep / steps.length) * 100

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Save onboarding data
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          country: formData.country,
          startupName: formData.startupName,
          industry: formData.industry,
          teamSize: formData.teamSize,
          businessStage: formData.businessStage,
          website: formData.website,
          vision: formData.vision,
          goals: selectedGoals,
          plan: selectedPlan,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "Something went wrong")
        return
      }

      toast.success("Onboarding complete! Welcome to Enginest!")
      await updateSession()
      router.push("/dashboard")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-[#0A1228] dark:via-[#0F1B3D] dark:to-[#1E3A8A] p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#1E3A8A]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Image
              src="/images/logo-light.png"
              alt="Enginest logo"
              width={240}
              height={96}
              priority
              className="h-16 w-auto dark:hidden"
            />
            <Image
              src="/images/logo.png"
              alt="Enginest logo"
              width={240}
              height={96}
              priority
              className="h-16 w-auto hidden dark:block"
            />
          </div>
          <h1 className="text-2xl font-heading font-bold">Set up your account</h1>
          <p className="text-muted-foreground mt-1">
            Let&apos;s personalize your experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm transition-smooth ${
                  currentStep >= step.id
                    ? "text-[#1E3A8A] dark:text-[#3B82F6]"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-smooth ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="size-4" />
                  ) : (
                    <step.icon className="size-4" />
                  )}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Step {currentStep} of {steps.length}, {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Step Content */}
        <Card className="glass border-0 shadow-xl shadow-black/5 dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="text-xl font-heading">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 2: Startup Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startupName">Startup Name</Label>
                  <Input
                    id="startupName"
                    placeholder="My Awesome Startup"
                    value={formData.startupName}
                    onChange={(e) =>
                      setFormData({ ...formData, startupName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData({ ...formData, industry: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) =>
                      setFormData({ ...formData, teamSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Business Stage</Label>
                  <Select
                    value={formData.businessStage}
                    onValueChange={(value) =>
                      setFormData({ ...formData, businessStage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://myawesomestartup.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vision">Your Vision</Label>
                  <Input
                    id="vision"
                    placeholder="What's your startup's big vision?"
                    value={formData.vision}
                    onChange={(e) =>
                      setFormData({ ...formData, vision: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <Label>What do you want help with?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`text-left p-3 rounded-lg border text-sm transition-smooth ${
                          selectedGoals.includes(goal)
                            ? "border-[#3B82F6] bg-[#E8F5E9] text-[#0F1B3D] dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD] dark:border-[#3B82F6]"
                            : "border-border hover:border-[#3B82F6] dark:hover:border-[#1E3A8A]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-smooth ${
                              selectedGoals.includes(goal)
                                ? "bg-[#3B82F6] border-[#3B82F6]"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {selectedGoals.includes(goal) && (
                              <Check className="size-3 text-white" />
                            )}
                          </div>
                          {goal}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Plan Selection */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Free Plan */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("FREE")}
                    className={`relative text-left p-6 rounded-xl border-2 transition-smooth ${
                      selectedPlan === "FREE"
                        ? "border-[#3B82F6] bg-[#E8F5E9]/50 dark:bg-[#1E3A8A]/20"
                        : "border-border hover:border-[#3B82F6]"
                    }`}
                  >
                    <div className="mb-3">
                      <h3 className="font-heading font-bold text-lg">Free Trial</h3>
                      <p className="text-sm text-muted-foreground">
                        Get started with the basics
                      </p>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">$0</span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        1 startup profile
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        Basic resources
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        Community access
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        1 consultation
                      </li>
                    </ul>
                  </button>

                  {/* Growth Pro Plan */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("GROWTH_PRO")}
                    className={`relative text-left p-6 rounded-xl border-2 transition-smooth ${
                      selectedPlan === "GROWTH_PRO"
                        ? "border-[#3B82F6] bg-[#E8F5E9]/50 dark:bg-[#1E3A8A]/20"
                        : "border-border hover:border-[#3B82F6]"
                    }`}
                  >
                    <div className="absolute -top-3 right-4">
                      <span className="bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                    <div className="mb-3">
                      <h3 className="font-heading font-bold text-lg">Growth Pro</h3>
                      <p className="text-sm text-muted-foreground">
                        For serious founders
                      </p>
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">$49</span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        Unlimited startup profiles
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        Premium resources & templates
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        Priority consultations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-4 text-green-500" />
                        Custom roadmap
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="size-4 text-[#1E3A8A]" />
                        AI-powered insights
                      </li>
                    </ul>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <div className="flex gap-2">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip for now
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                  Skip all
                </Button>
                {currentStep < steps.length ? (
                  <Button
                    onClick={handleNext}
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D]"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-[#0F1B3D] shadow-lg shadow-[#3B82F6]/25"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <Sparkles className="size-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
