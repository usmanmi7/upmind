'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

// Inline SVG logos for each organization — clean wordmark/emblem style
// approximations. Self-contained, no external dependencies, always render.

function WHOLogo() {
  return (
    <svg viewBox="0 0 200 80" className="h-10 sm:h-12 lg:h-14 w-auto" aria-label="WHO">
      {/* Staff of Asclepius emblem */}
      <g transform="translate(28, 40)">
        <circle cx="0" cy="0" r="20" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        {/* Olive branches */}
        <path d="M -20 0 Q -28 -8 -20 -16 M 20 0 Q 28 -8 20 -16 M -20 0 Q -28 8 -20 16 M 20 0 Q 28 8 20 16" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        {/* Staff */}
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="2" />
        {/* Snake */}
        <path d="M 0 -14 Q 6 -8 0 -2 Q -6 4 0 10 Q 6 14 0 14" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
      <text x="68" y="50" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="24" fill="#FFFFFF" letterSpacing="1">WHO</text>
    </svg>
  );
}

function UNLogo() {
  return (
    <svg viewBox="0 0 200 80" className="h-10 sm:h-12 lg:h-14 w-auto" aria-label="UN">
      {/* Olive branches around globe */}
      <g transform="translate(28, 40)">
        <circle cx="0" cy="0" r="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Meridians */}
        <ellipse cx="0" cy="0" rx="8" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="-18" y1="0" x2="18" y2="0" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="0" y1="-18" x2="0" y2="18" stroke="#FFFFFF" strokeWidth="1" />
        {/* Olive branches */}
        <path d="M -22 0 Q -32 -10 -28 -22 Q -20 -18 -18 -10" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 22 0 Q 32 -10 28 -22 Q 20 -18 18 -10" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M -22 0 Q -32 10 -28 22 Q -20 18 -18 10" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M 22 0 Q 32 10 28 22 Q 20 18 18 10" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
      </g>
      <text x="64" y="50" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="22" fill="#FFFFFF">UN</text>
    </svg>
  );
}

function UNICEFLogo() {
  return (
    <svg viewBox="0 0 220 80" className="h-10 sm:h-12 lg:h-14 w-auto" aria-label="UNICEF">
      <g transform="translate(28, 40)">
        <circle cx="0" cy="0" r="18" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        {/* Simplified mother and child silhouette */}
        <circle cx="-4" cy="-6" r="3" fill="#3B82F6" />
        <path d="M -7 -2 Q -4 0 -1 -2 L -2 8 L -6 8 Z" fill="#3B82F6" />
        <circle cx="4" cy="2" r="2" fill="#93C5FD" />
        <path d="M 2 5 L 6 5 L 5 12 L 3 12 Z" fill="#93C5FD" />
      </g>
      <text x="58" y="50" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="18" fill="#FFFFFF" letterSpacing="0.5">UNICEF</text>
    </svg>
  );
}

function IEALogo() {
  return (
    <svg viewBox="0 0 200 80" className="h-10 sm:h-12 lg:h-14 w-auto" aria-label="IEA">
      {/* Flame element */}
      <g transform="translate(28, 40)">
        <path d="M 0 -18 Q -8 -6 -10 4 Q -10 14 0 16 Q 10 14 10 4 Q 8 -6 0 -18 Z" fill="#3B82F6" />
        <path d="M 0 -10 Q -4 -2 -4 4 Q -4 10 0 12 Q 4 10 4 4 Q 4 -2 0 -10 Z" fill="#93C5FD" />
      </g>
      <text x="50" y="50" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="24" fill="#FFFFFF" letterSpacing="2">IEA</text>
    </svg>
  );
}

function IPCCLogo() {
  return (
    <svg viewBox="0 0 200 80" className="h-10 sm:h-12 lg:h-14 w-auto" aria-label="IPCC">
      <g transform="translate(28, 40)">
        <circle cx="0" cy="0" r="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Globe with climate lines */}
        <ellipse cx="0" cy="0" rx="8" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="-18" y1="-6" x2="18" y2="-6" stroke="#3B82F6" strokeWidth="1" />
        <line x1="-18" y1="6" x2="18" y2="6" stroke="#3B82F6" strokeWidth="1" />
        <line x1="0" y1="-18" x2="0" y2="18" stroke="#FFFFFF" strokeWidth="1" />
      </g>
      <text x="56" y="50" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="22" fill="#FFFFFF" letterSpacing="1">IPCC</text>
    </svg>
  );
}

function WorldBankLogo() {
  return (
    <svg viewBox="0 0 240 80" className="h-10 sm:h-12 lg:h-14 w-auto" aria-label="World Bank">
      {/* Stylized half-globe */}
      <g transform="translate(28, 40)">
        <path d="M 0 -16 Q -16 -16 -16 0 Q -16 16 0 16 Q 16 16 16 0 Q 16 -16 0 -16 Z" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
        <line x1="-16" y1="0" x2="16" y2="0" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="-8" y1="-14" x2="-8" y2="14" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="8" y1="-14" x2="8" y2="14" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="0" y1="-16" x2="0" y2="16" stroke="#FFFFFF" strokeWidth="1" />
      </g>
      <text x="52" y="46" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill="#FFFFFF">World</text>
      <text x="52" y="62" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill="#FFFFFF">Bank</text>
    </svg>
  );
}

const partners = [
  { name: 'WHO', Logo: WHOLogo },
  { name: 'UN', Logo: UNLogo },
  { name: 'UNICEF', Logo: UNICEFLogo },
  { name: 'IEA', Logo: IEALogo },
  { name: 'IPCC', Logo: IPCCLogo },
  { name: 'World Bank', Logo: WorldBankLogo },
];

// Duplicate the list so the track can scroll infinitely with no visible jump.
const track = [...partners, ...partners];

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-[#0F1B3D] py-12 sm:py-16 border-t border-white/5 overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-white/40 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-8"
        >
          Problems sourced from
        </motion.p>
      </div>

      {/* Marquee container with fade edges */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="relative w-full group"
      >
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-32 lg:w-48"
          style={{
            background:
              'linear-gradient(to right, #0F1B3D 0%, rgba(15,27,61,0.85) 40%, rgba(15,27,61,0) 100%)',
          }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-32 lg:w-48"
          style={{
            background:
              'linear-gradient(to left, #0F1B3D 0%, rgba(15,27,61,0.85) 40%, rgba(15,27,61,0) 100%)',
          }}
        />

        {/* Scrolling track — pauses on hover */}
        <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
          {track.map((partner, i) => {
            const Logo = partner.Logo;
            return (
              <div
                key={`${partner.name}-${i}`}
                className="flex items-center justify-center shrink-0 px-8 sm:px-12 lg:px-16"
              >
                <div className="opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Logo />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
