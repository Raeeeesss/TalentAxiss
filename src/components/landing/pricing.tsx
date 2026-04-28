"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const plans = [
  {
    name: "Free Trial",
    icon: Star,
    price: 0,
    period: "7 days",
    badge: null,
    description: "Try TalentAxiss risk-free. No credit card needed.",
    cardClass: "bg-white border-gray-200",
    iconClass: "bg-gray-100 text-gray-600",
    featured: false,
    features: [
      "Up to 100 candidates",
      "AI CV parsing (10/day)",
      "Basic candidate search",
      "1 team member",
      "Job openings (up to 5)",
      "Pipeline tracking",
      "Email support",
    ],
    excluded: ["AI matching engine", "Advanced analytics", "Bulk export", "Priority support"],
    cta: "Start Free Trial",
    ctaClass: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200",
  },
  {
    name: "Pro",
    icon: Zap,
    price: 2999,
    period: "per month",
    badge: "Most Popular",
    description: "For growing agencies ready to scale with AI.",
    cardClass: "bg-gray-950 border-gray-900 text-white",
    iconClass: "bg-indigo-500 text-white",
    featured: true,
    features: [
      "Unlimited candidates",
      "Unlimited AI CV parsing",
      "AI matching engine",
      "Up to 5 team members",
      "Unlimited job openings",
      "Advanced analytics & reports",
      "Backout risk detection",
      "Follow-up automation",
      "Bulk CV upload",
      "PDF profile export",
      "CSV import",
      "Priority email support",
    ],
    excluded: ["White-label branding", "API access", "Dedicated manager"],
    cta: "Start Pro Plan",
    ctaClass: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30",
  },
  {
    name: "Max",
    icon: Crown,
    price: 7999,
    period: "per month",
    badge: "Full Power",
    description: "Complete automation for serious agencies.",
    cardClass: "bg-white border-amber-200",
    iconClass: "bg-amber-100 text-amber-600",
    featured: false,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "White-label branding",
      "API integrations",
      "Advanced AI automation",
      "Custom invoice templates",
      "WhatsApp import",
      "Dedicated account manager",
      "SLA support (4hr response)",
      "Data export (all formats)",
      "Custom domain",
      "Gulf recruitment suite",
    ],
    excluded: [],
    cta: "Get Max Plan",
    ctaClass: "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/25",
  },
];

export function PricingSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" ref={ref} className="py-28 px-4 relative bg-white">
      <div className="absolute top-0 inset-x-0 h-px mesh-divider" />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs text-indigo-600 font-semibold">Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-4">
            Invest in Growth,
            <br />
            <span className="gradient-text">Not Overhead</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            One placement fee covers months of TalentAxiss Pro. The ROI is instant.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annual
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .12, duration: .6, ease: [.22, 1, .36, 1] }}
              className={`relative rounded-2xl border p-6 flex flex-col ${plan.cardClass} ${
                plan.featured ? "lg:-mt-4 lg:pb-10 shadow-2xl shadow-gray-900/20" : "shadow-sm"
              } transition-shadow hover:shadow-xl`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    plan.featured ? "bg-indigo-600 text-white" : "bg-amber-500 text-white"
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.iconClass}`}>
                  <plan.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className={`font-bold ${plan.featured ? "text-white" : "text-gray-900"}`}>{plan.name}</div>
                  <div className={`text-xs ${plan.featured ? "text-gray-400" : "text-gray-400"}`}>{plan.description}</div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className={`text-4xl font-bold ${plan.featured ? "text-white" : "text-gray-900"}`}>Free</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.featured ? "text-white" : "text-gray-900"}`}>
                      {formatCurrency(annual ? Math.round(plan.price * .8) : plan.price)}
                    </span>
                    <span className={`text-sm ${plan.featured ? "text-gray-400" : "text-gray-400"}`}>/{plan.period}</span>
                  </div>
                )}
                {annual && plan.price > 0 && (
                  <div className="text-xs text-emerald-500 mt-1 font-medium">
                    Save {formatCurrency(plan.price * .2 * 12)} per year
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.featured ? "text-gray-300" : "text-gray-600"}`}>
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/auth/register">
                <button className={`w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all ${plan.ctaClass}`}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: .5 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          All prices include GST · Cancel anytime · 7-day money back guarantee
        </motion.p>
      </div>
    </section>
  );
}
