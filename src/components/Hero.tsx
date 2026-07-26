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

      {/* Layer 7 — Bottom two-curve divider (separates Hero from WHY ENGINEST) */}
      <div className="absolute bottom-0 inset-x-0 z-20 pointer-events-none">
        {/* Soft blue glow under the curves */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#3B82F6]/10 via-[#3B82F6]/3 to-transparent" />

        {/* Two concentric arc curves */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {/* Outer curve — wider, soft blue */}
          <path
            d="M0,80 C360,160 1080,160 1440,80"
            stroke="url(#curveOuter)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Inner curve — tighter, brighter blue */}
          <path
            d="M0,95 C360,40 1080,40 1440,95"
            stroke="url(#curveInner)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="curveOuter" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="curveInner" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0" />
              <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center node dot — sits on the curve intersection */}
        <div className="absolute bottom-[78px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.9)] animate-pulse" />
        </div>
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
