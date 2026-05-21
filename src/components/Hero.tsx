'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Hero() {
  const { data: session } = useSession();
  const badges = ['Build Smart', 'Strategic', 'Professional', 'Grow Faster'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A2E1A]/90 via-[#1A2E1A]/70 to-[#1A2E1A]/50" />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#7CFC00]/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/6 w-72 h-72 rounded-full bg-[#7CFC00]/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2 sm:gap-3 mb-8"
            >
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="border border-[#7CFC00]/40 text-[#7CFC00] text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm bg-[#7CFC00]/5 font-medium"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            >
              Clear insights.{' '}
              <span className="text-[#7CFC00]">Real strategy.</span>{' '}
              Sustainable growth.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-white/80 text-base sm:text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
            >
              We help startups and growing teams validate ideas, scale products,
              and make data-driven decisions that drive real results.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-10"
            >
              {session ? (
                <Link
                  href="/dashboard"
                  className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/25 flex items-center gap-2 group"
                >
                  GO TO DASHBOARD
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/25 flex items-center gap-2 group"
                  >
                    GET STARTED FREE
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/services"
                    className="border border-white/40 text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300 backdrop-blur-sm"
                  >
                    VIEW SERVICES
                  </Link>
                </>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              className="flex flex-wrap items-center gap-6 text-white/50 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7CFC00]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7CFC00]" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7CFC00]" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 space-y-6">
              {/* Stat Row 1 */}
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="text-4xl font-bold text-[#7CFC00] font-heading">95%</div>
                  <p className="text-white/60 text-sm mt-1">Client satisfaction rate</p>
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-bold text-[#7CFC00] font-heading">500+</div>
                  <p className="text-white/60 text-sm mt-1">Projects delivered</p>
                </div>
              </div>
              {/* Divider */}
              <div className="border-t border-white/10" />
              {/* Stat Row 2 */}
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="text-4xl font-bold text-[#7CFC00] font-heading">$5M+</div>
                  <p className="text-white/60 text-sm mt-1">Revenue generated</p>
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-bold text-[#7CFC00] font-heading">20+</div>
                  <p className="text-white/60 text-sm mt-1">Industry experts</p>
                </div>
              </div>
              {/* Divider */}
              <div className="border-t border-white/10" />
              {/* Mini CTA */}
              <Link
                href="/success-stories"
                className="flex items-center justify-between bg-[#7CFC00]/10 border border-[#7CFC00]/20 rounded-xl px-5 py-3 group hover:bg-[#7CFC00]/15 transition-all duration-300"
              >
                <div>
                  <div className="text-white text-sm font-medium">See Success Stories</div>
                  <div className="text-white/50 text-xs">Real results from real clients</div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#7CFC00] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#7CFC00] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
