'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0F1B3D]">
      {/* Layer 1 — Vertical navy gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] via-[#0F1B3D] to-[#0A1428]" />

      {/* Layer 2 — Blueprint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(147,197,253,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,197,253,0.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
        }}
      />

      {/* Layer 3 — Dotted secondary grid (tighter, very faint) */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(147,197,253,0.35) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 60%)',
        }}
      />

      {/* Layer 4 — Glow orbs (electric blue) */}
      <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-[#3B82F6]/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-[#1E3A8A]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#93C5FD]/8 blur-3xl pointer-events-none" />

      {/* Layer 5 — Diagonal accent lines (engineering schematic feel) */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800" fill="none">
          <path d="M0,200 L1200,500" stroke="#93C5FD" strokeWidth="1" />
          <path d="M0,350 L1200,650" stroke="#93C5FD" strokeWidth="1" />
          <path d="M0,500 L1200,200" stroke="#93C5FD" strokeWidth="1" />
          <circle cx="200" cy="200" r="4" fill="#3B82F6" />
          <circle cx="1000" cy="600" r="4" fill="#3B82F6" />
          <circle cx="600" cy="100" r="3" fill="#93C5FD" />
          <circle cx="900" cy="300" r="3" fill="#93C5FD" />
        </svg>
      </div>

      {/* Layer 6 — Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#0F1B3D]" />

      {/* Layer 7 — Bottom engineering divider (separates Hero from WHY ENGINEST) */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        {/* Wide blue glow strip underneath */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#3B82F6]/15 via-[#3B82F6]/5 to-transparent pointer-events-none" />

        {/* Divider band */}
        <div className="relative h-16 sm:h-14 flex items-center px-4 sm:px-8">
          {/* Left: solid line + dashed trace */}
          <div className="flex-1 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#3B82F6]/70" />
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#3B82F6] mr-2 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <div className="flex-1 h-px border-t border-dashed border-[#3B82F6]/40" />
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]/60 mx-2" />
          </div>

          {/* Center chip — section pointer */}
          <div className="flex-shrink-0 px-5 sm:px-6 py-2 rounded-full border border-[#3B82F6]/50 bg-[#0F1B3D] backdrop-blur-sm flex items-center gap-2.5 shadow-[0_0_24px_rgba(59,130,246,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white font-semibold">
              Why Enginest
            </span>
            <svg className="w-3 h-3 text-[#93C5FD]" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Right: dashed trace + solid line */}
          <div className="flex-1 flex items-center">
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6]/60 mx-2" />
            <div className="flex-1 h-px border-t border-dashed border-[#3B82F6]/40" />
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#3B82F6] ml-2 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#3B82F6]/70" />
          </div>
        </div>

        {/* Bottom thick accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#93C5FD] text-sm px-4 py-1.5 rounded-full font-medium backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse" />
            <Sparkles className="w-3.5 h-3.5" />
            Engineering Innovation Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-7 tracking-tight"
        >
          Find problems{' '}
          <span className="font-serif-accent-italic text-[#93C5FD]">worth</span>{' '}
          <span className="text-[#3B82F6]">solving</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Curated world problems, an AI engine that matches them to your engineering skills,
          and playbooks for builders who want to ship things that matter.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12"
        >
          {session ? (
            <Link
              href="/dashboard"
              className="bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/30 flex items-center gap-2 group"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                href="/solve-them"
                className="bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/30 flex items-center gap-2 group"
              >
                Explore Problems
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/innovation-engine"
                className="text-white/85 border border-white/20 rounded-full px-8 py-3.5 text-base font-medium hover:bg-white/5 hover:border-white/35 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                Try Innovation Engine
              </Link>
            </>
          )}
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/40 text-sm"
        >
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
            30+ curated problems
          </span>
          <span className="hidden sm:inline text-white/15">|</span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
            Sourced from WHO, UN, IEA
          </span>
          <span className="hidden sm:inline text-white/15">|</span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
            Skill-matched by AI
          </span>
        </motion.div>
      </div>
    </section>
  );
}
