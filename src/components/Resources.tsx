'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, FileText, Video, BookOpen } from 'lucide-react';
import Link from 'next/link';

const resources = [
  {
    icon: FileText,
    tag: 'Guide',
    title: 'Startup Validation Playbook',
    description:
      'A step-by-step framework to test your assumptions, validate your market, and avoid costly mistakes before launch.',
    link: '/resources',
  },
  {
    icon: Video,
    tag: 'Webinar',
    title: 'Fundraising Masterclass',
    description:
      'Learn how to craft a compelling pitch, identify the right investors, and navigate the fundraising process with confidence.',
    link: '/resources',
  },
  {
    icon: BookOpen,
    tag: 'Template',
    title: 'Growth Strategy Toolkit',
    description:
      'Ready-to-use templates for roadmap planning, OKR setting, and growth experiments that drive measurable results.',
    link: '/resources',
  },
];

export default function Resources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4"
          >
            RESOURCES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4"
          >
            Tools to accelerate your growth
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#666666] text-base sm:text-lg"
          >
            Free guides, templates, and webinars to help you build smarter and scale faster.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {resources.map((resource, i) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="group bg-[#F5F5F5] rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#7CFC00]/20"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A2E1A] flex items-center justify-center mb-5 group-hover:bg-[#7CFC00] transition-colors duration-300">
                <resource.icon className="w-6 h-6 text-white group-hover:text-[#1A2E1A] transition-colors duration-300" />
              </div>
              <span className="text-[#7CFC00] text-xs font-semibold tracking-wider uppercase">
                {resource.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mt-2 mb-3 group-hover:text-[#1A2E1A] transition-colors">
                {resource.title}
              </h3>
              <p className="text-[#666666] text-sm sm:text-base leading-relaxed mb-5">
                {resource.description}
              </p>
              <Link
                href={resource.link}
                className="inline-flex items-center gap-1.5 text-[#1A2E1A] text-sm font-semibold group-hover:text-[#7CFC00] transition-colors"
              >
                Access Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
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
            className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-[#243824] transition-colors duration-300 group shadow-lg shadow-[#1A2E1A]/10"
          >
            View All Resources
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
