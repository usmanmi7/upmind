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
  Lock,
  ArrowRight,
  Clock,
  Eye,
  Calendar,
  SlidersHorizontal,
  X,
  Crown,
} from "lucide-react"
import * as React from "react"

const categories = ["All", "Startup Tips", "Marketing", "AI", "Funding", "Branding"]
const types = ["All", "Blog", "Template", "Video", "PDF", "Guide"]

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
  GUIDE: "bg-emerald-100 text-emerald-700",
}

interface Resource {
  id: string
  title: string
  slug: string
  description: string | null
  type: string
  category: string | null
  tags: string | null
  readTime: string | null
  coverImage: string | null
  thumbnailUrl: string | null
  isPremium: boolean
  downloadCount: number
  createdAt: string
  author: { id: string; name: string; image: string | null } | null
}

interface UserInfo {
  id: string
  role: string
  subscription: { plan: string; status: string } | null
}

export default function ResourcesPage() {
  const { data: session } = useSession()
  const [resources, setResources] = React.useState<Resource[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [activeType, setActiveType] = React.useState("All")
  const [filterPremium, setFilterPremium] = React.useState<"all" | "free" | "premium">("all")
  const [showFilters, setShowFilters] = React.useState(false)
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<"signin" | "upgrade">("signin")

  // Fetch resources from API
  React.useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = new URLSearchParams()
        if (activeType !== "All") params.set("type", activeType.toUpperCase())
        if (activeCategory !== "All") params.set("category", activeCategory)
        if (search) params.set("search", search)
        if (filterPremium !== "all") params.set("premium", filterPremium === "premium" ? "true" : "false")

        const res = await fetch(`/api/resources/public?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setResources(data.resources)
          setUserInfo(data.user)
        }
      } catch (err) {
        console.error("Failed to fetch resources:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [activeCategory, activeType, search, filterPremium])

  // Handle resource click - check auth and subscription
  const handleResourceClick = (resource: Resource, e: React.MouseEvent) => {
    // Not logged in - show sign in modal
    if (!session?.user) {
      e.preventDefault()
      setModalType("signin")
      setModalOpen(true)
      return
    }

    // Logged in but free plan trying to access premium - show upgrade modal
    if (resource.isPremium && userInfo) {
      const hasPaidPlan =
        userInfo.subscription &&
        userInfo.subscription.status === "ACTIVE" &&
        (userInfo.subscription.plan === "GROWTH_PRO" || userInfo.subscription.plan === "ENTERPRISE")
      const isAdmin = userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN"

      if (!hasPaidPlan && !isAdmin) {
        e.preventDefault()
        setModalType("upgrade")
        setModalOpen(true)
        return
      }
    }
  }

  const isPaidUser = userInfo?.subscription?.status === "ACTIVE" &&
    (userInfo.subscription.plan === "GROWTH_PRO" || userInfo.subscription.plan === "ENTERPRISE")

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <PageHero
          badge="Resources"
          title="Knowledge that"
          highlight="accelerates growth"
          description="Templates, guides, videos, and tools curated by experts to help you build, launch, and scale faster."
        />

        {/* Search & Filters */}
        <section className="py-12">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50/50 text-base focus:bg-white transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-12 rounded-xl px-5 gap-2 border-gray-200"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(activeCategory !== "All" || activeType !== "All" || filterPremium !== "all") && (
                  <span className="w-5 h-5 rounded-full bg-[#7CFC00] text-[#1A2E1A] text-xs flex items-center justify-center font-bold">
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
                className="mb-8 p-6 bg-gray-50 rounded-2xl space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1A2E1A]">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
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
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(cat)}
                        className={
                          activeCategory === cat
                            ? "bg-[#1A2E1A] text-white hover:bg-[#243824]"
                            : "border-gray-200"
                        }
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map((type) => (
                      <Button
                        key={type}
                        variant={activeType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveType(type)}
                        className={
                          activeType === type
                            ? "bg-[#1A2E1A] text-white hover:bg-[#243824]"
                            : "border-gray-200"
                        }
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Access */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Access</label>
                  <div className="flex gap-2">
                    {(["all", "free", "premium"] as const).map((val) => (
                      <Button
                        key={val}
                        variant={filterPremium === val ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterPremium(val)}
                        className={
                          filterPremium === val
                            ? "bg-[#1A2E1A] text-white hover:bg-[#243824]"
                            : "border-gray-200"
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
                <span className="text-sm text-gray-500">Active filters:</span>
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
              <p className="text-sm text-gray-500">
                {loading ? "Loading..." : `${resources.length} resource${resources.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {/* Resources Grid - Modern Blog Layout */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-2xl border p-6 space-y-4">
                      <div className="h-40 bg-gray-200 rounded-xl" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, i) => {
                  const Icon = typeIcons[resource.type] || BookOpen
                  const colorClass = typeColors[resource.type] || "bg-gray-100 text-gray-700"

                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/resources/${resource.slug}`}
                        onClick={(e) => handleResourceClick(resource, e)}
                        className="group block h-full"
                      >
                        <div className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 h-full flex flex-col">
                          {/* Cover Image / Placeholder */}
                          <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
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
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
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
                            {resource.category && (
                              <span className="text-xs font-medium text-[#7CFC00] tracking-wide uppercase mb-2">
                                {resource.category}
                              </span>
                            )}

                            {/* Title */}
                            <h3 className="text-lg font-bold text-[#1A2E1A] leading-snug mb-2 group-hover:text-[#2D4A2D] transition-colors line-clamp-2">
                              {resource.title}
                            </h3>

                            {/* Description */}
                            {resource.description && (
                              <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                                {resource.description}
                              </p>
                            )}

                            {/* Meta */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-3 text-xs text-gray-400">
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
                              <span className="text-sm font-medium text-[#2D4A2D] group-hover:text-[#7CFC00] transition-colors flex items-center gap-1">
                                {resource.isPremium && !isPaidUser ? "Unlock" : "Read"}
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No resources found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
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
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1A2E1A] to-[#2D4A2D] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#7CFC00]/10 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#7CFC00]/5 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#7CFC00]/20 flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-6 h-6 text-[#7CFC00]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Unlock all premium resources
                </h2>
                <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
                  Get unlimited access to templates, guides, and tools with a Growth Pro plan.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-[#7CFC00] text-[#1A2E1A] rounded-full px-8 py-3.5 text-base font-bold hover:shadow-lg hover:shadow-[#7CFC00]/20 transition-all"
                >
                  View Plans
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </div>
  )
}
