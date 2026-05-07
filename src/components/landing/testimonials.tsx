"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "We placed 40% more candidates in our first month with TalentAxiss. The AI matching alone saves us 3 hours every day.",
    name:  "Arun Menon",
    title: "MD, AM Consultants",
    loc:   "Ernakulam",
    init:  "AM",
  },
  {
    quote: "Finally a CRM that understands Gulf recruitment. The passport tracking and ECNR fields alone make it worth it.",
    name:  "Suresh Kumar",
    title: "Owner, Cochin Job Services",
    loc:   "Kochi",
    init:  "SK",
  },
  {
    quote: "I used to manage everything in WhatsApp and a notebook. Now my whole team is on one platform and nothing falls through.",
    name:  "Anitha Vijayan",
    title: "Director, Kerala Manpower",
    loc:   "Thrissur",
    init:  "AV",
  },
  {
    quote: "The follow-up system is incredible. Every morning I know exactly who to call. Our response time went from days to hours.",
    name:  "Mohammed Shafeeq",
    title: "Partner, Gulf Careers",
    loc:   "Kozhikode",
    init:  "MS",
  },
  {
    quote: "The analytics helped me realise 60% of my revenue was coming from just two job categories. Changed how I run the whole agency.",
    name:  "Reena George",
    title: "CEO, Milestone Placements",
    loc:   "Trivandrum",
    init:  "RG",
  },
  {
    quote: "The AI backout risk score is genuinely useful. We stopped making expensive offers to candidates who were going to ghost us.",
    name:  "Rajan Pillai",
    title: "Owner, Nambiar HR Services",
    loc:   "Kannur",
    init:  "RP",
  },
];

export function TestimonialsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="testimonials" ref={ref} className="bg-[#F9F9F8] py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold text-amber-500 uppercase tracking-widest mb-3">Customers</p>
          <h2 className="text-[38px] sm:text-[48px] font-extrabold text-gray-950 tracking-tight leading-[1.08]">
            What agencies say.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <p className="text-[14px] text-gray-700 leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-gray-500">{t.init}</span>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">{t.name}</div>
                  <div className="text-[11px] text-gray-400">{t.title} · {t.loc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
