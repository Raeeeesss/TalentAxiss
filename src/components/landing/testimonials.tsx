"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Arun Menon",
    role: "Owner, AM Consultants",
    location: "Ernakulam",
    avatar: "AM",
    color: "from-indigo-500 to-purple-600",
    rating: 5,
    quote: "Before TalentAxiss, I had CVs in 5 different WhatsApp groups and 3 folders. Now I find any candidate in 10 seconds. My placement rate went up 40% in the first month alone.",
    metric: { value: "+40%", label: "Placement rate" },
  },
  {
    name: "Priya Nair",
    role: "Senior Recruiter, Kerala Staffing",
    location: "Thrissur",
    avatar: "PN",
    color: "from-pink-500 to-rose-600",
    rating: 5,
    quote: "The AI matching is mind-blowing. I posted a Gulf driving job and within 30 seconds it pulled out 8 candidates with exact license details. What used to take 2 hours now takes 2 minutes.",
    metric: { value: "2 min", label: "vs 2 hours before" },
  },
  {
    name: "Suresh Kumar",
    role: "MD, Cochin Job Services",
    location: "Kochi",
    avatar: "SK",
    color: "from-emerald-500 to-teal-600",
    rating: 5,
    quote: "The backout risk feature saved us from a major embarrassment. It flagged a candidate who had 3 other offers — we found out before presenting them to the client. Absolutely invaluable.",
    metric: { value: "0", label: "Surprise backouts" },
  },
  {
    name: "Fathima Rashid",
    role: "Owner, Gulf Connect",
    location: "Malappuram",
    avatar: "FR",
    color: "from-amber-500 to-orange-600",
    rating: 5,
    quote: "Running a Gulf-focused agency, the passport and visa tracking module is exactly what I needed. The Kerala district filters help me find candidates for specific locations instantly.",
    metric: { value: "3×", label: "Gulf placements" },
  },
  {
    name: "Biju Thomas",
    role: "Director, Thomas Placements",
    location: "Kozhikode",
    avatar: "BT",
    color: "from-cyan-500 to-blue-600",
    rating: 5,
    quote: "I was using a competitor's product for 2 years. TalentAxiss is 10x better. The UI is beautiful, the AI is actually useful, and their support team is incredible. Worth every rupee.",
    metric: { value: "10×", label: "Better than old CRM" },
  },
  {
    name: "Anjali Dev",
    role: "Recruiter, Kochi Careers",
    location: "Kochi",
    avatar: "AD",
    color: "from-violet-500 to-purple-600",
    rating: 5,
    quote: "We imported our entire 800-candidate Excel database in 20 minutes. Duplicate detection merged 120 duplicate profiles automatically. The time saved is incredible.",
    metric: { value: "20 min", label: "Full DB migrated" },
  },
];

export function TestimonialsSection() {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length), []);
  const next = useCallback(() => setIdx((i) => (i + 1) % testimonials.length), []);

  /* Auto-advance every 5 s */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const t = testimonials[idx];

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-28 px-4 relative bg-gray-50/70 overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px mesh-divider" />

      {/* Ambient blobs */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .6 }}
          className="text-center mb-14"
        >
          <div className="section-label bg-amber-50 border border-amber-100 text-amber-700 mb-6">
            <Star className="h-3 w-3 fill-current" />
            Loved by Kerala Recruiters
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-950 mb-3 leading-tight">
            Real Results from
            <br />
            <span className="gradient-text">Real Agencies</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Join 156+ Kerala consultancies already transforming their business.
          </p>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: .15, duration: .7 }}
          className="glass-card p-8 sm:p-10 mb-8 relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Quote className="absolute top-6 right-8 h-10 w-10 text-gray-100" />

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: .35, ease: [.22, 1, .36, 1] }}
              className="grid md:grid-cols-[1fr_auto] gap-8 items-start"
            >
              {/* Quote */}
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>

                <p className="text-xl sm:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-linear-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>

              {/* Metric highlight */}
              <div className="shrink-0 text-center bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6 md:self-center">
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">
                  {t.metric.value}
                </div>
                <div className="text-xs text-gray-400 font-medium leading-tight max-w-20 mx-auto">
                  {t.metric.label}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setIdx(i); setPaused(true); }}
                  className={`testimonial-dot transition-all ${i === idx ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: .92 }}
                onClick={() => { prev(); setPaused(true); }}
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: .92 }}
                onClick={() => { next(); setPaused(true); }}
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Small grid of other testimonials */}
        <div className="grid sm:grid-cols-3 gap-4">
          {testimonials
            .filter((_, i) => i !== idx)
            .slice(0, 3)
            .map((t2, i) => (
              <motion.button
                key={t2.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: .3 + i * .08 }}
                whileHover={{ y: -3 }}
                onClick={() => { setIdx(testimonials.indexOf(t2)); setPaused(true); }}
                className="glass-card p-4 text-left cursor-pointer group"
              >
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3 group-hover:text-gray-900 transition-colors">
                  &ldquo;{t2.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-linear-to-br ${t2.color} flex items-center justify-center text-white text-[9px] font-bold`}>
                    {t2.avatar}
                  </div>
                  <div className="text-[10px] font-semibold text-gray-700">{t2.name}</div>
                </div>
              </motion.button>
            ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: .55 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          {[
            { value: "156+",  label: "Active agencies"   },
            { value: "4.9/5", label: "Average rating"    },
            { value: "2,847", label: "Candidates placed" },
            { value: "94%",   label: "Placement success" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
