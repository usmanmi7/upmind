"use client"

import { useState, useMemo } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ArrowLeft,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Users,
  Globe,
  Lock,
  CheckCircle2,
  Target,
  Lightbulb,
  Rocket,
  Wrench,
  MapPin,
  Calendar,
  Award,
  Brain,
  ArrowRight,
} from "lucide-react"
import PublicNavbar from "@/components/PublicNavbar"
import Footer from "@/components/Footer"
import { getProblemBySlug } from "@/lib/solve-them"
import type { DifficultyLevel } from "@/lib/solve-them/types"

const difficultyColors: Record<DifficultyLevel, string> = {
  EASY: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  MEDIUM: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  HARD: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  EXTREME: "bg-rose-500/15 text-rose-300 border-rose-500/30",
}

const difficultyLabels: Record<DifficultyLevel, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
  EXTREME: "Frontier",
}

export default function ProblemDetailPage() {
  const params = useParams<{ slug: string }>()
  const { data: session } = useSession()
  const problem = useMemo(
    () => getProblemBySlug(params.slug as string),
    [params.slug]
  )

  if (!problem) {
    notFound()
  }

  const isSignedIn = !!session

  return (
    <div className="min-h-screen flex flex-col bg-[#0A150A]">
      <PublicNavbar />

      <main className="flex-1">
        {/* BACK LINK */}
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/solve-them"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all problems
          </Link>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden pb-12">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 20% 0%, rgba(124,252,0,0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(34,197,94,0.1), transparent 50%)",
            }}
          />
          <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#7CFC00]/10 text-[#7CFC00] border border-[#7CFC00]/20">
                {problem.category}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full border ${difficultyColors[problem.difficultyLevel]}`}
              >
                {difficultyLabels[problem.difficultyLevel]} ({problem.difficulty}/10)
              </span>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {problem.scope}
              </span>
              {problem.estimatedTimelineMonths && (
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  ~{problem.estimatedTimelineMonths} months
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 font-heading">
              {problem.title}
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-white/70 mb-8">{problem.summary}</p>

            {/* AFFECTED */}
            {problem.peopleAffected && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Affects <span className="font-bold">{problem.peopleAffected}</span> people
                </span>
              </div>
            )}
          </div>
        </section>

        {/* METRICS GRID */}
        <section className="py-8 border-y border-white/5">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              <MetricBar icon={AlertCircle} label="Severity" value={problem.severity} color="bg-rose-500" />
              <MetricBar icon={Target} label="Impact" value={problem.impactScore} color="bg-emerald-500" />
              <MetricBar icon={Lightbulb} label="Innovation" value={problem.innovationScore} color="bg-amber-500" />
              <MetricBar icon={TrendingUp} label="Market Need" value={problem.marketNeed} color="bg-blue-500" />
              <MetricBar icon={Globe} label="Global Demand" value={problem.globalDemand} color="bg-cyan-500" />
              <MetricBar icon={Award} label="Future Importance" value={problem.futureImportance} color="bg-purple-500" />
              <MetricBar icon={Wrench} label="Difficulty" value={problem.difficulty * 10} color="bg-orange-500" />
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="py-12">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAIN COLUMN */}
            <div className="lg:col-span-2 space-y-12">
              {/* DESCRIPTION */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">The Problem</h2>
                <p className="text-white/70 leading-relaxed whitespace-pre-line">{problem.description}</p>
              </div>

              {/* REGIONS & AFFECTED */}
              {(problem.regions.length > 0 || problem.countriesAffected.length > 0) && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-heading flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-[#7CFC00]" />
                    Where It Hits
                  </h2>
                  {problem.regions.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm text-white/50 mb-2">Regions</div>
                      <div className="flex flex-wrap gap-2">
                        {problem.regions.map((r) => (
                          <span
                            key={r}
                            className="px-3 py-1 rounded-full bg-white/5 text-white/70 border border-white/10 text-sm"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {problem.countriesAffected.length > 0 && (
                    <div>
                      <div className="text-sm text-white/50 mb-2">Most Affected Countries</div>
                      <div className="flex flex-wrap gap-2">
                        {problem.countriesAffected.map((c) => (
                          <span
                            key={c}
                            className="px-3 py-1 rounded-full bg-white/5 text-white/70 border border-white/10 text-sm"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOLUTIONS — LOCKED */}
              <LockedSection
                title="Engineering Solutions"
                icon={Lightbulb}
                description="Concrete things engineers can build to address this problem."
                isSignedIn={isSignedIn}
                items={problem.solutions.map((s) => ({
                  title: s.title,
                  body: s.description,
                }))}
              />

              {/* ROADMAP — LOCKED */}
              <LockedSection
                title="Build Roadmap"
                icon={Rocket}
                description="Phased plan from research to scale. The realistic path to impact."
                isSignedIn={isSignedIn}
                phases={problem.roadmaps.map((r) => ({
                  phase: r.phase,
                  title: r.title,
                  description: r.description,
                  duration: r.duration,
                }))}
              />

              {/* SKILLS — LOCKED */}
              <LockedSection
                title="Skills Required"
                icon={Brain}
                description="What you need to know to take this on."
                isSignedIn={isSignedIn}
                skills={problem.skills.map((s) => ({
                  skill: s.skill,
                  importance: s.importance,
                }))}
              />

              {/* TEAM TEMPLATES — LOCKED */}
              <LockedSection
                title="Recommended Team"
                icon={Users}
                description="Roles you need on the team and rough timeline."
                isSignedIn={isSignedIn}
                teams={problem.teamTemplates.map((t) => ({
                  templateName: t.templateName,
                  minMembers: t.minMembers,
                  maxMembers: t.maxMembers,
                  estimatedTimelineMonths: t.estimatedTimelineMonths,
                  roles: t.roles,
                }))}
              />
            </div>

            {/* SIDEBAR */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* CTAs */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7CFC00]/10 to-emerald-500/5 border border-[#7CFC00]/30">
                  <h3 className="text-lg font-bold text-white mb-2">Ready to take this on?</h3>
                  <p className="text-sm text-white/60 mb-4">
                    {isSignedIn
                      ? "Run this through the AI Innovation Engine to validate your match."
                      : "Sign in to unlock solutions, roadmap, skills, and team templates."}
                  </p>
                  {isSignedIn ? (
                    <Link
                      href={`/dashboard/innovation-engine?problem=${problem.slug}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#7CFC00] text-[#0A150A] font-semibold hover:bg-[#6BE000] transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      Check My Match
                    </Link>
                  ) : (
                    <Link
                      href={`/auth/signin?callbackUrl=/solve-them/${problem.slug}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#7CFC00] text-[#0A150A] font-semibold hover:bg-[#6BE000] transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      Sign in to unlock
                    </Link>
                  )}
                  <Link
                    href="/dashboard/ai-assistant"
                    className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                  >
                    <Brain className="w-4 h-4" />
                    Ask AI about this
                  </Link>
                </div>

                {/* SOURCE */}
                {problem.source && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Source</div>
                    <div className="text-sm text-white/80 font-medium">{problem.source}</div>
                    {problem.sourceUrl && (
                      <a
                        href={problem.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-[#7CFC00] hover:underline"
                      >
                        Open source <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* PROJECT TYPES */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Best Suited For</div>
                  <div className="flex flex-wrap gap-2">
                    {problem.projectTypes.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#7CFC00]/10 text-[#7CFC00] border border-[#7CFC00]/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ENGINEER SOLVABLE NOTE */}
                {problem.engineerSolvableNote && (
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <div className="text-xs uppercase tracking-wide text-amber-300/70 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Engineer&apos;s Note
                    </div>
                    <div className="text-sm text-white/70">{problem.engineerSolvableNote}</div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function MetricBar({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof AlertCircle
  label: string
  value: number
  color: string
}) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-1.5 text-white/50 mb-2">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-wide font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold text-white mb-2">{value}</div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function LockedSection({
  title,
  icon: Icon,
  description,
  isSignedIn,
  items,
  phases,
  skills,
  teams,
}: {
  title: string
  icon: typeof Lightbulb
  description: string
  isSignedIn: boolean
  items?: { title: string; body: string }[]
  phases?: { phase: string; title: string; description: string; duration?: string }[]
  skills?: { skill: string; importance: number }[]
  teams?: {
    templateName: string
    minMembers: number
    maxMembers: number
    estimatedTimelineMonths?: number
    roles: string[]
  }[]
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1 font-heading flex items-center gap-2">
        <Icon className="w-6 h-6 text-[#7CFC00]" />
        {title}
      </h2>
      <p className="text-white/50 text-sm mb-5">{description}</p>

      {!isSignedIn ? (
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-dashed border-white/15 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3">
            <Lock className="w-5 h-5 text-white/40" />
          </div>
          <div className="text-white font-medium mb-1">Sign in to unlock</div>
          <p className="text-sm text-white/50 mb-4 max-w-sm mx-auto">
            Detailed {title.toLowerCase()} are available to signed-in engineers.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7CFC00] text-[#0A150A] text-sm font-semibold hover:bg-[#6BE000] transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            Sign in
          </Link>
        </div>
      ) : items ? (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#7CFC00]/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7CFC00]/10 text-[#7CFC00] flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">{item.title}</div>
                  <p className="text-sm text-white/60">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : phases ? (
        <div className="space-y-3">
          {phases.map((p, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#7CFC00]/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7CFC00]/10 text-[#7CFC00] flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-wide text-[#7CFC00] font-bold">
                      {p.phase}
                    </span>
                    {p.duration && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                        {p.duration}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-white mb-1">{p.title}</div>
                  <p className="text-sm text-white/60">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : skills ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#7CFC00]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{s.skill}</span>
                <span className="text-xs text-white/50">{s.importance}/10</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7CFC00] to-emerald-400 rounded-full"
                  style={{ width: `${s.importance * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : teams ? (
        <div className="space-y-3">
          {teams.map((t, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#7CFC00]/30 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="font-bold text-white">{t.templateName}</span>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {t.minMembers}–{t.maxMembers}
                  </span>
                  {t.estimatedTimelineMonths && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {t.estimatedTimelineMonths}mo
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.roles.map((r) => (
                  <span
                    key={r}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#7CFC00]/10 text-[#7CFC00] border border-[#7CFC00]/20"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
