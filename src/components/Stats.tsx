'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Compass, Layers, Globe } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    value: '30+',
    label: 'Curated world problems',
    description:
      'Hand-picked from WHO, UN, IEA, IPCC, and other authoritative sources, every entry is a real, build-worthy challenge.',
    icon: Compass,
  },
  {
    value: '26',
    label: 'Engineering categories',
    description:
      'From energy and water to robotics, biotech, and space, problems span the full landscape of engineering work.',
    icon: Layers,
  },
  {
    value: '5B+',
    label: 'People affected',
    description:
      'The problems in our index touch billions of lives. Engineering the right solution means mattering at planetary scale.',
    icon: Globe,
  },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about-us" className="bg-[#0F1B3D] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT, Editorial intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
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
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight"
            >
              Built for engineers who want to{' '}
              <span className="font-serif-accent-italic text-[#93C5FD]">ship</span> things that matter.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-white/70 text-base sm:text-lg leading-relaxed mb-8"
            >
              We curate real-world problems, match them to engineering skills with AI, and give you the
              playbooks to actually build. No more clever tech in search of a problem.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
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

          {/* RIGHT, Stat rows */}
          <div className="lg:col-span-7 space-y-0">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                  className="group relative flex items-start gap-6 sm:gap-8 py-8 border-t border-white/10 first:border-t-0 first:pt-0 hover:bg-white/[0.02] -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-xl transition-colors duration-300"
                >
                  {/* Big number */}
                  <div className="flex-shrink-0 w-24 sm:w-32">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white leading-none group-hover:text-[#93C5FD] transition-colors duration-300">
                      {stat.value}
                    </div>
                  </div>

                  {/* Label + description + icon */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Icon className="w-4 h-4 text-[#3B82F6]" />
                      <span className="text-xs uppercase tracking-[0.12em] font-semibold text-white/90">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-white/55 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>

                  {/* Hover arrow indicator */}
                  <div className="hidden sm:flex flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
