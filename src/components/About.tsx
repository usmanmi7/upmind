'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const tags = ['Strategic', 'AI-Powered', 'Data', 'Growth Focused', 'Build Smart'];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              We help startups make smarter decisions and grow with clarity.
            </h2>
            <p className="text-[#666666] text-base sm:text-lg leading-relaxed mb-8">
              We bring strategic clarity, actionable insights, and modern processes
              to help you validate, launch, and scale products with confidence.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-7 py-3 text-sm sm:text-base font-medium hover:bg-[#243824] transition-colors duration-300 group"
            >
              Learn More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Right - Performance Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#F5F5F5] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-[3px] border-[#7CFC00]/20" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-[3px] border-[#7CFC00]/10" />

              <div className="relative z-10">
                <h3 className="text-[#1A1A1A] font-semibold text-lg sm:text-xl mb-2">
                  Performance
                </h3>
                <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-[#7CFC00] mb-6">
                  49%
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white text-[#1A2E1A] text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow cursor-default"
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
