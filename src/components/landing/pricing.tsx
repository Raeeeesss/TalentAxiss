"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
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
    gradient: "from-white/10 to-white/5",
    border: "border-border",
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
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    icon: Zap,
    price: 2999,
    period: "per month",
    badge: "Most Popular",
    description: "For growing agencies ready to scale with AI.",
    gradient: "from-indigo-600/20 to-purple-600/10",
    border: "border-indigo-500/30",
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
    ctaVariant: "gradient" as const,
  },
  {
    name: "Max",
    icon: Crown,
    price: 7999,
    period: "per month",
    badge: "Full Power",
    description: "For serious agencies who want complete automation.",
    gradient: "from-amber-600/15 to-orange-600/10",
    border: "border-amber-500/30",
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
    ctaVariant: "gradient-gold" as const,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" ref={ref} className="py-24 px-4 relative">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/8 blur-[100px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs text-indigo-400 font-medium">Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Invest in Growth,
            <br />
            <span className="gradient-text">Not Overhead</span>
          </h2>
          <p className="text-foreground/50 text-lg max-w-xl mx-auto mb-8">
            One placement fee covers months of TalentAxiss Pro. The ROI is instant.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-border rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!annual ? "bg-indigo-600 text-foreground" : "text-foreground/40"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-indigo-600 text-foreground" : "text-foreground/40"}`}
            >
              Annual
              <span className="text-xs bg-emerald-500 text-foreground px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border ${plan.border} bg-linear-to-b ${plan.gradient} p-6 flex flex-col ${i === 1 ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-linear-to-r from-indigo-600 to-purple-600 text-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${i === 0 ? "from-slate-500 to-slate-700" : i === 1 ? "from-indigo-500 to-purple-600" : "from-amber-500 to-orange-600"} flex items-center justify-center`}>
                  <plan.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground">{plan.name}</div>
                  <div className="text-xs text-foreground/40">{plan.description}</div>
                </div>
              </div>

              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className="text-4xl font-bold text-foreground">Free</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {formatCurrency(annual ? Math.round(plan.price * 0.8) : plan.price)}
                    </span>
                    <span className="text-foreground/40 text-sm">/{plan.period}</span>
                  </div>
                )}
                {annual && plan.price > 0 && (
                  <div className="text-xs text-emerald-400 mt-1">
                    Save {formatCurrency(plan.price * 0.2 * 12)} per year
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/70">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/auth/register">
                <Button variant={plan.ctaVariant} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-foreground/30 mt-8"
        >
          All prices include GST. Cancel anytime. 7-day money back guarantee.
        </motion.p>
      </div>
    </section>
  );
}
