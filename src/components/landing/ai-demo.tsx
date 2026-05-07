"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AIDemo() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-[#0B0B0F] py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-[12px] font-semibold text-amber-400 uppercase tracking-widest mb-6">Ready to start?</p>
          <h2 className="text-[40px] sm:text-[54px] font-extrabold text-white tracking-tight leading-[1.06] mb-6">
            Your agency. Running properly.
          </h2>
          <p className="text-[16px] text-white/40 leading-relaxed mb-10 max-w-md mx-auto">
            Join 156+ Kerala recruitment agencies that switched from WhatsApp chaos
            to a proper CRM. First 7 days free, no card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/register">
              <button className="group inline-flex items-center gap-2 h-12 px-8 bg-white text-black font-bold text-[14px] rounded-xl hover:bg-white/90 transition-colors">
                Start free trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
            <a href="mailto:hello@talentaxiss.in"
              className="h-12 px-6 inline-flex items-center text-[14px] font-medium text-white/40 hover:text-white/70 transition-colors">
              Talk to us first
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
