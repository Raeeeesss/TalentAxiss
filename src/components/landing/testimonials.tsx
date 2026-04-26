"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Arun Menon",
    role: "Owner, AM Consultants",
    location: "Ernakulam",
    avatar: "AM",
    color: "from-indigo-500 to-purple-600",
    rating: 5,
    quote: "Before TalentAxiss, I had CVs in 5 different WhatsApp groups and 3 folders. Now I find any candidate in 10 seconds. My placement rate went up 40% in the first month alone.",
  },
  {
    name: "Priya Nair",
    role: "Senior Recruiter, Kerala Staffing",
    location: "Thrissur",
    avatar: "PN",
    color: "from-pink-500 to-rose-600",
    rating: 5,
    quote: "The AI matching is mind-blowing. I posted a Gulf driving job and within 30 seconds it pulled out 8 candidates with exact license details. What used to take me 2 hours now takes 2 minutes.",
  },
  {
    name: "Suresh Kumar",
    role: "MD, Cochin Job Services",
    location: "Kochi",
    avatar: "SK",
    color: "from-emerald-500 to-teal-600",
    rating: 5,
    quote: "The backout risk feature saved us from a major embarrassment. It flagged a candidate who had 3 other offers — we found out before presenting them to the client. Never had that capability before.",
  },
  {
    name: "Fathima Rashid",
    role: "Owner, Gulf Connect",
    location: "Malappuram",
    avatar: "FR",
    color: "from-amber-500 to-orange-600",
    rating: 5,
    quote: "Running a Gulf-focused agency, the passport and visa tracking module is exactly what I needed. Plus the Kerala district filters help me find candidates for specific locations instantly.",
  },
  {
    name: "Biju Thomas",
    role: "Director, Thomas Placements",
    location: "Kozhikode",
    avatar: "BT",
    color: "from-cyan-500 to-blue-600",
    rating: 5,
    quote: "I was using a competitor's product for 2 years. TalentAxiss is 10x better. The UI is beautiful, the AI is actually useful, and their support team is incredible. Worth every rupee.",
  },
  {
    name: "Anjali Dev",
    role: "Recruiter, Kochi Careers",
    location: "Kochi",
    avatar: "AD",
    color: "from-violet-500 to-purple-600",
    rating: 5,
    quote: "We imported our entire 800-candidate Excel database in 20 minutes using the CSV import. Duplicate detection merged 120 duplicate profiles automatically. Absolutely brilliant.",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#050508] via-[#06060e] to-[#050508]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
            <span className="text-xs text-amber-400 font-medium">Loved by Kerala Recruiters</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Real Results from
            <br />
            <span className="gradient-text">Real Agencies</span>
          </h2>
          <p className="text-white/50 text-lg">
            Join 156+ Kerala consultancies already using TalentAxiss.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/8 bg-white/2 p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-linear-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                    <div className="text-xs text-white/30">{t.location}</div>
                  </div>
                </div>
                <Quote className="h-6 w-6 text-white/10" />
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{t.quote}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 border border-white/6 bg-white/2 rounded-2xl p-6"
        >
          {[
            { value: "156+", label: "Active agencies" },
            { value: "4.9/5", label: "Average rating" },
            { value: "2,847", label: "Candidates placed" },
            { value: "94%", label: "Placement success" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
