'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Rocket, BarChart3, Megaphone, DollarSign, Users, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Rocket,
    title: 'Startup Strategy & Validation',
    description:
      'Validate your idea before investing time and money. We help you test assumptions, identify your market, and build a solid foundation.',
    features: ['Market Research & Analysis', 'Idea Validation Sprints', 'Business Model Canvas', 'Competitive Landscape Mapping'],
    color: 'from-[#2D4A2D] to-[#8FBC8F]',
  },
  {
    icon: BarChart3,
    title: 'Product Development & Growth',
    description:
      'From MVP to scale. Get expert guidance on product strategy, user acquisition, and growth loops that actually work.',
    features: ['MVP Roadmap Planning', 'Product-Market Fit Analysis', 'Growth Hacking Strategies', 'User Retention Optimization'],
    color: 'from-[#7CFC00] to-[#2D4A2D]',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Brand Building',
    description:
      'Build a brand that resonates and a marketing engine that scales. From content strategy to paid acquisition.',
    features: ['Brand Identity & Positioning', 'Content Marketing Strategy', 'Paid Acquisition Playbook', 'Social Media Growth'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: DollarSign,
    title: 'Fundraising & Investor Relations',
    description:
      'Navigate the fundraising landscape with confidence. We help you prepare, pitch, and close your next round.',
    features: ['Pitch Deck Optimization', 'Financial Model Building', 'Investor Introduction', 'Due Diligence Prep'],
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Team Building & Culture',
    description:
      'Your startup is only as strong as your team. Learn to hire, retain, and build a culture that scales.',
    features: ['Hiring Frameworks', 'Culture Playbook', 'Compensation Strategy', 'Remote Team Management'],
    color: 'from-[#8FBC8F] to-[#2D4A2D]',
  },
  {
    icon: Bot,
    title: 'AI & Digital Transformation',
    description:
      'Leverage AI to automate, optimize, and innovate. Stay ahead of the curve with practical AI implementation.',
    features: ['AI Strategy Assessment', 'Automation Roadmap', 'AI-Powered Product Features', 'Data Infrastructure'],
    color: 'from-yellow-500 to-orange-500',
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
            Everything you need to <span className="text-[#1A2E1A]">build & scale</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#666666] text-base sm:text-lg"
          >
            From idea validation to global expansion, our expert consultants guide you through every stage of your startup journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-default border border-transparent hover:border-[#7CFC00]/20 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                {service.title}
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <ul className="space-y-2 mt-auto">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[#666666]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CFC00] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
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
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
