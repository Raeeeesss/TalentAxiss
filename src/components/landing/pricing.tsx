"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const features = [
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
    <section id="pricing" ref={ref} className="bg-[#080809] py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">Pricing</p>
          <h2 className="text-[40px] sm:text-[54px] font-black text-white leading-[1.0] tracking-[-0.03em]">
            Simple. No surprises.
          </h2>
          <p className="mt-4 text-[16px] text-white/35">
            Start free. Upgrade when you need it. Cancel any time.
          </p>
        </motion.div>

        {/* Three tiers — highlight on Pro */}
        <div className="grid sm:grid-cols-3 gap-4 items-start">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/[0.07] p-7"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">Free</div>
            <div className="text-[38px] font-black text-white mb-1">₹0</div>
            <div className="text-[13px] text-white/30 mb-6">Forever free, 100 candidates</div>
            {["100 candidates","1 team member","Basic pipeline","AI CV parsing"].map(f => (
              <div key={f} className="flex items-center gap-2.5 mb-3 text-[13px] text-white/40">
                <Check className="h-3.5 w-3.5 text-white/20 shrink-0" />{f}
              </div>
            ))}
            <Link href="/auth/register">
              <button className="w-full h-11 rounded-xl border border-white/10 text-[13px] font-semibold text-white/50 hover:border-white/20 hover:text-white/70 transition-all mt-4">
                Get started
              </button>
            </Link>
          </motion.div>

          {/* Pro — LIQUID GLASS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.18 }}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl overflow-hidden"
            style={{ zIndex: 1 }}
          >
            {/* Gradient glow behind */}
            <div className="absolute -inset-px rounded-2xl"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#f59e0b)", zIndex: -1 }}
            />

            {/* Liquid glass surface */}
            <div className="relative m-px rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg,rgba(30,27,60,0.97) 0%,rgba(20,18,45,0.97) 100%)",
                backdropFilter: "blur(40px) saturate(200%)",
              }}
            >
              {/* Noise shimmer overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Gradient blob top */}
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)" }}
              />

              <div className="relative p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest">Pro</div>
                  <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400">Most Popular</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[42px] font-black text-white leading-none">₹2,999</span>
                  <span className="text-[14px] text-white/35">/month</span>
                </div>
                <div className="text-[13px] text-white/35 mb-7">Includes 7-day free trial</div>

                {features.map(f => (
                  <div key={f} className="flex items-center gap-3 mb-3.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5 text-emerald-400" />
                    </div>
                    <span className="text-[13px] text-white/60">{f}</span>
                  </div>
                ))}

                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="relative w-full h-12 rounded-xl font-bold text-[14px] mt-4 overflow-hidden"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff" }}
                  >
                    <motion.span
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)" }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="relative">Start free trial</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Max */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.26 }}
            className="rounded-2xl border border-white/[0.07] p-7"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">Max</div>
            <div className="text-[38px] font-black text-white mb-1">₹7,999</div>
            <div className="text-[13px] text-white/30 mb-6">For large agency chains</div>
            {["Everything in Pro","Unlimited team","Custom branding","API access","SLA guarantee","Dedicated onboarding"].map(f => (
              <div key={f} className="flex items-center gap-2.5 mb-3 text-[13px] text-white/40">
                <Check className="h-3.5 w-3.5 text-white/20 shrink-0" />{f}
              </div>
            ))}
            <a href="mailto:hello@talentaxiss.in">
              <button className="w-full h-11 rounded-xl border border-white/10 text-[13px] font-semibold text-white/50 hover:border-white/20 hover:text-white/70 transition-all mt-4">
                Contact us
              </button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
