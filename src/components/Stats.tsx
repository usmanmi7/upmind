'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center p-6 sm:p-8 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-[#7CFC00]/30 transition-colors duration-300"
    >
      <div className="text-4xl sm:text-5xl font-bold font-heading text-[#7CFC00] mb-3">
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
    <section id="about-us" className="bg-[#1A2E1A] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7CFC00] mb-6"
          >
            Over a decade helping early-stage businesses grow.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-base sm:text-lg leading-relaxed"
          >
            From idea validation to advanced growth, we combine strategic insight
            and modern tools to help your startup make smarter decisions and scale
            faster in a rapidly changing market.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard value="95%" label="Complete customer satisfaction" delay={0} />
          <StatCard value="20+" label="Innovation and valuable insight" delay={0.15} />
          <StatCard value="$5M+" label="Highly efficient strategies" delay={0.3} />
        </div>
      </div>
    </section>
  );
}
