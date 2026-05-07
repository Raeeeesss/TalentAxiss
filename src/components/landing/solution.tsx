"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    n:     "01",
    title: "Add your candidates",
    body:  "Upload a CV and AI fills the profile automatically — name, skills, experience, Gulf history, preferred roles. Or add manually in 60 seconds.",
  },
  {
    n:     "02",
    title: "Post a job, run AI matching",
    body:  "Add a job requirement and hit Match. The engine ranks your entire candidate pool and shows you the best fits with a score and reasoning.",
  },
  {
    n:     "03",
    title: "Move them through your pipeline",
    body:  "Drag candidates from Applied to Interview to Offer to Joined. Every stage is timestamped. Your whole team sees the same picture.",
  },
  {
    n:     "04",
    title: "Track placements and revenue",
    body:  "When a candidate joins, log the placement fee. Revenue, success rate, and team performance update in your analytics dashboard automatically.",
  },
];

export function SolutionSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="solution" ref={ref} className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold text-amber-500 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-[38px] sm:text-[48px] font-extrabold text-gray-950 tracking-tight leading-[1.08] max-w-lg">
            Running your agency is simple now.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
              className="border border-gray-100 rounded-2xl p-7 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
            >
              <div className="text-[11px] font-black text-gray-300 tracking-widest mb-4">{s.n}</div>
              <h3 className="text-[18px] font-bold text-gray-950 tracking-tight mb-2">{s.title}</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
