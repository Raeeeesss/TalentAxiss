"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const proFeatures = [
  "Unlimited candidates & CVs",
  "AI matching & scoring engine",
  "Full pipeline tracking",
  "Gulf recruitment mode",
  "Follow-up reminders",
  "Team management (5 users)",
  "Revenue & analytics dashboard",
  "Backout risk scoring",
  "Priority email support",
];

export function PricingSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="pricing" ref={ref} className="bg-white py-16 md:py-24 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-4">Pricing</p>
          <h2 className="text-[38px] sm:text-[52px] font-black text-slate-900 leading-none tracking-tight">
            Simple. No surprises.
          </h2>
          <p className="mt-4 text-[16px] text-slate-500">Start free. Upgrade when you need it. Cancel any time.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 items-start">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-7 hover:border-slate-300 hover:shadow-md transition-all duration-300">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Free</div>
            <div className="text-[38px] font-black text-slate-900 leading-none mb-1">₹0</div>
            <div className="text-[13px] text-slate-400 mb-6">Forever free · 100 candidates</div>
            {["100 candidates","1 team member","Basic pipeline","AI CV parsing"].map(f => (
              <div key={f} className="flex items-center gap-2.5 mb-3">
                <Check className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                <span className="text-[13px] text-slate-500">{f}</span>
              </div>
            ))}
            <Link href="/auth/register">
              <button className="w-full h-11 mt-5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                Get started
              </button>
            </Link>
          </motion.div>

          {/* Pro — liquid glass on light */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.18 }}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl overflow-hidden" style={{ zIndex: 1 }}>
            {/* Gradient border */}
            <div className="absolute -inset-px rounded-2xl"
              style={{ background: "linear-gradient(135deg,#2563eb,#6366f1,#0ea5e9)", zIndex: -1 }}
            />
            {/* Glass surface */}
            <div className="relative m-px rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#1e40af 0%,#1d4ed8 40%,#2563eb 100%)",
                backdropFilter: "blur(40px)",
              }}>
              {/* Shine overlay */}
              <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: "linear-gradient(to bottom,rgba(255,255,255,0.12),transparent)" }}
              />
              {/* Noise texture */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
              />
              <div className="relative p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-widest">Pro</div>
                  <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                    <Zap className="h-3 w-3 text-yellow-300" />
                    <span className="text-[10px] font-bold text-white">Most Popular</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[42px] font-black text-white leading-none">₹2,999</span>
                  <span className="text-[14px] text-blue-200">/month</span>
                </div>
                <div className="text-[13px] text-blue-200 mb-7">Includes 7-day free trial</div>
                {proFeatures.map(f => (
                  <div key={f} className="flex items-center gap-3 mb-3.5">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-[13px] text-blue-100">{f}</span>
                  </div>
                ))}
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="relative w-full h-12 mt-4 rounded-xl font-bold text-[14px] bg-white text-blue-700 overflow-hidden hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
                    Start free trial
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Max */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.26 }}
            className="rounded-2xl border border-slate-200 bg-white p-7 hover:border-slate-300 hover:shadow-md transition-all duration-300">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Max</div>
            <div className="text-[38px] font-black text-slate-900 leading-none mb-1">₹7,999</div>
            <div className="text-[13px] text-slate-400 mb-6">For large agency chains</div>
            {["Everything in Pro","Unlimited team","Custom branding","API access","SLA guarantee","Dedicated onboarding"].map(f => (
              <div key={f} className="flex items-center gap-2.5 mb-3">
                <Check className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                <span className="text-[13px] text-slate-500">{f}</span>
              </div>
            ))}
            <a href="mailto:hello@talentaxiss.in">
              <button className="w-full h-11 mt-5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                Contact us
              </button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
