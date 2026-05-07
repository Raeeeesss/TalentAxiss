"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  { tag:"Candidate Database", title:"Every candidate, always findable.",         body:"Search by skill, district, visa, Gulf history, or custom tag. 1,000+ candidates searched in under a second.", wide:true,  color:"#2563eb" },
  { tag:"AI Matching",        title:"AI ranks your pool.",                       body:"Paste a job. The engine scores every candidate — best fit first, in seconds.",                                  wide:false, color:"#6366f1" },
  { tag:"Pipeline",           title:"Visual pipeline.",                          body:"Applied → Interview → Offer → Joined. Every stage timestamped. Your team sees one picture.",                   wide:false, color:"#0ea5e9" },
  { tag:"Follow-ups",         title:"Never miss a call.",                        body:"Overdue follow-ups surface every morning. Assign to team members. Nothing falls through.",                     wide:false, color:"#7c3aed" },
  { tag:"Analytics",          title:"Revenue, placements, and team stats — live.",body:"Monthly trends, per-recruiter stats, category breakdowns, and revenue update in real time.",                  wide:true,  color:"#0284c7" },
  { tag:"Gulf Mode",          title:"Built for Gulf placements.",                body:"Passport status, ECNR, visa type, Gulf experience — first-class fields, not afterthoughts.",                  wide:false, color:"#0891b2" },
];

export function FeaturesGrid() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id="features" ref={ref} className="bg-slate-50 py-24 border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center">
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-4">Product</p>
          <h2 className="text-[38px] sm:text-[52px] font-black text-slate-900 leading-none tracking-tight">
            Everything your agency needs.
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <motion.div key={f.tag}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className={`group relative rounded-2xl border border-slate-200 bg-white p-7 overflow-hidden cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/80 hover:border-slate-300 ${
                f.wide ? "sm:col-span-2" : ""
              }`}
            >
              {/* Colour orb */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle,${f.color}18,transparent 70%)` }}
              />
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: `linear-gradient(90deg,transparent,${f.color},transparent)` }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest mb-4 block" style={{ color: f.color }}>
                {f.tag}
              </span>
              <h3 className="text-[18px] font-bold text-slate-900 leading-snug tracking-tight mb-3">{f.title}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
