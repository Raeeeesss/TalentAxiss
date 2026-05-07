"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    tag:   "Candidate Database",
    title: "Every candidate, always findable.",
    body:  "Search by skill, district, visa status, Gulf history, or any custom tag. 1,000 candidates searched in under a second.",
    wide:  true,
    color: "#6366f1",
  },
  {
    tag:   "AI Matching",
    title: "AI ranks your pool.",
    body:  "Paste a job. The engine reads your full candidate list and scores every match — best fit first.",
    wide:  false,
    color: "#f59e0b",
  },
  {
    tag:   "Pipeline",
    title: "Visual pipeline.",
    body:  "Applied → Interview → Offer → Joined. Every stage timestamped. Your whole team sees one picture.",
    wide:  false,
    color: "#10b981",
  },
  {
    tag:   "Follow-ups",
    title: "Never miss a call.",
    body:  "Overdue follow-ups surface automatically every morning. Assign to team members. Nothing falls through.",
    wide:  false,
    color: "#8b5cf6",
  },
  {
    tag:   "Analytics",
    title: "Revenue, placements, and team performance — live.",
    body:  "Monthly trends, per-recruiter stats, category breakdowns, and revenue tracking update in real time.",
    wide:  true,
    color: "#ec4899",
  },
  {
    tag:   "Gulf Mode",
    title: "Built for Gulf placements.",
    body:  "Passport status, ECNR, visa type, Gulf experience — first-class fields, not afterthoughts.",
    wide:  false,
    color: "#14b8a6",
  },
];

export function FeaturesGrid() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" ref={ref} className="bg-[#050507] py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">Product</p>
          <h2 className="text-[40px] sm:text-[54px] font-black text-white leading-[1.0] tracking-[-0.03em]">
            Everything your agency needs.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`group relative rounded-2xl border border-white/[0.07] p-7 overflow-hidden cursor-default transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${
                f.wide ? "sm:col-span-2" : ""
              }`}
              style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
            >
              {/* Color orb on hover */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle,${f.color}22 0%,transparent 70%)` }}
              />

              {/* Gradient bottom border on hover */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg,transparent,${f.color},transparent)`, transition: "opacity 0.4s" }}
              />

              <span className="text-[10px] font-bold uppercase tracking-widest mb-4 block" style={{ color: f.color }}>
                {f.tag}
              </span>
              <h3 className="text-[19px] font-bold text-white leading-snug tracking-tight mb-3">{f.title}</h3>
              <p className="text-[14px] text-white/40 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
