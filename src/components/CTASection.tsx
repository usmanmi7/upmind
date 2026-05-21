'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { data: session } = useSession();

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-[#1A2E1A]">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
              GET STARTED TODAY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to elevate your business?
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Partner with us to take your digital presence to the next level.
              Start your free trial and see results in just 14 days.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
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
                    href="/contact"
                    className="border border-white/30 text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300"
                  >
                    BOOK A DEMO
                  </Link>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7CFC00]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7CFC00]" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7CFC00]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Real Stock Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/cta-team.jpg"
                alt="Business team collaborating"
                className="w-full h-[320px] sm:h-[400px] lg:h-[460px] object-cover"
              />
              {/* Subtle green overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A]/40 via-transparent to-transparent" />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-[3px] border-[#7CFC00]/20 hidden lg:block" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#7CFC00]/10 hidden lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
