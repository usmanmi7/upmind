'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '1/5',
    title: 'Discover Problems',
    description:
      'Browse 30+ curated world problems sourced from WHO, UN, IEA, IPCC and more. Filter by category, scope, and difficulty to find ones that resonate with your engineering skills.',
  },
  {
    number: '2/5',
    title: 'Match Your Skills',
    description:
      'Run the AI Innovation Engine. Tell us your skills, interests, time, and team size, get a ranked shortlist of problems you are uniquely positioned to solve, with match reasons.',
  },
  {
    number: '3/5',
    title: 'Read the Brief',
    description:
      'Open any problem to see severity, impact, market need, affected regions, existing solutions, recommended team templates, and a 4-phase build roadmap ready to execute.',
  },
  {
    number: '4/5',
    title: 'Build the Solution',
    description:
      'Use the engineering solution briefs, skill requirements, and team templates to assemble a project. Tap our resources library for playbooks on every stage, from prototype to pilot.',
  },
  {
    number: '5/5',
    title: 'Ship & Scale',
    description:
      'Deploy, measure, iterate. Open-source where appropriate, find funding through our field guide, and turn an engineering project into a venture, paper, or infrastructure that lasts.',
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
        {/* Left Side - Deep Navy */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="bg-[#0F1B3D] p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative"
        >
          <span className="text-[#3B82F6] text-sm font-semibold tracking-wider mb-4">
            HOW IT WORKS
          </span>
          <span className="text-[#93C5FD]/60 text-sm font-medium tracking-wider mb-4">
            {steps[current].number}
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#93C5FD] mb-6">
            {steps[current].title}
          </h3>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            {steps[current].description}
          </p>

          {/* CTA */}
          <Link
            href="/solve-them"
            className="inline-flex items-center gap-2 bg-white text-black rounded-full px-7 py-3 text-sm sm:text-base font-semibold hover:bg-white/90 transition-colors duration-300 self-start mb-8 group shadow-lg shadow-black/20"
          >
            Start Exploring
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors duration-300"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors duration-300"
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
                  i === current ? 'w-8 bg-[#3B82F6]' : 'w-4 bg-white/20'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Side - Real Stock Photo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative min-h-[300px] lg:min-h-0"
        >
          <img
            src="/images/howwework-team.jpg"
            alt="Engineers working together on a build"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0F1B3D]/20 lg:bg-gradient-to-l lg:from-transparent lg:to-[#0F1B3D]/10" />
          {/* Blue circular overlay graphic */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[3px] border-[#3B82F6]/30 hidden lg:block" />
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#3B82F6]/10 hidden lg:block" />
        </motion.div>
      </div>
    </section>
  );
}
