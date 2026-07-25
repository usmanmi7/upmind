'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const tags = ['Problem-First', 'AI-Matched', 'Open Source', 'Engineer-Built', 'Impact-Focused'];

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
            <span className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase mb-4 block">
              OUR STORY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              Built by engineers, for{' '}
              <span className="font-serif-accent-italic text-[#1E3A8A]">builders</span>
            </h2>
            <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-6">
              Enginest was founded by engineers who kept watching talented friends build clever
              solutions in search of problems. The pattern was always the same — a beautiful
              technical idea, a missing market, a slow drift toward irrelevance. The technology
              wasn&apos;t the bottleneck. The problem selection was.
            </p>
            <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-6">
              So we flipped the workflow. Instead of starting from what you can build, start from
              what actually needs building. We curate real, documented problems from WHO, UN, IEA,
              IPCC, and other authoritative sources — then match them to the engineering skills
              that can actually move the needle.
            </p>
            <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-8">
              Today, Enginest is the home for engineers who want their work to matter: a curated
              problem database, an AI Innovation Engine for skill matching, playbooks for building,
              and a community of people shipping things that count.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#0F1B3D] text-white rounded-full px-7 py-3 text-sm sm:text-base font-medium hover:bg-[#1E3A8A] transition-colors duration-300 group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/solve-them"
                className="inline-flex items-center gap-2 border border-[#0F1B3D]/20 text-[#0F1B3D] rounded-full px-7 py-3 text-sm sm:text-base font-medium hover:bg-[#0F1B3D] hover:text-white transition-all duration-300"
              >
                Browse Problems
              </Link>
            </div>
          </motion.div>

          {/* Right - Performance Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#F5F7FB] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-[3px] border-[#3B82F6]/20" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-[3px] border-[#3B82F6]/10" />

              <div className="relative z-10">
                <h3 className="text-[#1A1A1A] font-semibold text-lg sm:text-xl mb-2">
                  Curated problems
                </h3>
                <div className="text-6xl sm:text-7xl lg:text-8xl font-bold font-heading text-[#3B82F6] mb-6">
                  30+
                </div>
                <p className="text-[#666666] text-sm mb-6">
                  Real-world engineering problems sourced from WHO, UN, IEA, IPCC, World Bank, and
                  more — each one validated, sized, and ready for an engineering team to attack.
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white text-[#0F1B3D] text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
