'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Compass, Cpu, Users, BookOpen, Wrench, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Compass,
    title: 'Problem Discovery',
    description:
      'A curated database of 30+ real-world engineering problems sourced from WHO, UN, IEA, IPCC and more. Each problem comes with severity, scope, affected populations, and existing-solution analysis.',
    features: ['26 problem categories', 'Severity & impact scoring', 'Regional & scope filters', 'Sources from multilateral orgs'],
    color: 'from-[#1E3A8A] to-[#93C5FD]',
  },
  {
    icon: Sparkles,
    title: 'AI Innovation Engine',
    description:
      'Tell us your skills, interests, time, and team size. Our matching algorithm scores every problem in the database for fit, so you start with problems you can actually solve.',
    features: ['Skill-coverage scoring', 'Interest overlap matching', 'Team & time constraints', 'Reason-highlight explanations'],
    color: 'from-[#3B82F6] to-[#1E3A8A]',
  },
  {
    icon: Wrench,
    title: 'Build Playbooks',
    description:
      'Open any problem to see engineering solutions, a 4-phase build roadmap, required skills, and recommended team templates, everything you need to move from problem to project.',
    features: ['Engineering solution briefs', '12-month roadmap templates', 'Skill requirement maps', 'Battle-tested team templates'],
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: BookOpen,
    title: 'Engineering Resources',
    description:
      'Field guides, templates, and frameworks written for engineers, not generic startup advice. Reading lists, ethics frameworks, funding field guides, and lessons from builders in the field.',
    features: ['Problem-discovery guides', 'Engineering skills self-assessment', 'Career paths for innovators', 'Open-source playbooks'],
    color: 'from-[#93C5FD] to-[#1E3A8A]',
  },
  {
    icon: Users,
    title: 'Team Templates',
    description:
      'Five battle-tested team structures for software, hardware, research, open source, and field-deployment projects, including role definitions, sizes, and hiring sequences.',
    features: ['Lean software (3-5)', 'Hardware + software (5-8)', 'Research lab (3-6)', 'Field deployment (6-12)'],
    color: 'from-indigo-500 to-blue-700',
  },
  {
    icon: Cpu,
    title: 'AI Assistant',
    description:
      'An AI assistant trained on our engineering innovation framework, interview-first protocol, problem framing, build decisions, and pointers to the right resources for where you are.',
    features: ['Interview-first protocol', 'Problem framing help', 'Build-vs-research guidance', 'Resource recommendations'],
    color: 'from-sky-500 to-blue-700',
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="services" className="bg-[#F5F7FB] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#3B82F6] text-sm font-semibold tracking-[0.15em] uppercase block mb-4"
          >
            WHAT WE BUILT
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4"
          >
            Everything you need to{' '}
            <span className="font-serif-accent-italic text-[#1E3A8A]">build</span>{' '}
            <span className="text-[#0F1B3D]">what matters</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#666666] text-base sm:text-lg"
          >
            A complete platform for engineers who want to spend their time on meaningful innovation, from problem discovery to deployment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-default border border-transparent hover:border-[#3B82F6]/20 flex flex-col"
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
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
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
            href="/solve-them"
            className="inline-flex items-center gap-2 bg-[#0F1B3D] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-medium hover:bg-[#1E3A8A] transition-colors duration-300 group shadow-lg shadow-[#0F1B3D]/10"
          >
            Browse the Problem Database
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
