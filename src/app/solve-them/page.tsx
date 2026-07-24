"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, TrendingUp, AlertCircle, Sparkles, Users, Globe, Lock } from "lucide-react"
import PublicNavbar from "@/components/PublicNavbar"
import Footer from "@/components/Footer"
import {
  getAllProblems,
  getAllCategories,
  getProblemStats,
  filterProblems,
} from "@/lib/solve-them"
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

export default function SolveThemPage() {
  const allProblems = useMemo(() => getAllProblems(), [])
  const categories = useMemo(() => getAllCategories(), [])
  const stats = useMemo(() => getProblemStats(), [])

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "ALL">("ALL")
  const [sortBy, setSortBy] = useState<
    "impactScore" | "severity" | "innovationScore" | "marketNeed" | "futureImportance"
  >("impactScore")

  const filtered = useMemo(
    () =>
      filterProblems({
        query,
        category,
        difficulty,
        sortBy,
      }),
    [query, category, difficulty, sortBy]
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#0A150A]">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(124,252,0,0.15), transparent 50%), radial-gradient(circle at 70% 70%, rgba(34,197,94,0.1), transparent 50%)",
            }}
          />
          <div className="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7CFC00]/10 border border-[#7CFC00]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#7CFC00]" />
              <span className="text-sm text-[#7CFC00] font-medium">
                Engineering Innovation Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 font-heading">
              Find Problems
              <br />
              <span className="bg-gradient-to-r from-[#7CFC00] to-emerald-400 bg-clip-text text-transparent">
                Worth Solving
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/70 mb-10">
              {stats.total}+ curated world problems. Each one is a chance to build something that
              matters. Find the one that matches your skills and start innovating.
            </p>

            {/* STATS BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
              <StatCard label="Problems" value={`${stats.total}+`} />
              <StatCard label="Categories" value={`${stats.categories}`} />
              <StatCard label="People Affected" value={stats.totalPeopleAffected} />
              <StatCard label="Avg Impact" value={`${stats.avgImpact}/100`} />
            </div>
          </div>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="sticky top-16 sm:top-20 z-30 bg-[#0A150A]/95 backdrop-blur-lg border-y border-white/5 py-4">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search problems, tags, technologies..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50 focus:border-[#7CFC00]/50 transition-all"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50 focus:border-[#7CFC00]/50 transition-all min-w-[180px]"
              >
                <option value="All" className="bg-[#1A2E1A]">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1A2E1A]">
                    {cat}
                  </option>
                ))}
              </select>

              {/* Difficulty */}
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | "ALL")}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50 focus:border-[#7CFC00]/50 transition-all min-w-[140px]"
              >
                <option value="ALL" className="bg-[#1A2E1A]">All Difficulties</option>
                <option value="EASY" className="bg-[#1A2E1A]">Easy</option>
                <option value="MEDIUM" className="bg-[#1A2E1A]">Medium</option>
                <option value="HARD" className="bg-[#1A2E1A]">Hard</option>
                <option value="EXTREME" className="bg-[#1A2E1A]">Frontier</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50 focus:border-[#7CFC00]/50 transition-all min-w-[160px]"
              >
                <option value="impactScore" className="bg-[#1A2E1A]">Sort: Impact</option>
                <option value="severity" className="bg-[#1A2E1A]">Sort: Severity</option>
                <option value="innovationScore" className="bg-[#1A2E1A]">Sort: Innovation</option>
                <option value="marketNeed" className="bg-[#1A2E1A]">Sort: Market Need</option>
                <option value="futureImportance" className="bg-[#1A2E1A]">Sort: Future</option>
              </select>
            </div>

            <div className="mt-3 text-sm text-white/50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Showing <span className="text-white font-medium">{filtered.length}</span> of{" "}
              {allProblems.length} problems
            </div>
          </div>
        </section>

        {/* PROBLEM GRID */}
        <section className="py-12 sm:py-16">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                  <Search className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
                <p className="text-white/60">Try a different search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((problem) => (
                  <ProblemCard key={problem.slug} problem={problem} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-heading">
              Don&apos;t know where to start?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Tell us your skills and interests. Our AI Innovation Engine will match you to problems
              you&apos;re uniquely positioned to solve.
            </p>
            <Link
              href="/dashboard/innovation-engine"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7CFC00] text-[#0A150A] font-semibold hover:bg-[#6BE000] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Launch Innovation Engine
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="text-2xl sm:text-3xl font-bold text-[#7CFC00]">{value}</div>
      <div className="text-sm text-white/60 mt-1">{label}</div>
    </div>
  )
}

function ProblemCard({ problem }: { problem: ReturnType<typeof getAllProblems>[0] }) {
  return (
    <Link
      href={`/solve-them/${problem.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#7CFC00]/40 hover:bg-white/[0.07] transition-all overflow-hidden"
    >
      {/* Category badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#7CFC00]/10 text-[#7CFC00] border border-[#7CFC00]/20">
          {problem.category}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${difficultyColors[problem.difficultyLevel]}`}
        >
          {difficultyLabels[problem.difficultyLevel]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#7CFC00] transition-colors line-clamp-2">
        {problem.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-white/60 mb-4 line-clamp-3 flex-1">{problem.summary}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {problem.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/5"
          >
            {tag}
          </span>
        ))}
        {problem.tags.length > 3 && (
          <span className="text-xs px-2 py-0.5 text-white/40">+{problem.tags.length - 3}</span>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-white/5">
        <Metric icon={AlertCircle} label="Severity" value={problem.severity} color="text-rose-400" />
        <Metric icon={TrendingUp} label="Impact" value={problem.impactScore} color="text-emerald-400" />
        <Metric icon={Sparkles} label="Innovation" value={problem.innovationScore} color="text-amber-400" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {problem.teamTemplates[0]?.minMembers || 3}+ engineers
        </span>
        <span className="flex items-center gap-1">
          {problem.estimatedTimelineMonths ? `${problem.estimatedTimelineMonths}mo` : "—"}
          <Globe className="w-3 h-3 ml-2" />
          {problem.scope}
        </span>
      </div>

      {/* Locked indicator */}
      <div className="mt-3 flex items-center gap-1 text-xs text-white/30">
        <Lock className="w-3 h-3" />
        Solutions, skills, team templates & roadmap unlocked on detail page
      </div>
    </Link>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof TrendingUp
  label: string
  value: number
  color: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-white/40 mb-0.5">
        <Icon className={`w-3 h-3 ${color}`} />
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
    </div>
  )
}
