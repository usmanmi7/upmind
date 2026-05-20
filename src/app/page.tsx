"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import {
  ArrowRight,
  Rocket,
  BarChart3,
  MessageSquare,
  BookOpen,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Rocket,
    title: "Startup Validation",
    description:
      "Validate your ideas with data-driven insights and expert guidance before investing time and money.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Growth Analytics",
    description:
      "Track your startup's progress with intuitive dashboards and actionable metrics.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Expert Consulting",
    description:
      "Connect with seasoned consultants who've helped hundreds of startups succeed.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      "Access templates, guides, and tools curated specifically for startup founders.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Identify and mitigate potential risks early with our structured framework.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    description:
      "Get personalized recommendations and predictions powered by advanced AI.",
    color: "from-yellow-500 to-orange-500",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow",
    content:
      "Upmind helped us validate our idea in just 2 weeks. We saved months of wasted effort and $50K in potential missteps.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Founder, GreenScale",
    content:
      "The consulting sessions were game-changing. Our consultant helped us see blind spots we never would have caught on our own.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "CTO, DataBridge",
    content:
      "The resources and templates alone are worth the subscription. They saved us hundreds of hours of research.",
    rating: 5,
  },
]

const stats = [
  { value: "500+", label: "Startups Helped" },
  { value: "92%", label: "Success Rate" },
  { value: "50+", label: "Expert Consultants" },
  { value: "$2B+", label: "Funding Raised" },
]

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "/month",
    description: "Get started with the basics",
    features: [
      "1 startup profile",
      "Basic resources",
      "Community access",
      "1 consultation",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth Pro",
    price: "$49",
    period: "/month",
    description: "For serious founders",
    features: [
      "Unlimited startup profiles",
      "Premium resources & templates",
      "Priority consultations",
      "Custom roadmap",
      "AI-powered insights",
      "Dedicated consultant",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "For teams and accelerators",
    features: [
      "Everything in Growth Pro",
      "Team collaboration",
      "Custom integrations",
      "White-label options",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Globe className="size-4" />
                Trusted by 500+ startups worldwide
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-tight">
                Your Startup&apos;s{" "}
                <span className="gradient-text">Strategic Advantage</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Validate ideas, scale products, and make data-driven decisions with expert consulting and AI-powered insights. Clear strategy. Sustainable growth.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 w-full sm:w-auto text-base px-8 h-12"
                >
                  <Link href={session ? "/dashboard" : "/auth/signup"}>
                    {session ? "Go to Dashboard" : "Start Free Trial"}
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base px-8 h-12"
                  asChild
                >
                  <Link href="/services">See How It Works</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                Everything you need to{" "}
                <span className="gradient-text">launch & grow</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From idea validation to scaling, we provide the tools and expertise to guide your startup journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 sm:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                Loved by <span className="gradient-text">founders</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See what startup founders are saying about Upmind
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="p-6 rounded-2xl bg-card border shadow-sm"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {testimonial.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                Simple, transparent <span className="gradient-text">pricing</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that fits your startup stage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative p-6 rounded-2xl border shadow-sm ${
                    plan.popular
                      ? "border-purple-500 shadow-lg shadow-purple-500/10 scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-heading font-bold">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link
                      href={
                        plan.name === "Enterprise"
                          ? "/contact"
                          : session
                            ? "/dashboard/subscription"
                            : "/auth/signup"
                      }
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                  Ready to launch your startup?
                </h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Join 500+ founders who&apos;ve accelerated their growth with Upmind. Start your free trial today.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12"
                  >
                    <Link href={session ? "/dashboard" : "/auth/signup"}>
                      {session ? "Go to Dashboard" : "Start Free Trial"}
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
