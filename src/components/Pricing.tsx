'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter Plan',
    description: 'Best for small teams or short-term guidance',
    price: '$99.00',
    originalPrice: '$149.00',
    features: [
      'Strategy assessment & roadmap',
      '2 consulting sessions per month',
      'Market analysis report',
      'Email support',
    ],
    popular: false,
  },
  {
    name: 'Growth Plan',
    description: 'Ideal for teams improving operations or scaling up',
    price: '$499.00',
    originalPrice: '$699.00',
    features: [
      'Full strategic planning & execution',
      'Weekly consulting sessions',
      'Custom analytics dashboard',
      'Priority support & Slack access',
      'Quarterly business review',
    ],
    popular: true,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-[#1A2E1A] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
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
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7CFC00] mb-4"
          >
            Flexible plans for every business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/70 text-base sm:text-lg"
          >
            Clear pricing, no hidden fees. Choose the plan that works best for
            your goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#7CFC00]/10 border-2 border-[#7CFC00]/40 hover:border-[#7CFC00]/60'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#7CFC00]/30'
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
              <p className="text-white/60 text-sm sm:text-base mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#7CFC00] shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm sm:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mb-6">
                <span className="text-[#7CFC00] text-3xl sm:text-4xl font-bold font-heading">
                  {plan.price}
                </span>
                <span className="text-white/40 text-base sm:text-lg line-through ml-3">
                  {plan.originalPrice}
                </span>
                <span className="text-white/50 text-sm ml-1">/month</span>
              </div>

              <Link
                href="/auth/signup"
                className={`block text-center rounded-full py-3.5 text-sm sm:text-base font-semibold transition-all duration-300 group ${
                  plan.popular
                    ? 'bg-[#7CFC00] text-[#1A2E1A] hover:bg-[#6BE000] shadow-lg shadow-[#7CFC00]/20'
                    : 'border border-white/30 text-white hover:bg-white hover:text-[#1A2E1A]'
                }`}
              >
                GET STARTED
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
          <p className="text-white/50 text-sm mb-4">
            Need a custom plan? We&apos;d love to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[#7CFC00] text-sm font-medium hover:underline group"
          >
            CONTACT SALES
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
