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
        style={{ backgroundImage: "url('/images/cta-pic.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1B3D]/90 to-[#0F1B3D]/75" />

      {/* Content */}
      <div className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase block mb-4">
            START BUILDING TODAY
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to build something{' '}
            <span className="font-serif-accent-italic text-[#93C5FD]">that matters?</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Browse 30+ curated world problems. Match your skills with the AI Innovation Engine.
            Pick a problem and start building.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/25 flex items-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/solve-them"
                  className="bg-white text-black rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg shadow-black/20 flex items-center gap-2 group"
                >
                  Explore Problems
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="border border-white/40 text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-white hover:text-[#0F1B3D] transition-all duration-300 backdrop-blur-sm"
                >
                  Create Free Account
                </Link>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span>30+ curated problems</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span>AI skill matching</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span>Free to start</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
