'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Hero() {
  const badges = ['Build Smart', 'Strategic', 'Professional', 'Grow Faster'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(26,46,26,0.7)]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8"
        >
          {badges.map((badge) => (
            <span
              key={badge}
              className="border border-white/40 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm"
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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto mb-6"
        >
          Clear insights. Real strategy. Sustainable growth.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We help startups and growing teams validate ideas, scale products, and
          make data-driven decisions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          <a
            href="#"
            className="border border-white text-white rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300"
          >
            VIEW DEMO
          </a>
          <a
            href="#"
            className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold hover:bg-[#6BE000] transition-all duration-300"
          >
            BOOK A CALL
          </a>
          <a
            href="#"
            className="border border-white text-white rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-medium hover:bg-white hover:text-[#1A2E1A] transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Startup Free
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
