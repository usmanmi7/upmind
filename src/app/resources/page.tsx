"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
import SubscriptionModal from "@/components/SubscriptionModal"
import { motion } from "framer-motion"
import {
  Search,
  BookOpen,
  FileText,
  Video,
  Download,
  GraduationCap,
  ArrowRight,
  Clock,
  Eye,
  SlidersHorizontal,
  X,
  Crown,
  Sparkles,
} from "lucide-react"
import * as React from "react"
import {
  getAllResources,
  filterResources,
  getResourceCategories,
  type ResourceType,
} from "@/lib/resources"
import { RESOURCE_CATEGORIES, RESOURCE_TYPES } from "@/lib/resources-data"

const typeIcons: Record<string, React.ElementType> = {
  BLOG: BookOpen,
  TEMPLATE: FileText,
  VIDEO: Video,
  PDF: Download,
  GUIDE: GraduationCap,
}

const typeColors: Record<string, string> = {
  BLOG: "bg-blue-100 text-blue-700",
  TEMPLATE: "bg-purple-100 text-purple-700",
  VIDEO: "bg-red-100 text-red-700",
  PDF: "bg-orange-100 text-orange-700",
  GUIDE: "bg-blue-100 text-blue-700",
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function ResourcesPage() {
  const { data: session } = useSession()
  const [search, setSearch] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState<string>("All")
  const [activeType, setActiveType] = React.useState<ResourceType | "All">("All")
  const [filterPremium, setFilterPremium] = React.useState<"all" | "free" | "premium">("all")
  const [showFilters, setShowFilters] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<"signin" | "upgrade">("signin")

  const allCategories = React.useMemo(() => getResourceCategories(), [])
  const categories = React.useMemo(
    () => ["All", ...allCategories] as readonly string[],
    [allCategories]
  )
  const types = React.useMemo(
    () => ["All", ...RESOURCE_TYPES] as const,
    []
  )

  // Get filtered resources from static dataset
  const resources = React.useMemo(
    () =>
      filterResources({
        query: search,
        category: activeCategory,
        type: activeType,
        isPremium: filterPremium,
      }),
    [search, activeCategory, activeType, filterPremium]
  )

  const handleResourceClick = () => {
    // No-op — detail page handles auth overlay
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Resources"
          title="Playbooks for"
          highlight="engineering innovators"
          description="Field guides, templates, and frameworks for engineers who want to build things that matter — sourced from real-world problem solving, not generic startup advice."
        />

        {/* Search & Filters */}
        <section className="py-12">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-12 h-12 rounded-xl text-base focus:bg-card transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-12 rounded-xl px-5 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(activeCategory !== "All" || activeType !== "All" || filterPremium !== "all") && (
                  <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-xs flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </Button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-muted/50 rounded-2xl space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => {
                      setActiveCategory("All")
                      setActiveType("All")
                      setFilterPremium("all")
                    }}
                  >
                    Clear all
                  </Button>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(cat)}
                        className={
                          activeCategory === cat
                            ? "bg-[#0F1B3D] text-white hover:bg-[#1E3A8A]"
                            : ""
                        }
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map((type) => (
                      <Button
                        key={type}
                        variant={activeType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveType(type as ResourceType | "All")}
                        className={
                          activeType === type
                            ? "bg-[#0F1B3D] text-white hover:bg-[#1E3A8A]"
                            : ""
                        }
                      >
                        {type === "All" ? "All" : type.charAt(0) + type.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Access */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Access</label>
                  <div className="flex gap-2">
                    {(["all", "free", "premium"] as const).map((val) => (
                      <Button
                        key={val}
                        variant={filterPremium === val ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterPremium(val)}
                        className={
                          filterPremium === val
                            ? "bg-[#0F1B3D] text-white hover:bg-[#1E3A8A]"
                            : ""
                        }
                      >
                        {val === "all" ? "All" : val === "free" ? "Free" : "Premium"}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Active filter tags */}
            {(activeCategory !== "All" || activeType !== "All" || filterPremium !== "all") && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeCategory !== "All" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {activeCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveCategory("All")} />
                  </Badge>
                )}
                {activeType !== "All" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {activeType}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveType("All")} />
                  </Badge>
                )}
                {filterPremium !== "all" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {filterPremium}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterPremium("all")} />
                  </Badge>
                )}
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {resources.length} resource{resources.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Resources Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {resources.map((resource, i) => {
                const Icon = typeIcons[resource.type] || BookOpen
                const colorClass = typeColors[resource.type] || "bg-gray-100 text-gray-700"

                return (
                  <motion.div key={resource.id} variants={item}>
                    <Link
                      href={`/resources/${resource.slug}`}
                      onClick={handleResourceClick}
                      className="group block h-full"
                    >
                      <div className="relative rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        {/* Cover Image / Placeholder */}
                        <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                          {resource.coverImage ? (
                            <img
                              src={resource.coverImage}
                              alt={resource.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className={`w-16 h-16 rounded-2xl ${colorClass} flex items-center justify-center`}>
                                <Icon className="w-8 h-8" />
                              </div>
                            </div>
                          )}
                          {/* Premium badge */}
                          {resource.isPremium && (
                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                <Crown className="w-3 h-3" />
                                Premium
                              </span>
                            </div>
                          )}
                          {/* Type badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                              <Icon className="w-3 h-3" />
                              {resource.type}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          {/* Category */}
                          <span className="text-xs font-medium text-[#1E3A8A] dark:text-[#3B82F6] tracking-wide uppercase mb-2">
                            {resource.category}
                          </span>

                          {/* Title */}
                          <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-[#1E3A8A] dark:group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                            {resource.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
                            {resource.description}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {resource.readTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {resource.readTime}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {resource.downloadCount}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-[#1E3A8A] dark:text-[#3B82F6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Read
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {resources.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("")
                    setActiveCategory("All")
                    setActiveType("All")
                    setFilterPremium("all")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F1B3D] to-[#1E3A8A] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#3B82F6]/10 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#3B82F6]/5 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Find a problem worth your skills
                </h2>
                <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
                  These resources pair with our Solve Them database — 30+ curated world problems matched to your engineering skills.
                </p>
                <Link
                  href="/solve-them"
                  className="inline-flex items-center gap-2 bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-base font-bold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
                >
                  Browse Problems
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* Upgrade Modal - for logged-in free users clicking premium */}
      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </div>
  )
}
