'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A2E1A]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#7CFC00]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7CFC00]/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-[#7CFC00]/10 border border-[#7CFC00]/20 text-[#7CFC00] text-sm px-4 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-[#7CFC00] rounded-full animate-pulse" />
              Now with AI-powered insights
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
          >
            Strategy that{' '}
            <span className="text-[#7CFC00]">scales</span>{' '}
            with you
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/60 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
          >
            From validation to growth — get the tools, insights, and expert guidance your startup needs, all in one platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14"
          >
            {session ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-[#7CFC00] text-[#1A2E1A] rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/20 flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto bg-[#7CFC00] text-[#1A2E1A] rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/20 flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto text-white/80 border border-white/15 rounded-full px-8 py-3.5 text-base font-medium hover:bg-white/5 hover:border-white/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Book a Demo
                </Link>
              </>
            )}
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 mx-8">
                  <div className="bg-white/5 rounded-md px-3 py-1.5 text-white/30 text-xs text-center max-w-sm mx-auto">
                    app.upmind.io/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Preview Content */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  {/* Stat cards */}
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="text-white/40 text-xs mb-1">Revenue Growth</div>
                    <div className="text-white text-xl font-bold">+127%</div>
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '72%' }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="h-full bg-[#7CFC00]/60 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="text-white/40 text-xs mb-1">Active Projects</div>
                    <div className="text-white text-xl font-bold">24</div>
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '58%' }}
                        transition={{ duration: 1.5, delay: 1.2 }}
                        className="h-full bg-[#7CFC00]/60 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="text-white/40 text-xs mb-1">Client Score</div>
                    <div className="text-white text-xl font-bold">9.4/10</div>
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '94%' }}
                        transition={{ duration: 1.5, delay: 1.4 }}
                        className="h-full bg-[#7CFC00]/60 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Chart placeholder */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white/40 text-xs">Growth Overview</div>
                    <div className="flex gap-2">
                      <span className="text-[#7CFC00]/60 text-xs px-2 py-0.5 bg-[#7CFC00]/10 rounded">Monthly</span>
                      <span className="text-white/30 text-xs px-2 py-0.5">Weekly</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5 h-20">
                    {[40, 55, 35, 65, 50, 80, 60, 90, 70, 95, 85, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + i * 0.05 }}
                        className={`flex-1 rounded-sm ${i >= 9 ? 'bg-[#7CFC00]/50' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect under the preview */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#7CFC00]/10 blur-3xl rounded-full" />
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/30 text-sm"
          >
            <span>No credit card required</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span>14-day free trial</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span>Cancel anytime</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
