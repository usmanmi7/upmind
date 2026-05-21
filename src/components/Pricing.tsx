'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with the basics',
    features: [
      '1 startup profile',
      'Basic resources & templates',
      'Community forum access',
      '1 consultation per month',
      'Email support',
    ],
    popular: false,
    cta: 'Start Free',
    href: '/auth/signup',
  },
  {
    name: 'Growth Pro',
    price: '$49',
    description: 'For serious founders ready to scale',
    features: [
      'Unlimited startup profiles',
      'Premium resources & templates',
      'Priority consultations (4/mo)',
      'Custom roadmap builder',
      'AI-powered insights',
      'Dedicated consultant',
      'Advanced analytics',
      'Document vault',
    ],
    popular: true,
    cta: 'Start Pro Trial',
    href: '/auth/signup',
  },
  {
    name: 'Enterprise',
    price: '$149',
    description: 'For teams and accelerators',
    features: [
      'Everything in Growth Pro',
      'Team collaboration (up to 10)',
      'Custom integrations & API',
      'White-label options',
      'Dedicated account manager',
      'SLA guarantee (99.9%)',
      'Unlimited consultations',
      'Priority phone support',
    ],
    popular: false,
    cta: 'Contact Sales',
    href: '/contact',
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [annual, setAnnual] = useState(false);

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.name === 'Free') return '$0';
    if (annual) {
      return plan.name === 'Growth Pro' ? '$39' : '$119';
    }
    return plan.price;
  };

  return (
    <section className="bg-[#1A2E1A] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#7CFC00] text-sm font-semibold tracking-[0.15em] uppercase block mb-4"
          >
            PRICING
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4"
          >
            Flexible plans for <span className="text-[#7CFC00]">every business</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/60 text-base sm:text-lg"
          >
            Clear pricing, no hidden fees. Choose the plan that works best for your goals.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-[#7CFC00]' : 'bg-white/20'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${annual ? 'translate-x-5' : ''}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-white/40'}`}>
            Annual
            <span className="ml-1.5 text-xs text-[#7CFC00] font-semibold">Save 20%</span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#7CFC00]/10 border-2 border-[#7CFC00]/40 hover:border-[#7CFC00]/60 md:scale-105'
                  : 'bg-white/5 border border-white/10 hover:border-[#7CFC00]/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#7CFC00] text-[#1A2E1A] text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-white font-bold font-heading text-lg sm:text-xl mb-2">
                {plan.name}
              </h3>
              <p className="text-white/50 text-sm mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-[#7CFC00] text-3xl sm:text-4xl font-bold font-heading">
                  {getPrice(plan)}
                </span>
                <span className="text-white/40 text-sm ml-1">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7CFC00] shrink-0 mt-0.5" />
                    <span className="text-white/70 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center rounded-full py-3.5 text-sm font-semibold transition-all duration-300 group ${
                  plan.popular
                    ? 'bg-[#7CFC00] text-[#1A2E1A] hover:bg-[#6BE000] shadow-lg shadow-[#7CFC00]/20'
                    : 'border border-white/30 text-white hover:bg-white hover:text-[#1A2E1A]'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 inline ml-1 group-hover:translate-x-1 transition-transform" />
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
          <p className="text-white/40 text-sm mb-4">
            Need a custom plan? We&apos;d love to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[#7CFC00] text-sm font-medium hover:underline group"
          >
            Contact Sales
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
