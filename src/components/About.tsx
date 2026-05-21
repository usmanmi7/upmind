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

          {/* Right - Real Office Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/about-office.jpg"
                alt="Team working on strategy in modern office"
                className="w-full h-[340px] sm:h-[400px] lg:h-[460px] object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E1A]/30 via-transparent to-transparent" />
            </div>
            {/* Decorative accents */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-[3px] border-[#7CFC00]/20 hidden lg:block" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#7CFC00]/10 hidden lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
