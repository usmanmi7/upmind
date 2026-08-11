'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRef, useEffect } from 'react';

export default function Hero() {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force play if the browser blocked autoplay, and re-play on end as a
  // belt-and-suspenders fallback to the native `loop` attribute (Safari
  // iOS sometimes ignores `loop` for muted autoplay videos).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const ensurePlay = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay was blocked; try again on first user interaction.
          const retry = () => {
            v.play().catch(() => {});
            window.removeEventListener('click', retry);
            window.removeEventListener('touchstart', retry);
          };
          window.addEventListener('click', retry, { once: true });
          window.addEventListener('touchstart', retry, { once: true });
        });
      }
    };

    ensurePlay();

    const onEnded = () => {
      // Safety net: if `loop` attr fails, restart manually.
      v.currentTime = 0;
      ensurePlay();
    };

    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-[#0F1B3D] -mt-16 sm:-mt-20">
      {/* Background video - endless loop */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay tint to keep text legible over the video */}
      <div className="absolute inset-0 bg-[#0F1B3D]/40 z-[1]" />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#0F1B3D] z-10" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(6rem+100px)] pb-20 w-full text-center">
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
      </div>
    </section>
  );
}
