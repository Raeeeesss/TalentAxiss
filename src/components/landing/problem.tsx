"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const pains = [
  {
    before: "Candidate details scattered across WhatsApp groups, notebooks, and memory.",
    after:  "Every candidate in one searchable database with full history.",
  },
  {
    before: "No idea where each candidate stands in the pipeline at any given moment.",
    after:  "Visual pipeline shows every candidate's stage in real time.",
  },
  {
    before: "Missing follow-ups because there's no system to track due dates.",
    after:  "Automated follow-up reminders so nothing falls through the cracks.",
  },
  {
    before: "Matching candidates to jobs is slow, manual, and based on gut feel.",
    after:  "AI ranks your candidate pool against any job in seconds.",
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-16 md:py-24 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16">
          <p className="text-[12px] font-semibold text-amber-500 uppercase tracking-widest mb-3">The problem</p>
          <h2 className="text-[38px] sm:text-[48px] font-extrabold text-gray-950 tracking-tight leading-[1.08] max-w-lg">
            Every agency hits the same wall.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-3">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.07 }}
              className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-red-500">✕</span>
                </div>
                <p className="text-[14px] text-gray-500 leading-snug">{p.before}</p>
              </div>
              <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-emerald-600">✓</span>
                </div>
                <p className="text-[14px] text-gray-900 font-medium leading-snug">{p.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
