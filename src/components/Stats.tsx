'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center p-6 sm:p-8 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-[#3B82F6]/30 transition-colors duration-300"
    >
      <div className="text-4xl sm:text-5xl font-bold font-heading text-[#3B82F6] mb-3">
        {value}
      </div>
      <p className="text-white/70 text-sm sm:text-base">{label}</p>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="about-us" className="bg-[#0F1B3D] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase block mb-4"
          >
            WHY ENGINEST
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6"
          >
            Built for engineers who want to{' '}
            <span className="font-serif-accent-italic text-[#93C5FD]">ship</span> things that matter.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg leading-relaxed"
          >
            We curate real-world problems, match them to engineering skills with AI, and give you
            the playbooks to actually build. No more clever tech in search of a problem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard value="30+" label="Curated world problems" delay={0} />
          <StatCard value="26" label="Engineering categories" delay={0.15} />
          <StatCard value="5+B" label="People affected by listed problems" delay={0.3} />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/solve-them"
            className="inline-flex items-center gap-2 bg-[#3B82F6] text-white rounded-full px-7 py-3 text-sm sm:text-base font-semibold hover:bg-[#2563EB] transition-colors duration-300 group shadow-lg shadow-[#3B82F6]/20"
          >
            Explore Problems
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
