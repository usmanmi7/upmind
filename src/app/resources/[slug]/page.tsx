"use client"

import { useParams } from "next/navigation"
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
  ArrowRight,
  Check,
  Sparkles,
  X,
} from "lucide-react"
import * as React from "react"
import {
  getResourceBySlug,
  getRelatedResources,
} from "@/lib/resources"
import type { EngineeringResource } from "@/lib/resources-data"

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

export default function ResourceDetailPage() {
  const params = useParams()
  const { data: session, status } = useSession()
  const slug = params.slug as string

  const resource = React.useMemo<EngineeringResource | undefined>(
    () => getResourceBySlug(slug),
    [slug]
  )
  const relatedResources = React.useMemo(
    () => (resource ? getRelatedResources(slug, 3) : []),
    [slug, resource]
  )

  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState<"signin" | "upgrade">("signin")

  // Timed overlay for non-logged-in users
  const [showAuthOverlay, setShowAuthOverlay] = React.useState(false)

  React.useEffect(() => {
    if (status === "unauthenticated") {
      const timer = setTimeout(() => {
        setShowAuthOverlay(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Resource not found</h2>
            <p className="text-muted-foreground mb-6">The resource you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 bg-[#0F1B3D] text-white rounded-full px-6 py-3 font-medium hover:bg-[#1E3A8A] transition-colors"
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
  // All resources are currently free in our static dataset; show full content
  // to logged-in users, and a preview with overlay to anonymous users.
  const isLocked = status === "unauthenticated"

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 pt-8 pb-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/resources" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Resources
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-xs">{resource.title}</span>
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
                    <span className="text-xs font-medium text-[#1E3A8A] dark:text-[#3B82F6] tracking-wide uppercase">
                      {resource.category}
                    </span>
                    {resource.isPremium && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#0F1B3D] text-xs font-bold px-3 py-1 rounded-full">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                    {resource.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {resource.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b">
                    {resource.author && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-bold">
                          {resource.author.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{resource.author.name}</span>
                      </div>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(resource.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {resource.readTime}
                    </span>
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
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {isLocked
                      ? resource.content.split("\n\n").slice(0, 3).join("\n\n") + "\n\n..."
                      : resource.content}
                  </ReactMarkdown>
                </div>

                {/* Auth overlay for non-logged-in users */}
                {isLocked && (
                  <div className="relative mt-12">
                    <div
                      className="absolute -top-32 left-0 right-0 h-32 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent, var(--background))",
                      }}
                    />
                    <div className="text-center py-8 px-6 rounded-2xl border bg-card">
                      <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#0F1B3D] flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <p className="font-semibold">
                          Sign in to read the full article
                        </p>
                        <Link
                          href="/auth/login"
                          className="inline-flex items-center gap-2 bg-[#0F1B3D] text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-[#1E3A8A] transition-colors"
                        >
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {resource.tags && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full"
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
                  <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Author</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-lg">
                        {resource.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{resource.author.name}</p>
                        {resource.author.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{resource.author.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Innovation Engine CTA */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F1B3D] to-[#1E3A8A] text-white">
                  <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Find a problem for your skills</h3>
                  <p className="text-white/70 text-sm mb-4">
                    The Innovation Engine matches your engineering skills to real-world problems you can solve.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["30+ curated problems", "Skill-to-problem matching", "Team templates & roadmaps"].map((line) => (
                      <li key={line} className="flex items-center gap-2 text-sm text-white/80">
                        <Check className="w-3.5 h-3.5 text-[#3B82F6]" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard/innovation-engine"
                    className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] text-white rounded-full px-6 py-3 text-sm font-bold hover:shadow-lg hover:shadow-[#3B82F6]/20 transition-all"
                  >
                    Launch Innovation Engine
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Related Resources */}
                {relatedResources.length > 0 && (
                  <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Related</h3>
                    <div className="space-y-4">
                      {relatedResources.map((related) => {
                        const RIcon = typeIcons[related.type] || BookOpen
                        return (
                          <Link
                            key={related.id}
                            href={`/resources/${related.slug}`}
                            className="group block"
                          >
                            <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B82F6]/10 transition-colors">
                                <RIcon className="w-4 h-4 text-muted-foreground group-hover:text-[#1E3A8A] dark:group-hover:text-[#3B82F6] transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#1E3A8A] dark:group-hover:text-[#3B82F6] transition-colors">
                                  {related.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {related.readTime && (
                                    <span className="text-xs text-muted-foreground">{related.readTime}</span>
                                  )}
                                  {related.isPremium && (
                                    <Crown className="w-3 h-3 text-[#1E3A8A] dark:text-[#3B82F6]" />
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

      {/* Upgrade Modal - for logged-in free users */}
      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />

      {/* Unskippable Auth Overlay - for non-logged-in users (appears after 5s) */}
      {showAuthOverlay && status === "unauthenticated" && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop - click to dismiss */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAuthOverlay(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowAuthOverlay(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Unlock engineering innovation playbooks
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Sign in to access our full library of engineering playbooks, build templates, and problem-discovery guides. Join thousands of engineers building things that matter.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Read full playbooks on problem discovery & building",
                  "Access team templates and project roadmaps",
                  "Match your skills to problems via the Innovation Engine",
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#1E3A8A]" />
                    </div>
                    <span className="text-sm">{line}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center gap-2 bg-[#0F1B3D] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#1E3A8A] transition-colors"
              >
                Sign In to Continue
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-[#1E3A8A] dark:text-[#3B82F6] font-semibold hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
