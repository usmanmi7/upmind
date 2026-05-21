"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"
import PageHero from "@/components/PageHero"
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
  Star,
} from "lucide-react"
import * as React from "react"

const categories = ["All", "Startup Tips", "Marketing", "AI", "Funding", "Branding"]
const types = ["All", "Blog", "Template", "Video", "PDF", "Guide"]

const resources = [
  { id: 1, title: "The Ultimate Startup Validation Framework", category: "Startup Tips", type: "GUIDE", isPremium: false, description: "A step-by-step framework to validate your startup idea in 2 weeks.", readTime: "15 min" },
  { id: 2, title: "Pitch Deck Template That Raised $5M", category: "Funding", type: "TEMPLATE", isPremium: true, description: "The exact template used by founders who raised Series A.", readTime: "Template" },
  { id: 3, title: "AI-Powered Growth Hacking Playbook", category: "AI", type: "PDF", isPremium: true, description: "Leverage AI tools to 10x your growth without 10x the budget.", readTime: "25 min" },
  { id: 4, title: "Building a Brand That Stands Out", category: "Branding", type: "BLOG", isPremium: false, description: "How to create a memorable brand identity on a startup budget.", readTime: "8 min" },
  { id: 5, title: "Content Marketing Strategy for Startups", category: "Marketing", type: "GUIDE", isPremium: false, description: "Create content that drives organic traffic and converts visitors.", readTime: "12 min" },
  { id: 6, title: "Financial Model Template", category: "Funding", type: "TEMPLATE", isPremium: true, description: "Professional financial model template for investor presentations.", readTime: "Template" },
  { id: 7, title: "Hiring Your First 10 Employees", category: "Startup Tips", type: "VIDEO", isPremium: false, description: "A comprehensive guide to making your first critical hires.", readTime: "30 min" },
  { id: 8, title: "Marketing Automation with AI", category: "AI", type: "VIDEO", isPremium: true, description: "Automate your marketing stack with these AI-powered tools.", readTime: "20 min" },
  { id: 9, title: "Social Media Playbook 2024", category: "Marketing", type: "PDF", isPremium: false, description: "Stay ahead with the latest social media strategies and trends.", readTime: "10 min" },
  { id: 10, title: "Startup Legal Essentials Checklist", category: "Startup Tips", type: "TEMPLATE", isPremium: false, description: "Don't miss any legal requirements when launching your startup.", readTime: "Template" },
  { id: 11, title: "Competitive Analysis Framework", category: "Branding", type: "GUIDE", isPremium: true, description: "Systematically analyze and outmaneuver your competition.", readTime: "18 min" },
  { id: 12, title: "Product-Market Fit Assessment", category: "Startup Tips", type: "PDF", isPremium: true, description: "Quantitatively measure your progress toward product-market fit.", readTime: "15 min" },
]

const typeIcons: Record<string, React.ElementType> = {
  BLOG: BookOpen,
  TEMPLATE: FileText,
  VIDEO: Video,
  PDF: Download,
  GUIDE: GraduationCap,
}

export default function ResourcesPage() {
  const [search, setSearch] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [activeType, setActiveType] = React.useState("All")
  const [filterPremium, setFilterPremium] = React.useState<"all" | "free" | "premium">("all")

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === "All" || r.category === activeCategory
    const matchType = activeType === "All" || r.type === activeType
    const matchPremium = filterPremium === "all" || (filterPremium === "free" && !r.isPremium) || (filterPremium === "premium" && r.isPremium)
    return matchSearch && matchCategory && matchType && matchPremium
  })

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filterPremium} onValueChange={(v) => setFilterPremium(v as "all" | "free" | "premium")}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className={activeCategory === cat ? "bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A]" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Type Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={activeType === type ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((resource, i) => {
                const Icon = typeIcons[resource.type] || BookOpen
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <div className="relative p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      {resource.isPremium && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] text-xs">
                            <Lock className="size-3 mr-1" /> Premium
                          </Badge>
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-xl bg-[#C8E6C9] dark:bg-[#2D4A2D]/30 flex items-center justify-center mb-4">
                        <Icon className="size-5 text-[#2D4A2D] dark:text-[#7CFC00]" />
                      </div>
                      <Badge variant="outline" className="w-fit text-xs mb-2">{resource.category}</Badge>
                      <h3 className="text-base font-heading font-semibold mb-2 leading-snug">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                        <Button variant="ghost" size="sm" className="text-[#2D4A2D] dark:text-[#7CFC00] p-0 h-auto">
                          {resource.isPremium ? "Unlock" : "Read"}
                          <ArrowRight className="size-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">Unlock all premium resources</h2>
                <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                  Get unlimited access to templates, guides, and tools with a Growth Pro plan.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-white text-[#2D4A2D] hover:bg-white/90 shadow-xl w-full sm:w-auto text-base px-8 h-12">
                    <Link href="/pricing">
                      View Plans
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
