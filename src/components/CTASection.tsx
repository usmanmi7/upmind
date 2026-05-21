'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/forest-cta.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(26,46,26,0.8)]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to elevate your business?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Partner with us to take your digital presence to the next level.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href="/auth/signup"
              className="border border-white text-white rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300"
            >
              VIEW DEMO
            </a>
            <a
              href="/auth/signup"
              className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold hover:bg-[#6BE000] transition-all duration-300"
            >
              GET STARTED
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
