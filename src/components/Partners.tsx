'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const partners = [
  { name: 'Cactus', icon: '🌵' },
  { name: 'Vision', icon: '👁' },
  { name: 'Greenish', icon: '🌿' },
  { name: 'Umbrella', icon: '☂' },
  { name: 'Network', icon: '⬡' },
  { name: 'Leaf', icon: '🍃' },
];

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-[#1A2E1A] py-12 sm:py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16"
        >
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer group"
            >
              <span className="text-xl sm:text-2xl">{partner.icon}</span>
              <span className="text-sm sm:text-base font-semibold font-heading tracking-wide">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
