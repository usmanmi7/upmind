'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg-new.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0F1B3D]/85" />

      {/* Content */}
      <div className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Side - Text & CTAs */}
          <div>
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-sm px-4 py-1.5 rounded-full font-medium">
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
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
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
              className="text-white/60 text-lg sm:text-xl max-w-lg mb-8 leading-relaxed"
            >
              Curated world problems, an AI engine that matches them to your engineering skills, and playbooks for builders who want to ship things that matter.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-10"
            >
              {session ? (
                <Link
                  href="/dashboard"
                  className="bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/20 flex items-center gap-2 group"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/solve-them"
                    className="bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/20 flex items-center gap-2 group"
                  >
                    Explore Problems
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/dashboard/innovation-engine"
                    className="text-white/80 border border-white/15 rounded-full px-8 py-3.5 text-base font-medium hover:bg-white/5 hover:border-white/25 transition-all duration-300 flex items-center gap-2"
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
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/30 text-sm"
            >
              <span>30+ curated problems</span>
              <span className="hidden sm:inline text-white/10">|</span>
              <span>Sourced from WHO, UN, IEA</span>
              <span className="hidden sm:inline text-white/10">|</span>
              <span>Skill-matched by AI</span>
            </motion.div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                    <div className="w-3 h-3 rounded-full bg-blue-400/40" />
                  </div>
                  <div className="flex-1 mx-6">
                    <div className="bg-white/5 rounded-md px-3 py-1.5 text-white/30 text-xs text-center max-w-xs mx-auto">
                      app.upmind.io/solve-them
                    </div>
                  </div>
                </div>

                {/* Dashboard Preview Content */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                      <div className="text-white/40 text-xs mb-1">Problems</div>
                      <div className="text-white text-lg font-bold">30+</div>
                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '72%' }}
                          transition={{ duration: 1.5, delay: 1 }}
                          className="h-full bg-[#3B82F6]/60 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                      <div className="text-white/40 text-xs mb-1">Categories</div>
                      <div className="text-white text-lg font-bold">26</div>
                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '58%' }}
                          transition={{ duration: 1.5, delay: 1.2 }}
                          className="h-full bg-[#3B82F6]/60 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                      <div className="text-white/40 text-xs mb-1">Match Score</div>
                      <div className="text-white text-lg font-bold">92/100</div>
                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1.5, delay: 1.4 }}
                          className="h-full bg-[#3B82F6]/60 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white/40 text-xs">Problem Severity by Category</div>
                      <div className="flex gap-2">
                        <span className="text-[#3B82F6]/60 text-xs px-2 py-0.5 bg-[#3B82F6]/10 rounded">Top 12</span>
                        <span className="text-white/30 text-xs px-2 py-0.5">All</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 55, 35, 65, 50, 80, 60, 90, 70, 95, 85, 100].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + i * 0.05 }}
                          className={`flex-1 rounded-sm ${i >= 9 ? 'bg-[#3B82F6]/50' : 'bg-white/10'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect under the preview */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#3B82F6]/10 blur-3xl rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
