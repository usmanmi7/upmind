"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Crown, ArrowRight, Check, Sparkles } from "lucide-react"
import Link from "next/link"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  type: "signin" | "upgrade"
}

export default function SubscriptionModal({ isOpen, onClose, type }: SubscriptionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {type === "signin" ? (
                /* Sign In Modal */
                <div className="p-8 sm:p-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7CFC00] to-[#2D4A2D] flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2E1A] mb-3">
                    Unlock exclusive resources
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    Sign in to access our full library of startup guides, templates, and tools curated by industry experts. Join thousands of founders accelerating their growth.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "Access free guides and templates instantly",
                      "Save resources to read later",
                      "Track your learning progress",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#7CFC00]/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-[#2D4A2D]" />
                        </div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/auth/login"
                    className="w-full flex items-center justify-center gap-2 bg-[#1A2E1A] text-white rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#243824] transition-colors"
                  >
                    Sign In to Continue
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-[#2D4A2D] font-semibold hover:underline">
                      Sign up free
                    </Link>
                  </p>
                </div>
              ) : (
                /* Upgrade Modal */
                <div>
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-br from-[#1A2E1A] to-[#2D4A2D] p-8 sm:p-10 pb-12 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7CFC00]/10 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#7CFC00]/5 translate-y-1/3 -translate-x-1/3" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-[#7CFC00]/20 flex items-center justify-center mb-4">
                        <Crown className="w-7 h-7 text-[#7CFC00]" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Premium Resource
                      </h2>
                      <p className="text-white/70 text-base">
                        This resource is exclusively available for Growth Pro and Enterprise members.
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 sm:p-10 pt-6 -mt-4 bg-white rounded-t-3xl relative z-10">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-[#1A2E1A] mb-1">
                        Upgrade to Growth Pro
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Unlock all premium resources and accelerate your startup journey.
                      </p>
                    </div>

                    <div className="space-y-3 mb-8">
                      {[
                        "Unlimited access to all premium resources",
                        "4 expert consultations per month",
                        "Custom AI-powered growth roadmap",
                        "Dedicated consultant support",
                        "Advanced analytics & insights",
                        "Document vault & templates",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#7CFC00]/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[#2D4A2D]" />
                          </div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/pricing"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7CFC00] to-[#2D4A2D] text-[#1A2E1A] rounded-full px-8 py-3.5 text-base font-bold hover:shadow-lg hover:shadow-[#7CFC00]/20 transition-all"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade to Growth Pro — $49/mo
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      Cancel anytime. 30-day money-back guarantee.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
