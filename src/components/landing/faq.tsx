"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Is TalentAxiss only for Kerala agencies?",
    a: "It's built specifically for Kerala's recruitment market — Gulf placements, Kerala districts, Malayalam naming conventions, and local job categories are all first-class. That said, any Indian placement consultancy can use it.",
  },
  {
    q: "What happens after the 7-day free trial?",
    a: "You can continue on the Free plan (up to 100 candidates, 1 user) with no time limit. If you want unlimited candidates or more team members, upgrade to Pro at ₹2,999/month.",
  },
  {
    q: "Can I import my existing candidate data?",
    a: "Yes. You can upload CVs and our AI parser extracts candidate details automatically. For bulk imports, our onboarding team can assist with CSV migration.",
  },
  {
    q: "How does the AI matching work?",
    a: "You provide a job description. The engine scores every active candidate in your database against it — evaluating skills, experience, Gulf history, location, and availability. You get a ranked shortlist in seconds.",
  },
  {
    q: "Is my data safe?",
    a: "All data is encrypted in transit and at rest. We use Neon PostgreSQL with automated backups. Your candidate data belongs to you and is never shared or used to train any model.",
  },
  {
    q: "Can multiple staff members use it?",
    a: "Pro allows up to 5 team members. Max removes the limit. You can assign candidates to specific recruiters and track team performance separately.",
  },
  {
    q: "Do you offer onboarding help?",
    a: "All Max plan users get dedicated onboarding. Pro users get access to our documentation and email support. We typically respond within 24 hours.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-[15px] font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{q}</span>
        <div className={`w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center shrink-0 transition-all ${open ? "bg-gray-950 border-gray-950" : "group-hover:border-gray-400"}`}>
          <Plus className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-45 text-white" : "text-gray-500"}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="text-[14px] text-gray-500 leading-relaxed pb-5">{a}</p>
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
    <section id="faq" ref={ref} className="bg-white py-24 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <p className="text-[12px] font-semibold text-amber-500 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-[38px] sm:text-[48px] font-extrabold text-gray-950 tracking-tight leading-[1.08]">
            Common questions.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
        >
          {faqs.map(f => <FAQItem key={f.q} {...f} />)}
        </motion.div>
      </div>
    </section>
  );
}
