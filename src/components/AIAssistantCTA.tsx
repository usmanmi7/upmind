'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, ArrowRight, Brain, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AIAssistantCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-[#F5F5F5] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-[#1A2E1A] to-[#2D4A2D] rounded-3xl overflow-hidden shadow-2xl shadow-black/20"
        >
          {/* Decorative elements */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#7CFC00]/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#7CFC00]/5 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16 items-center">
            {/* Left content */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-[#7CFC00]/10 border border-[#7CFC00]/20 text-[#7CFC00] text-sm px-4 py-1.5 rounded-full font-medium mb-6"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI-POWERED CONSULTING
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
              >
                Meet your <span className="text-[#7CFC00]">AI consultant</span>,
                available 24/7
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              >
                Get instant, personalized advice on startup strategy, business
                planning, growth, fundraising, and more. Powered by GLM-5.2 and
                trained on Upmind&apos;s full consulting framework.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-8"
              >
                <Link
                  href="/ai-assistant"
                  className="bg-[#7CFC00] text-[#1A2E1A] rounded-full px-7 py-3.5 text-sm sm:text-base font-semibold hover:bg-[#6BE000] transition-all duration-300 shadow-lg shadow-[#7CFC00]/20 flex items-center gap-2 group"
                >
                  Try AI Assistant Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-white/80 border border-white/15 rounded-full px-7 py-3.5 text-sm sm:text-base font-medium hover:bg-white/5 hover:border-white/25 transition-all duration-300"
                >
                  Sign up for full access
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/40 text-sm"
              >
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#7CFC00]" />
                  No sign-up needed
                </span>
                <span className="hidden sm:inline text-white/10">|</span>
                <span className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-[#7CFC00]" />
                  Powered by GLM-5.2
                </span>
              </motion.div>
            </div>

            {/* Right - chat preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 backdrop-blur-sm">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                    <div className="w-3 h-3 rounded-full bg-green-400/40" />
                  </div>
                  <div className="flex-1 mx-6">
                    <div className="bg-white/5 rounded-md px-3 py-1.5 text-white/30 text-xs text-center max-w-xs mx-auto">
                      upmind-seven.vercel.app/ai-assistant
                    </div>
                  </div>
                </div>

                {/* Mock chat */}
                <div className="p-5 space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[80%]">
                      What should I focus on for my SaaS MVP?
                    </div>
                  </div>

                  {/* AI response preview */}
                  <div className="flex justify-start">
                    <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white/60">GLM-5.2</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        Nail one problem before scaling
                      </h4>
                      <p className="text-xs text-white/70 leading-relaxed mb-2">
                        Pick the single biggest pain your users feel and ship the
                        smallest fix that solves it. Don&apos;t build features
                        until 10 users ask for the same one.
                      </p>
                      <div className="space-y-1.5 mt-2">
                        {['Talk to 10 potential users this week', 'Ship the smallest fix that solves their top complaint', 'Charge from day one to test real demand'].map((step, i) => (
                          <div key={i} className="flex gap-2 text-xs text-white/70">
                            <span className="w-4 h-4 rounded-full bg-[#7CFC00]/20 text-[#7CFC00] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex justify-start">
                    <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
