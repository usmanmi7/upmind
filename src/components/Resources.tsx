'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const resources = [
  {
    image: '/images/resources/guide.jpg',
    tag: 'Guide',
    title: 'How to Find Problems Worth Solving',
    description:
      'A field guide for engineers, sourcing real problems from WHO, UN, IEA, and direct field research instead of brainstorming from a whiteboard.',
    link: '/resources',
  },
  {
    image: '/images/resources/template.jpg',
    tag: 'Template',
    title: 'Engineering Project Roadmap (12-month)',
    description:
      'A 4-phase roadmap template, validation, prototype, pilot, scale, with milestones, deliverables, and exit criteria for engineering innovation projects.',
    link: '/resources',
  },
  {
    image: '/images/resources/reading-list.jpg',
    tag: 'Reading List',
    title: 'Reading List for Engineering Innovators',
    description:
      '30 essential books, papers, and long-form essays for engineers who want to build things that matter, across systems, climate, AI, and field work.',
    link: '/resources',
  },
];

export default function Resources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase block mb-4"
          >
            RESOURCES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4"
          >
            Playbooks for{' '}
            <span className="font-serif-accent-italic text-[#1E3A8A]">builders</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#666666] text-base sm:text-lg"
          >
            Field guides, templates, and frameworks written for engineers, not generic startup advice.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {resources.map((resource, i) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="group bg-[#F5F7FB] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#3B82F6]/20 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0F1B3D]">
                <Image
                  src={resource.image}
                  alt={resource.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Tag overlay */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[#0F1B3D]/90 backdrop-blur-sm text-[#93C5FD] text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/10">
                    {resource.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#0F1B3D] transition-colors">
                  {resource.title}
                </h3>
                <p className="text-[#666666] text-sm sm:text-base leading-relaxed mb-5 flex-1">
                  {resource.description}
                </p>
                <Link
                  href={resource.link}
                  className="inline-flex items-center gap-1.5 text-[#0F1B3D] text-sm font-semibold group-hover:text-[#3B82F6] transition-colors"
                >
                  Read Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 bg-[#0F1B3D] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-[#1E3A8A] transition-colors duration-300 group shadow-lg shadow-[#0F1B3D]/10"
          >
            View All Resources
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
