'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, ArrowRight, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          const dbList = data.testimonials;
          if (dbList && dbList.length > 0) {
            setTestimonials(
              dbList.map((t: { content: string; name: string; role: string | null; company: string | null; rating: number | null }) => ({
                quote: t.content,
                author: t.name,
                role: `${t.role || ''}${t.company ? (t.role ? ', ' : '') + t.company : ''}`,
                rating: t.rating || 5,
              }))
            );
          }
        }
      } catch {
        // Database unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const prev = () =>
    setCurrent((c) => (c > 0 ? c - 1 : testimonials.length - 1));
  const next = () =>
    setCurrent((c) => (c < testimonials.length - 1 ? c + 1 : 0));

  // Don't render section if no testimonials
  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#3B82F6] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase block mb-6"
          >
            TESTIMONIALS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-10"
          >
            What our{' '}
            <span className="font-serif-accent-italic text-[#1E3A8A]">builders</span>{' '}
            say
          </motion.h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-[#3B82F6]" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Quote className="w-10 h-10 text-[#3B82F6]/30 mx-auto mb-6" />

                {/* Star Rating */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold font-heading text-[#1A1A1A] leading-relaxed mb-8 min-h-[100px]">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>

                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonials[current].author.split(' ').map((n) => n[0]).join('')}
                    </span>
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

              {/* Navigation - only show if more than 1 testimonial */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-3 mb-10">
                  <button
                    onClick={prev}
                    className="w-11 h-11 rounded-full border border-[#0F1B3D]/20 flex items-center justify-center text-[#0F1B3D]/50 hover:border-[#3B82F6] hover:text-[#0F1B3D] transition-colors duration-300"
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
                          i === current ? 'w-8 bg-[#3B82F6]' : 'w-4 bg-[#0F1B3D]/15'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={next}
                    className="w-11 h-11 rounded-full border border-[#0F1B3D]/20 flex items-center justify-center text-[#0F1B3D]/50 hover:border-[#3B82F6] hover:text-[#0F1B3D] transition-colors duration-300"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <Link
            href="/success-stories"
            className="inline-flex items-center gap-2 bg-[#0F1B3D] text-white rounded-full px-7 py-3 text-sm sm:text-base font-medium hover:bg-[#1E3A8A] transition-colors duration-300 group"
          >
            Read Success Stories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
