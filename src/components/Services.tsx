'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Monitor, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Target,
    title: 'Strategy & Operations',
    description:
      'We align your business goals with actionable strategies, streamlining operations and optimizing processes for sustainable, long-term growth.',
    link: '/services',
  },
  {
    icon: Monitor,
    title: 'Digital Transformation',
    description:
      'Embrace modern technology to stay competitive. We guide your digital journey from planning through implementation, ensuring seamless adoption.',
    link: '/services',
  },
  {
    icon: Lightbulb,
    title: 'Product & Innovation',
    description:
      'From concept to launch, we help you build products that resonate. Our innovation-driven approach ensures your ideas reach their full market potential.',
    link: '/services',
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="services" className="bg-[#F5F5F5] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4"
          >
            WHAT WE DO
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4"
          >
            Expertise built on insight & experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#666666] text-base sm:text-lg"
          >
            We deliver strategic solutions grounded in research, experience, and
            industry best practices.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#7CFC00]/20"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1A2E1A] flex items-center justify-center mb-5 group-hover:bg-[#7CFC00] transition-colors duration-300">
                <service.icon className="w-6 h-6 text-white group-hover:text-[#1A2E1A] transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-3">
                {service.title}
              </h3>
              <p className="text-[#666666] text-sm sm:text-base leading-relaxed mb-5">
                {service.description}
              </p>
              <Link
                href={service.link}
                className="inline-flex items-center gap-1.5 text-[#1A2E1A] text-sm font-semibold group-hover:text-[#7CFC00] transition-colors"
              >
                Learn More
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
            href="/services"
            className="inline-flex items-center gap-2 bg-[#1A2E1A] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-[#243824] transition-colors duration-300 group shadow-lg shadow-[#1A2E1A]/10"
          >
            VIEW ALL SERVICES
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
