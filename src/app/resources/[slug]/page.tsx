"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import SubscriptionModal from "@/components/SubscriptionModal"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Download,
  GraduationCap,
  Clock,
  Eye,
  Calendar,
  Crown,
  Lock,
  Share2,
  Bookmark,
  ArrowRight,
  Check,
} from "lucide-react"
import * as React from "react"

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

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const slug = params.slug as string

  const [resource, setResource] = React.useState<any>(null)
  const [accessLevel, setAccessLevel] = React.useState<string>("none")
  const [userInfo, setUserInfo] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<"signin" | "upgrade">("signin")
  const [relatedResources, setRelatedResources] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`/api/resources/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setResource(data.resource)
          setAccessLevel(data.resource.accessLevel)
          setUserInfo(data.user)

          // Fetch related resources
          if (data.resource.category) {
            const relatedRes = await fetch(
              `/api/resources/public?category=${data.resource.category}&limit=3`
            )
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json()
              setRelatedResources(
                relatedData.resources.filter((r: any) => r.id !== data.resource.id).slice(0, 3)
              )
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch resource:", err)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchResource()
  }, [slug])

  // Auto-show modal for restricted access
  React.useEffect(() => {
    if (!loading && resource) {
      if (accessLevel === "none") {
        setModalType("signin")
        setModalOpen(true)
      } else if (accessLevel === "preview") {
        setModalType("upgrade")
        setModalOpen(true)
      }
    }
  }, [loading, resource, accessLevel])

  const isPaidUser = userInfo?.subscription?.status === "ACTIVE" &&
    (userInfo.subscription.plan === "GROWTH_PRO" || userInfo.subscription.plan === "ENTERPRISE")

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <main className="flex-1 pt-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-64 bg-gray-200 rounded-xl" />
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Resource not found</h2>
            <p className="text-gray-500 mb-6">The resource you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-6 py-3 font-medium hover:bg-[#243824] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Link>
          </div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  const Icon = typeIcons[resource.type] || BookOpen
  const colorClass = typeColors[resource.type] || "bg-gray-100 text-gray-700"
  const isLocked = accessLevel === "none" || accessLevel === "preview"

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-8 pb-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/resources" className="hover:text-[#2D4A2D] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Resources
            </Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-xs">{resource.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Header */}
                <header className="mb-8">
                  {/* Type & Category */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                      <Icon className="w-3 h-3" />
                      {resource.type}
                    </span>
                    {resource.category && (
                      <span className="text-xs font-medium text-[#7CFC00] tracking-wide uppercase">
                        {resource.category}
                      </span>
                    )}
                    {resource.isPremium && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs font-bold px-3 py-1 rounded-full">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2E1A] leading-tight mb-4">
                    {resource.title}
                  </h1>

                  {/* Description */}
                  {resource.description && (
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {resource.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100">
                    {resource.author && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2D4A2D] flex items-center justify-center text-white text-xs font-bold">
                          {resource.author.name.charAt(0)}
                        </div>
                        <span className="text-gray-600 font-medium">{resource.author.name}</span>
                      </div>
                    )}
                    {resource.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(resource.createdAt)}
                      </span>
                    )}
                    {resource.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {resource.readTime}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {resource.downloadCount} views
                    </span>
                  </div>
                </header>

                {/* Cover Image */}
                {resource.coverImage && (
                  <div className="relative rounded-2xl overflow-hidden mb-8">
                    <img
                      src={resource.coverImage}
                      alt={resource.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="article-content">
                  {resource.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{resource.content}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-500">No content available for this resource.</p>
                  )}
                </div>

                {/* Blur overlay for locked content */}
                {isLocked && resource.content && (
                  <div className="relative mt-[-200px] h-[200px]" style={{
                    background: "linear-gradient(to bottom, transparent, white)",
                  }}>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-8">
                      <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#1A2E1A] flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#7CFC00]" />
                        </div>
                        <p className="text-gray-700 font-semibold">
                          {accessLevel === "none"
                            ? "Sign in to read the full article"
                            : "Upgrade to access premium content"}
                        </p>
                        {accessLevel === "none" ? (
                          <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-[#243824] transition-colors"
                          >
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] rounded-full px-6 py-2.5 text-sm font-bold hover:shadow-lg transition-all"
                          >
                            <Crown className="w-4 h-4" />
                            Upgrade to Pro
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {resource.tags && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.split(",").map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Author Card */}
                {resource.author && (
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Author</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#2D4A2D] flex items-center justify-center text-white font-bold text-lg">
                        {resource.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A2E1A]">{resource.author.name}</p>
                        {resource.author.bio && (
                          <p className="text-xs text-gray-500 line-clamp-2">{resource.author.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Premium CTA Card */}
                {!isPaidUser && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1A2E1A] to-[#2D4A2D] text-white">
                    <div className="w-10 h-10 rounded-xl bg-[#7CFC00]/20 flex items-center justify-center mb-4">
                      <Crown className="w-5 h-5 text-[#7CFC00]" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Get full access</h3>
                    <p className="text-white/70 text-sm mb-4">
                      Upgrade to Growth Pro to unlock all premium resources, consultations, and AI-powered insights.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {["Premium resources", "4 consultations/mo", "AI insights", "Custom roadmap"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                          <Check className="w-3.5 h-3.5 text-[#7CFC00]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/pricing"
                      className="w-full flex items-center justify-center gap-2 bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 py-3 text-sm font-bold hover:shadow-lg hover:shadow-[#7CFC00]/20 transition-all"
                    >
                      Upgrade Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Related Resources */}
                {relatedResources.length > 0 && (
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Related</h3>
                    <div className="space-y-4">
                      {relatedResources.map((related: any) => {
                        const RIcon = typeIcons[related.type] || BookOpen
                        return (
                          <Link
                            key={related.id}
                            href={`/resources/${related.slug}`}
                            className="group block"
                          >
                            <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7CFC00]/10 transition-colors">
                                <RIcon className="w-4 h-4 text-gray-400 group-hover:text-[#2D4A2D] transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-[#1A2E1A] leading-snug line-clamp-2 group-hover:text-[#2D4A2D] transition-colors">
                                  {related.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {related.readTime && (
                                    <span className="text-xs text-gray-400">{related.readTime}</span>
                                  )}
                                  {related.isPremium && (
                                    <Crown className="w-3 h-3 text-[#7CFC00]" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
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
