'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRef, useState, useEffect } from 'react';

const TOTAL_FRAMES = 16;
const FRAME_URLS = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/videos/hero-frames/frame_${String(i + 1).padStart(3, '0')}.webp`
);

export default function Hero() {
  const { data: session } = useSession();
  const sectionRef = useRef<HTMLElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Track scroll progress through the hero section.
  // offset: start start = section top hits viewport top (progress 0)
  //         end end   = section bottom hits viewport bottom (progress 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0 -> 1) to frame index (0 -> 15)
  const frameMotion = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Fade hero content out near the end of the scrub so the transition
  // to the Stats section is clean (no abrupt disappearance).
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65, 0.9], [1, 1, 0]);

  useMotionValueEvent(frameMotion, 'change', (latest) => {
    const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(latest)));
    setCurrentFrame(idx);
  });

  // Preload all frames on mount so scrubbing is instant.
  useEffect(() => {
    FRAME_URLS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] bg-[#0F1B3D] -mt-16 sm:-mt-20"
    >
      {/* Sticky container - stays pinned for 100vh of scroll while frames scrub */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Frame stack - all frames loaded, only current one visible */}
        {FRAME_URLS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === currentFrame ? 0.6 : 0,
              transition: 'opacity 80ms ease-out',
            }}
          />
        ))}

        {/* Dark overlay tint to keep text legible over the frames */}
        <div className="absolute inset-0 bg-[#0F1B3D]/40 z-[1]" />

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#0F1B3D] z-10" />

        {/* Hero content - fades out near the end of the scroll */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center"
        >
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#93C5FD] text-sm px-4 py-1.5 rounded-full font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse" />
              <Sparkles className="w-3.5 h-3.5" />
              Engineering Innovation Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-7 tracking-tight drop-shadow-md"
          >
            Find problems{' '}
            <span className="font-serif-accent-italic text-[#93C5FD]">worth</span>{' '}
            <span className="text-[#3B82F6]">solving</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md"
          >
            Curated world problems, an AI engine that matches them to your engineering skills,
            and playbooks for builders who want to ship things that matter.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12"
          >
            {session ? (
              <Link
                href="/dashboard"
                className="bg-[#3B82F6] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/30 flex items-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/solve-them"
                  className="bg-white text-black rounded-full px-8 py-3.5 text-base font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg shadow-black/20 flex items-center gap-2 group"
                >
                  Explore Problems
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/dashboard/innovation-engine"
                  className="text-white bg-white/10 border border-white/30 rounded-full px-8 py-3.5 text-base font-medium hover:bg-white/20 hover:border-white/50 backdrop-blur-md transition-all duration-300 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Try Innovation Engine
                </Link>
              </>
            )}
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/70 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
              30+ curated problems
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
              Sourced from WHO, UN, IEA
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
              Skill-matched by AI
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
