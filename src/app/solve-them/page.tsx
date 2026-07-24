"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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
  ArrowRight,
  Compass,
  Microscope,
  Hammer,
  Rocket,
  CheckCircle2,
} from "lucide-react"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import {
  getAllProblems,
  getAllCategories,
  getAllTags,
  getProblemStats,
  filterProblems,
} from "@/lib/solve-them"
import type { DifficultyLevel, ProblemScope } from "@/lib/solve-them/types"

const difficultyColors: Record<DifficultyLevel, string> = {
  EASY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-orange-100 text-orange-700",
  EXTREME: "bg-rose-100 text-rose-700",
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const processSteps = [
  {
    step: "01",
    icon: Compass,
    title: "Discover",
    description:
      "Browse curated world problems sourced from WHO, UN, IEA, IPCC and more. Filter by category, scope, and difficulty to find what resonates.",
  },
  {
    step: "02",
    icon: Microscope,
    title: "Analyze",
    description:
      "Open any problem to see severity, impact, market need, affected regions, and the engineering skills required to make a dent.",
  },
  {
    step: "03",
    icon: Hammer,
    title: "Build",
    description:
      "Use the recommended team templates, build roadmap, and starter solutions to launch a project that actually moves the needle.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Scale",
    description:
      "Open-source your work, attract collaborators through the Innovation Engine, and turn an engineering project into a real venture.",
  },
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
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Solve Them"
          title="Find problems"
          highlight="worth solving"
          description={`${stats.total}+ curated world problems across ${stats.categories} categories — each one a chance to build something that matters. Sourced from WHO, UN, IEA, IPCC, and more.`}
        />

        {/* STATS BAR */}
        <section className="pb-12">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Problems" value={`${stats.total}+`} />
              <StatCard label="Categories" value={`${stats.categories}`} />
              <StatCard label="People Affected" value={stats.totalPeopleAffected} />
              <StatCard label="Avg Impact" value={`${stats.avgImpact}/100`} />
            </div>
          </div>
        </section>

        {/* BODY: LEFT FILTERS + RIGHT GRID */}
        <section className="pb-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* LEFT FILTERS (desktop) */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 sidebar-scroll space-y-4">
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search problems..."
                      className="w-full pl-12 pr-4 py-3 bg-card border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50"
                    />
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="px-4 py-3 rounded-xl bg-card border text-foreground hover:bg-muted flex items-center gap-2 relative"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#7CFC00] text-[#1A2E1A] text-xs font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Result count + clear (desktop inline) */}
                <div className="hidden lg:flex items-center justify-between mb-5">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Showing <span className="text-foreground font-medium">{filtered.length}</span> of{" "}
                    {allProblems.length} problems
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                    </button>
                  )}
                </div>

                {/* GRID */}
                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No problems found</h3>
                    <p className="text-muted-foreground mb-4">Try a different search or filter.</p>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 rounded-xl bg-card border hover:bg-muted text-sm"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5"
                  >
                    {filtered.map((problem) => (
                      <motion.div key={problem.slug} variants={item}>
                        <ProblemCard problem={problem} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* HOW WE WORK */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                How <span className="gradient-text">Solve Them</span> Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                A four-step path from "I want to build something that matters" to a real engineering project.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="p-6 rounded-2xl bg-card border shadow-sm text-center h-full">
                    <div className="text-4xl font-bold gradient-text mb-4">{step.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="size-6 text-[#2D4A2D] dark:text-[#7CFC00]" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-muted-foreground/30">
                      <ArrowRight className="size-6" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Don&apos;t know where to start?</h2>
                <p className="mt-4 text-lg text-[#1A2E1A]/80 max-w-xl mx-auto">
                  Tell us your skills and interests. Our AI Innovation Engine will match you to problems
                  you&apos;re uniquely positioned to solve.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/dashboard/innovation-engine"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-[#2D4A2D] font-semibold hover:bg-white/90 shadow-xl text-base h-12"
                  >
                    <Sparkles className="w-5 h-5" />
                    Launch Innovation Engine
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
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
          <div className="relative ml-auto w-full max-w-sm h-full bg-background border-l overflow-y-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70"
              >
                <X className="w-5 h-5" />
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
                className="mt-4 w-full px-4 py-3 rounded-xl bg-[#7CFC00] text-[#1A2E1A] font-semibold hover:bg-[#6BE000]"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
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
        <h2 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#2D4A2D] dark:text-[#7CFC00]" />
          Filters
          {activeFilterCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#7CFC00]/15 text-[#2D4A2D] dark:text-[#7CFC00] border border-[#7CFC00]/30">
              {activeFilterCount}
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems..."
          className="w-full pl-10 pr-3 py-2.5 text-sm bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#7CFC00]/50"
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
              onClick={() => setSortBy(opt.value as typeof sortBy)}
              className={`text-xs px-2.5 py-2 rounded-lg border transition-all text-left ${
                sortBy === opt.value
                  ? "bg-[#2D4A2D] text-white border-[#2D4A2D] dark:bg-[#7CFC00]/15 dark:text-[#7CFC00] dark:border-[#7CFC00]/30"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
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
                ? "bg-[#2D4A2D]/10 text-[#2D4A2D] dark:bg-[#7CFC00]/15 dark:text-[#7CFC00]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Categories
            <span className="text-xs text-muted-foreground">{totalCount}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                category === cat
                  ? "bg-[#2D4A2D]/10 text-[#2D4A2D] dark:bg-[#7CFC00]/15 dark:text-[#7CFC00]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  ? "bg-[#2D4A2D]/10 text-[#2D4A2D] dark:bg-[#7CFC00]/15 dark:text-[#7CFC00]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                  projectTypes.includes(t)
                    ? "bg-[#7CFC00] border-[#7CFC00] text-[#1A2E1A]"
                    : "border-border"
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
                    ? "bg-[#2D4A2D]/10 text-[#2D4A2D] border-[#2D4A2D]/30 dark:bg-[#7CFC00]/15 dark:text-[#7CFC00] dark:border-[#7CFC00]/30"
                    : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
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
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{resultCount}</span> of {totalCount} problems
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
    <div className="p-4 rounded-xl bg-card border">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">{title}</h3>
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
        active
          ? "bg-[#2D4A2D]/10 text-[#2D4A2D] dark:bg-[#7CFC00]/15 dark:text-[#7CFC00]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
          active ? "border-[#2D4A2D] dark:border-[#7CFC00]" : "border-border"
        }`}
      >
        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#2D4A2D] dark:bg-[#7CFC00]" />}
      </span>
      {label}
      {badgeClass && (
        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${badgeClass}`}>
          ●
        </span>
      )}
    </button>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border shadow-sm">
      <div className="text-2xl sm:text-3xl font-bold gradient-text">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

function ProblemCard({ problem }: { problem: ReturnType<typeof getAllProblems>[0] }) {
  return (
    <Link
      href={`/solve-them/${problem.slug}`}
      className="group p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      {/* Category + difficulty */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#7CFC00]/10 text-[#2D4A2D] dark:text-[#7CFC00] border border-[#7CFC00]/20">
          {problem.category}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[problem.difficultyLevel]}`}
        >
          {difficultyLabels[problem.difficultyLevel]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-heading font-semibold mb-2 group-hover:text-[#2D4A2D] dark:group-hover:text-[#7CFC00] transition-colors line-clamp-2">
        {problem.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
        {problem.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {problem.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {problem.tags.length > 3 && (
          <span className="text-xs px-2 py-0.5 text-muted-foreground">+{problem.tags.length - 3}</span>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t">
        <Metric icon={AlertCircle} label="Severity" value={problem.severity} color="text-rose-500" />
        <Metric icon={TrendingUp} label="Impact" value={problem.impactScore} color="text-emerald-500" />
        <Metric icon={Sparkles} label="Innovation" value={problem.innovationScore} color="text-amber-500" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
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
      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/70">
        <Lock className="w-3 h-3" />
        Solutions, skills, team templates & roadmap unlocked on detail page
        <CheckCircle2 className="w-3 h-3 ml-auto text-[#2D4A2D] dark:text-[#7CFC00]" />
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
      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
        <Icon className={`w-3 h-3 ${color}`} />
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
    </div>
  )
}
