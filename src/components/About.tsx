'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const highlights = [
  'Data-driven strategy development',
  'Expert-led consulting sessions',
  'Measurable growth outcomes',
  'AI-powered insights & tools',
];

const stats = [
  { value: '500+', label: 'Startups Served' },
  { value: '95%', label: 'Client Satisfaction' },
  { value: '12+', label: 'Years Experience' },
  { value: '$5M+', label: 'Revenue Generated' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
              ABOUT US
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              We help startups make smarter decisions and grow with clarity.
            </h2>
            <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-4">
              Upmind was founded by a team of entrepreneurs, consultants, and technologists who
              experienced firsthand the challenges of building and scaling startups. We combine the
              human expertise of seasoned consultants with AI-powered tools that give founders the
              insights they need, when they need them.
            </p>
            <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-8">
              Today, we&apos;ve helped over 500 startups across 20+ industries turn their visions
              into viable, growing businesses.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7CFC00] shrink-0" />
                  <span className="text-[#1A1A1A] text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-7 py-3 text-sm sm:text-base font-medium hover:bg-[#243824] transition-colors duration-300 group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-[#1A2E1A]/20 text-[#1A2E1A] rounded-full px-7 py-3 text-sm sm:text-base font-medium hover:bg-[#1A2E1A] hover:text-white transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Right - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#1A2E1A] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-[3px] border-[#7CFC00]/20" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-[3px] border-[#7CFC00]/10" />

              <div className="relative z-10">
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                  Our Impact
                </h3>
                <p className="text-white/50 text-sm mb-8">
                  Numbers that speak for themselves
                </p>

                <div className="grid grid-cols-2 gap-5">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-2xl p-5 text-center border border-white/5 hover:border-[#7CFC00]/20 transition-colors">
                      <div className="text-2xl sm:text-3xl font-bold text-[#7CFC00] font-heading">
                        {stat.value}
                      </div>
                      <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['S', 'D', 'A', 'J'].map((initial, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-[#7CFC00]/20 border-2 border-[#1A2E1A] flex items-center justify-center text-[#7CFC00] text-xs font-bold"
                        >
                          {initial}
                        </div>
                      ))}
                    </div>
                    <span className="text-white/50 text-sm">Join 500+ founders</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
