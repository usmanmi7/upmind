"use client"

import { motion } from "framer-motion"

interface PageHeroProps {
  badge?: string
  title: string
  highlight?: string
  description: string
}

export default function PageHero({ badge, title, highlight, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#1E3A8A]/10 rounded-full blur-3xl" />
      </div>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 bg-[#DBEAFE] dark:bg-[#1E3A8A]/30 text-[#1E3A8A] dark:text-[#3B82F6] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              {badge}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight leading-tight">
            {title}{" "}
            {highlight && <span className="font-serif-accent-italic gradient-text">{highlight}</span>}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
