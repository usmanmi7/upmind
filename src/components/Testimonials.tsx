'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const testimonials = [
  {
    quote:
      'They brought clarity to complex problems, breaking down barriers and delivering innovative solutions.',
    author: 'John Doe',
    role: 'CEO, Tech Innovations',
    image: '/images/testimonial1.jpg',
  },
  {
    quote:
      'Working with Upmind transformed our approach to growth. Their strategic insights were invaluable.',
    author: 'Sarah Chen',
    role: 'COO, GrowthLabs',
    image: '/images/testimonial1.jpg',
  },
  {
    quote:
      'The team delivered beyond expectations. Our product launch was smoother than we ever imagined.',
    author: 'Marcus Rivera',
    role: 'Founder, ScaleUp',
    image: '/images/testimonial1.jpg',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const prev = () =>
    setCurrent((c) => (c > 0 ? c - 1 : testimonials.length - 1));
  const next = () =>
    setCurrent((c) => (c < testimonials.length - 1 ? c + 1 : 0));

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#7CFC00] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase block mb-6"
          >
            TESTIMONIALS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-10"
          >
            What our clients say
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Quote className="w-10 h-10 text-[#7CFC00]/30 mx-auto mb-6" />

            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold font-heading text-[#1A1A1A] leading-relaxed mb-8 min-h-[100px]">
              &ldquo;{testimonials[current].quote}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#7CFC00]/30">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#1A1A1A]">
                  {testimonials[current].author}
                </div>
                <div className="text-[#666666] text-sm">
                  {testimonials[current].role}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-[#1A2E1A]/20 flex items-center justify-center text-[#1A2E1A]/50 hover:border-[#7CFC00] hover:text-[#1A2E1A] transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-[#7CFC00]' : 'w-4 bg-[#1A2E1A]/15'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-[#1A2E1A]/20 flex items-center justify-center text-[#1A2E1A]/50 hover:border-[#7CFC00] hover:text-[#1A2E1A] transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* CTA */}
          <Link
            href="/success-stories"
            className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-7 py-3 text-sm sm:text-base font-medium hover:bg-[#243824] transition-colors duration-300 group"
          >
            READ SUCCESS STORIES
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
