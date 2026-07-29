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
    <section className="relative overflow-hidden py-20 sm:py-28 bg-[#0F1B3D] -mt-16 sm:-mt-20 pt-32 sm:pt-40">
      {/* Vertical gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/85 via-[#0F1B3D] to-[#0A1428]" />

      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#3B82F6]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#1E3A8A]/30 rounded-full blur-3xl" />
      </div>

      {/* Blueprint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(147,197,253,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,197,253,0.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
        }}
      />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-[#0A1428]" />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#93C5FD] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              {badge}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight leading-tight text-white">
            {title}{" "}
            {highlight && <span className="font-serif-accent-italic text-[#93C5FD]">{highlight}</span>}
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
