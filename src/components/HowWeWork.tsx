'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '1/5',
    title: 'Initial Diagnosis',
    description:
      'We start with a deep-dive assessment of your current business landscape, identifying key challenges and untapped opportunities to build a clear roadmap forward.',
  },
  {
    number: '2/5',
    title: 'Strategic Planning',
    description:
      'Based on our diagnosis, we craft a tailored strategic plan that aligns with your vision and sets measurable milestones for growth and innovation.',
  },
  {
    number: '3/5',
    title: 'Implementation',
    description:
      'We work alongside your team to execute the strategy, ensuring every initiative is implemented with precision and aligned with your core objectives.',
  },
  {
    number: '4/5',
    title: 'Optimization',
    description:
      'Through continuous monitoring and data analysis, we refine and optimize strategies to maximize impact and adapt to evolving market conditions.',
  },
  {
    number: '5/5',
    title: 'Scale & Grow',
    description:
      'With proven processes in place, we help you scale sustainably—expanding reach, deepening impact, and building long-term competitive advantage.',
  },
];

export default function HowWeWork() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : steps.length - 1));
  const next = () => setCurrent((c) => (c < steps.length - 1 ? c + 1 : 0));

  return (
    <section className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] sm:min-h-[600px]">
        {/* Left Side - Dark Green */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="bg-[#1A2E1A] p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative"
        >
          <span className="text-[#7CFC00] text-sm font-semibold tracking-wider mb-4">
            HOW WE WORK
          </span>
          <span className="text-[#7CFC00]/60 text-sm font-medium tracking-wider mb-4">
            {steps[current].number}
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7CFC00] mb-6">
            {steps[current].title}
          </h3>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            {steps[current].description}
          </p>

          {/* CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#7CFC00] text-[#1A2E1A] rounded-full px-7 py-3 text-sm sm:text-base font-semibold hover:bg-[#6BE000] transition-colors duration-300 self-start mb-8 group shadow-lg shadow-[#7CFC00]/20"
          >
            START YOUR JOURNEY
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#7CFC00] hover:text-[#7CFC00] transition-colors duration-300"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#7CFC00] hover:text-[#7CFC00] transition-colors duration-300"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex gap-2 mt-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-[#7CFC00]' : 'w-4 bg-white/20'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative min-h-[300px] lg:min-h-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/howwework.jpg')" }}
          />
          {/* Green circular overlay graphic */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[3px] border-[#7CFC00]/30 hidden lg:block" />
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#7CFC00]/10 hidden lg:block" />
        </motion.div>
      </div>
    </section>
  );
}
