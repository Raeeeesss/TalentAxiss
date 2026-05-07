"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  { q:"Is TalentAxiss only for Kerala agencies?",           a:"Built for Kerala — Gulf placements, Kerala districts, and local job categories are all first-class. Any Indian placement consultancy can use it." },
  { q:"What happens after the 7-day free trial?",           a:"You drop to the Free plan (100 candidates, 1 user) at no cost. Upgrade to Pro at ₹2,999/month when you need more." },
  { q:"Can I import my existing candidate data?",           a:"Yes. Upload CVs and AI parses them automatically. Our team can assist with bulk CSV migration for large databases." },
  { q:"How does the AI matching work?",                     a:"Provide a job description. The engine scores every active candidate against it — skills, experience, Gulf history, availability. Ranked shortlist in seconds." },
  { q:"Is my data safe?",                                   a:"All data is encrypted in transit and at rest. Automated backups. Your data belongs to you and is never used to train any model." },
  { q:"Can multiple staff members use it?",                 a:"Pro allows 5 team members, Max removes the limit. Assign candidates to recruiters and track performance separately." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-6 group">
        <span className={`text-[15px] font-semibold transition-colors ${open ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800"}`}>
          {q}
        </span>
        <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
          open ? "border-blue-600 bg-blue-600" : "border-slate-200 group-hover:border-blue-300"
        }`}>
          <Plus className={`h-3.5 w-3.5 transition-all duration-300 ${open ? "rotate-45 text-white" : "text-slate-400"}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden">
            <p className="text-[14px] text-slate-500 leading-relaxed pb-5 pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id="faq" ref={ref} className="bg-slate-50 py-16 md:py-24 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14">
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-4">FAQ</p>
          <h2 className="text-[38px] sm:text-[52px] font-black text-slate-900 leading-none tracking-tight">
            Common questions.
          </h2>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden px-8">
          {faqs.map(f => <FAQItem key={f.q} {...f} />)}
        </motion.div>
      </div>
    </section>
  );
}
