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
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/forest-cta.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A2E1A]/90 to-[#1A2E1A]/75" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
            GET STARTED TODAY
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to elevate your business?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Partner with us to take your digital presence to the next level.
            Start your free trial and see results in just 14 days.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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
                  className="border border-white/40 text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300 backdrop-blur-sm"
                >
                  BOOK A DEMO
                </Link>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/40 text-sm">
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
      </div>
    </section>
  );
}
