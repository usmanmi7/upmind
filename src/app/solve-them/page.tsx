"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Users,
  Globe,
  Lock,
  X,
  SlidersHorizontal,
} from "lucide-react"
import PublicNavbar from "@/components/PublicNavbar"
import Footer from "@/components/Footer"
import {
  getAllProblems,
  getAllCategories,
  getAllTags,
  getProblemStats,
  filterProblems,
} from "@/lib/solve-them"
import type { DifficultyLevel, ProblemScope } from "@/lib/solve-them/types"

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

const scopeLabels: Record<ProblemScope, string> = {
  GLOBAL: "Global",
  REGIONAL: "Regional",
  NATIONAL: "National",
  LOCAL: "Local",
}

const projectTypeOptions = [
  "Startup",
  "Research",
  "Product",
  "Hardware",
  "NGO",
  "Open Source",
  "Government",
  "Infrastructure",
]

export default function SolveThemPage() {
  const allProblems = useMemo(() => getAllProblems(), [])
  const categories = useMemo(() => getAllCategories(), [])
  const allTags = useMemo(() => getAllTags(), [])
  const stats = useMemo(() => getProblemStats(), [])

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "ALL">("ALL")
  const [scope, setScope] = useState<ProblemScope | "ALL">("ALL")
  const [projectTypes, setProjectTypes] = useState<string[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<
    "impactScore" | "severity" | "innovationScore" | "marketNeed" | "futureImportance"
  >("impactScore")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(
    () =>
      filterProblems({
        query,
        category,
        difficulty,
        scope,
        tags: activeTags,
        sortBy,
      }).filter(
        (p) =>
          projectTypes.length === 0 ||
          projectTypes.some((t) => p.projectTypes.includes(t))
      ),
    [query, category, difficulty, scope, activeTags, projectTypes, sortBy]
  )

  const activeFilterCount =
    (category !== "All" ? 1 : 0) +
    (difficulty !== "ALL" ? 1 : 0) +
    (scope !== "ALL" ? 1 : 0) +
    projectTypes.length +
    activeTags.length

  const clearAll = () => {
    setQuery("")
    setCategory("All")
    setDifficulty("ALL")
    setScope("ALL")
    setProjectTypes([])
    setActiveTags([])
  }

  const toggleProjectType = (t: string) => {
    setProjectTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  const toggleTag = (t: string) => {
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

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

        {/* BODY: LEFT FILTERS + RIGHT GRID */}
        <section className="py-8 sm:py-12">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* LEFT FILTERS (desktop) */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-24 space-y-4">
                  <FiltersPanel
                    query={query}
                    setQuery={setQuery}
                    category={category}
                    setCategory={setCategory}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    scope={scope}
                    setScope={setScope}
                    projectTypes={projectTypes}
                    toggleProjectType={toggleProjectType}
                    activeTags={activeTags}
                    toggleTag={toggleTag}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    clearAll={clearAll}
                    activeFilterCount={activeFilterCount}
                    categories={categories}
                    allTags={allTags}
                    resultCount={filtered.length}
                    totalCount={allProblems.length}
                  />
                </div>
              </aside>

              {/* RIGHT: GRID */}
              <div className="flex-1 min-w-0">
                {/* Mobile: search bar + filter toggle */}
                <div className="lg:hidden mb-4 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search problems..."
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50"
                    />
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center gap-2 relative"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#7CFC00] text-[#0A150A] text-xs font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Result count + sort (desktop shows it inline) */}
                <div className="hidden lg:flex items-center justify-between mb-5">
                  <div className="text-sm text-white/60 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Showing <span className="text-white font-medium">{filtered.length}</span> of{" "}
                    {allProblems.length} problems
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-sm text-white/50 hover:text-white flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                    </button>
                  )}
                </div>

                {/* GRID */}
                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                      <Search className="w-8 h-8 text-white/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
                    <p className="text-white/60 mb-4">Try a different search or filter.</p>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                    {filtered.map((problem) => (
                      <ProblemCard key={problem.slug} problem={problem} />
                    ))}
                  </div>
                )}
              </div>
            </div>
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

      {/* MOBILE FILTERS DRAWER */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-sm h-full bg-[#0A150A] border-l border-white/10 overflow-y-auto">
            <div className="sticky top-0 bg-[#0A150A] border-b border-white/10 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4">
              <FiltersPanel
                query={query}
                setQuery={setQuery}
                category={category}
                setCategory={setCategory}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                scope={scope}
                setScope={setScope}
                projectTypes={projectTypes}
                toggleProjectType={toggleProjectType}
                activeTags={activeTags}
                toggleTag={toggleTag}
                sortBy={sortBy}
                setSortBy={setSortBy}
                clearAll={clearAll}
                activeFilterCount={activeFilterCount}
                categories={categories}
                allTags={allTags}
                resultCount={filtered.length}
                totalCount={allProblems.length}
                isMobile
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-4 w-full px-4 py-3 rounded-xl bg-[#7CFC00] text-[#0A150A] font-semibold hover:bg-[#6BE000]"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

function FiltersPanel({
  query,
  setQuery,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  scope,
  setScope,
  projectTypes,
  toggleProjectType,
  activeTags,
  toggleTag,
  sortBy,
  setSortBy,
  clearAll,
  activeFilterCount,
  categories,
  allTags,
  resultCount,
  totalCount,
  isMobile = false,
}: {
  query: string
  setQuery: (v: string) => void
  category: string
  setCategory: (v: string) => void
  difficulty: DifficultyLevel | "ALL"
  setDifficulty: (v: DifficultyLevel | "ALL") => void
  scope: ProblemScope | "ALL"
  setScope: (v: ProblemScope | "ALL") => void
  projectTypes: string[]
  toggleProjectType: (t: string) => void
  activeTags: string[]
  toggleTag: (t: string) => void
  sortBy: "impactScore" | "severity" | "innovationScore" | "marketNeed" | "futureImportance"
  setSortBy: (
    v: "impactScore" | "severity" | "innovationScore" | "marketNeed" | "futureImportance"
  ) => void
  clearAll: () => void
  activeFilterCount: number
  categories: string[]
  allTags: string[]
  resultCount: number
  totalCount: number
  isMobile?: boolean
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#7CFC00]" />
          Filters
          {activeFilterCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#7CFC00]/15 text-[#7CFC00] border border-[#7CFC00]/30">
              {activeFilterCount}
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems..."
          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50"
        />
      </div>

      {/* Sort */}
      <FilterGroup title="Sort by">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { value: "impactScore", label: "Impact" },
            { value: "severity", label: "Severity" },
            { value: "innovationScore", label: "Innovation" },
            { value: "marketNeed", label: "Market Need" },
            { value: "futureImportance", label: "Future" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setSortBy(opt.value as typeof sortBy)
              }
              className={`text-xs px-2.5 py-2 rounded-lg border transition-all text-left ${
                sortBy === opt.value
                  ? "bg-[#7CFC00]/15 text-[#7CFC00] border-[#7CFC00]/30"
                  : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Category */}
      <FilterGroup title="Category">
        <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1 sidebar-scroll">
          <button
            onClick={() => setCategory("All")}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              category === "All"
                ? "bg-[#7CFC00]/15 text-[#7CFC00]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            All Categories
            <span className="text-xs text-white/40">{totalCount}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                category === cat
                  ? "bg-[#7CFC00]/15 text-[#7CFC00]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="truncate">{cat}</span>
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Difficulty */}
      <FilterGroup title="Difficulty">
        <div className="space-y-1">
          <FilterRadio
            active={difficulty === "ALL"}
            onClick={() => setDifficulty("ALL")}
            label="All Difficulties"
          />
          {(["EASY", "MEDIUM", "HARD", "EXTREME"] as DifficultyLevel[]).map((d) => (
            <FilterRadio
              key={d}
              active={difficulty === d}
              onClick={() => setDifficulty(d)}
              label={difficultyLabels[d]}
              badgeClass={difficultyColors[d]}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Scope */}
      <FilterGroup title="Scope">
        <div className="space-y-1">
          <FilterRadio
            active={scope === "ALL"}
            onClick={() => setScope("ALL")}
            label="All Scopes"
          />
          {(["GLOBAL", "REGIONAL", "NATIONAL", "LOCAL"] as ProblemScope[]).map((s) => (
            <FilterRadio
              key={s}
              active={scope === s}
              onClick={() => setScope(s)}
              label={scopeLabels[s]}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Project type */}
      <FilterGroup title="Project Type">
        <div className="space-y-1">
          {projectTypeOptions.map((t) => (
            <button
              key={t}
              onClick={() => toggleProjectType(t)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                projectTypes.includes(t)
                  ? "bg-[#7CFC00]/15 text-[#7CFC00]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                  projectTypes.includes(t)
                    ? "bg-[#7CFC00] border-[#7CFC00] text-[#0A150A]"
                    : "border-white/20"
                }`}
              >
                {projectTypes.includes(t) ? "✓" : ""}
              </span>
              {t}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Tags */}
      {allTags.length > 0 && (
        <FilterGroup title="Tags">
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto sidebar-scroll">
            {allTags.slice(0, 30).map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`text-xs px-2 py-1 rounded-md border transition-all ${
                  activeTags.includes(t)
                    ? "bg-[#7CFC00]/15 text-[#7CFC00] border-[#7CFC00]/30"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Footer count */}
      {!isMobile && (
        <div className="pt-2 border-t border-white/5 text-xs text-white/40">
          <span className="text-white font-medium">{resultCount}</span> of {totalCount} problems
        </div>
      )}
    </div>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
      <h3 className="text-xs font-bold text-white/40 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  )
}

function FilterRadio({
  active,
  onClick,
  label,
  badgeClass,
}: {
  active: boolean
  onClick: () => void
  label: string
  badgeClass?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
        active ? "bg-[#7CFC00]/15 text-[#7CFC00]" : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
          active ? "border-[#7CFC00]" : "border-white/20"
        }`}
      >
        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#7CFC00]" />}
      </span>
      {label}
      {badgeClass && (
        <span
          className={`ml-auto text-[10px] px-1.5 py-0.5 rounded border ${badgeClass}`}
        >
          ●
        </span>
      )}
    </button>
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
