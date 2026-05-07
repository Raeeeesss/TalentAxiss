"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AIDemo() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#050507] py-28 relative overflow-hidden">

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.2em] mb-6">
            Start today
          </p>

          <h2 className="text-[44px] sm:text-[58px] font-black text-white leading-none tracking-[-0.035em] mb-6">
            Your agency.
            <br />
            <span className="text-white/30">Running properly.</span>
          </h2>

          <p className="text-[16px] text-white/35 leading-relaxed mb-10 max-w-md mx-auto">
            Join 156+ Kerala recruitment consultancies that switched from
            WhatsApp chaos to a proper CRM.
            First 7 days free — no card needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2.5 h-14 px-8 rounded-2xl font-bold text-[15px] overflow-hidden text-black shadow-[0_0_60px_rgba(245,158,11,0.25)]"
                style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)" }}
              >
                Start free — 7 days
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </Link>
            <a href="mailto:hello@talentaxiss.in"
              className="text-[15px] font-medium text-white/30 hover:text-white/60 transition-colors">
              Talk to us first
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {["No credit card","Cancel any time","156+ agencies trust TalentAxiss"].map(t => (
              <span key={t} className="text-[12px] text-white/20 font-medium">{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
