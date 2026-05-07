"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    tag:   "Candidate Database",
    title: "Every candidate, always findable.",
    body:  "Search 1,000s of candidates by skill, district, visa status, experience, or Gulf history in under 2 seconds. Add custom tags, attach CVs, and track every interaction.",
    span:  "col-span-2",
  },
  {
    tag:   "AI Matching",
    title: "AI ranks your pool against any job.",
    body:  "Paste a job requirement. The engine reads your full candidate list and returns a scored shortlist — best fit first — in seconds. No manual sifting.",
    span:  "col-span-1",
  },
  {
    tag:   "Pipeline",
    title: "Visual pipeline from applied to joined.",
    body:  "Drag candidates through stages: Applied → Shortlisted → Interview → Offer → Joined. See your whole operation at a glance.",
    span:  "col-span-1",
  },
  {
    tag:   "Follow-ups",
    title: "Never miss a follow-up.",
    body:  "Set reminders, assign tasks to team members, and track due dates. Overdue tasks surface automatically every morning.",
    span:  "col-span-1",
  },
  {
    tag:   "Analytics",
    title: "Revenue, placements, success rate.",
    body:  "Monthly placement trends, revenue tracking, team performance, category breakdowns — everything your agency needs to grow intentionally.",
    span:  "col-span-2",
  },
  {
    tag:   "Gulf Recruitment",
    title: "Built for Gulf placements.",
    body:  "Track passport status, ECNR, visa type, Gulf experience, and return history. First CRM in Kerala designed specifically for Gulf-focused agencies.",
    span:  "col-span-1",
  },
];

export function FeaturesGrid() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" ref={ref} className="bg-[#F9F9F8] py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold text-amber-500 uppercase tracking-widest mb-3">Product</p>
          <h2 className="text-[38px] sm:text-[48px] font-extrabold text-gray-950 tracking-tight leading-[1.08] max-w-lg">
            Everything your agency actually needs.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
              className={`bg-white border border-gray-100 rounded-2xl p-7 flex flex-col gap-3 hover:border-gray-200 hover:shadow-sm transition-all ${
                f.span === "col-span-2" ? "sm:col-span-2" : ""
              }`}
            >
              <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest">{f.tag}</span>
              <h3 className="text-[18px] font-bold text-gray-950 leading-snug tracking-tight">{f.title}</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
