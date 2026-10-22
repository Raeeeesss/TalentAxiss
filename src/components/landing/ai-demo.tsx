"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { useContactModal } from "@/components/providers/contact-modal-provider";

export function AIDemo() {
  const { openContactModal } = useContactModal();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className="bg-white py-16 md:py-28 relative overflow-hidden">
      {/* Blue gradient background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%,rgba(37,99,235,0.06) 0%,transparent 70%)" }}
      />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage:"radial-gradient(rgba(37,99,235,0.12) 1px,transparent 1px)", backgroundSize:"32px 32px" }}
      />
      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}>
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-6">Start today</p>
          <h2 className="text-[42px] sm:text-[56px] font-black text-slate-900 leading-none tracking-tight mb-6">
            Your agency.
            <br />
            <span className="text-blue-600">Running properly.</span>
          </h2>
          <p className="text-[16px] text-slate-500 leading-relaxed mb-10 max-w-md mx-auto">
            Join 156+ Kerala recruitment consultancies that replaced WhatsApp chaos
            with a proper CRM. First 7 days free — no card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => openContactModal("CTA - Start free 7 days")}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 h-14 px-8 rounded-2xl font-bold text-[15px] bg-blue-600 text-white shadow-xl shadow-blue-600/25 hover:bg-blue-700 transition-colors cursor-pointer">
              Start free — 7 days
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="mailto:admin@rocduert.in"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                <Mail className="h-4 w-4 text-blue-600" />
                admin@rocduert.in
              </a>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <a href="tel:8113029782"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                <Phone className="h-4 w-4 text-emerald-600" />
                8113029782
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {["No credit card","Cancel any time","156+ agencies trust TalentAxiss"].map(t => (
              <span key={t} className="text-[12px] text-slate-400 font-medium">{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
