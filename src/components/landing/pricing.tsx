"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name:  "Free",
    price: "₹0",
    desc:  "Get started. No card required.",
    trial: "7-day trial of Pro included",
    cta:   "Start for free",
    href:  "/auth/register",
    features: [
      "Up to 100 candidates",
      "1 team member",
      "AI CV parsing",
      "Basic pipeline",
      "Follow-up reminders",
    ],
    highlight: false,
  },
  {
    name:  "Pro",
    price: "₹2,999",
    per:   "/month",
    desc:  "For growing consultancies.",
    cta:   "Start free trial",
    href:  "/auth/register",
    features: [
      "Unlimited candidates",
      "Up to 5 team members",
      "AI matching & scoring",
      "Full pipeline & analytics",
      "Gulf recruitment mode",
      "Revenue tracking",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name:  "Max",
    price: "₹7,999",
    per:   "/month",
    desc:  "For large agencies & chains.",
    cta:   "Contact us",
    href:  "mailto:hello@talentaxiss.in",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Custom branding",
      "Backout risk AI",
      "Dedicated onboarding",
      "API access",
      "SLA guarantee",
    ],
    highlight: false,
  },
];

export function PricingSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="pricing" ref={ref} className="bg-white py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold text-amber-500 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-[38px] sm:text-[48px] font-extrabold text-gray-950 tracking-tight leading-[1.08]">
            Simple, honest pricing.
          </h2>
          <p className="mt-3 text-[16px] text-gray-500 max-w-md">
            Start free. Upgrade when you need more. Cancel any time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
              className={`rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? "bg-gray-950 border border-gray-800"
                  : "bg-white border border-gray-150 hover:border-gray-200"
              } transition-colors`}
            >
              <div className="mb-6">
                <div className={`text-[12px] font-semibold uppercase tracking-widest mb-1 ${plan.highlight ? "text-amber-400" : "text-gray-400"}`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-[36px] font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-gray-950"}`}>
                    {plan.price}
                  </span>
                  {plan.per && (
                    <span className={`text-[14px] font-medium ${plan.highlight ? "text-white/40" : "text-gray-400"}`}>{plan.per}</span>
                  )}
                </div>
                <p className={`text-[13px] mt-1 ${plan.highlight ? "text-white/40" : "text-gray-400"}`}>{plan.desc}</p>
                {plan.trial && (
                  <div className="mt-2 inline-block bg-amber-400/15 text-amber-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {plan.trial}
                  </div>
                )}
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px]">
                    <Check className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-emerald-400" : "text-emerald-500"}`} />
                    <span className={plan.highlight ? "text-white/70" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button className={`w-full h-11 rounded-xl text-[14px] font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-white text-gray-950 hover:bg-white/90"
                    : "bg-gray-950 text-white hover:bg-gray-800"
                }`}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
