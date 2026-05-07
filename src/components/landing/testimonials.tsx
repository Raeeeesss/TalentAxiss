"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

const quotes = [
  {
    text:  "Placed 40% more candidates in month one. The AI matching alone saves 3 hours a day.",
    name:  "Arun Menon",
    title: "MD, AM Consultants",
    loc:   "Ernakulam",
    init:  "AM",
    color: "#2563eb",
    img:   "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text:  "Finally a CRM that understands Gulf recruitment. Passport tracking is a game-changer.",
    name:  "Suresh Kumar",
    title: "Owner, Cochin Job Services",
    loc:   "Kochi",
    init:  "SK",
    color: "#6366f1",
    img:   "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    text:  "My whole team is on one platform now. Nothing falls through the cracks any more.",
    name:  "Anitha Vijayan",
    title: "Director, Kerala Manpower",
    loc:   "Thrissur",
    init:  "AV",
    color: "#0ea5e9",
    img:   "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    text:  "Every morning I know exactly who to call. Response time went from days to hours.",
    name:  "Mohammed Shafeeq",
    title: "Partner, Gulf Careers",
    loc:   "Kozhikode",
    init:  "MS",
    color: "#7c3aed",
    img:   "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    text:  "Analytics showed 60% of revenue came from two categories. Changed everything.",
    name:  "Reena George",
    title: "CEO, Milestone Placements",
    loc:   "Trivandrum",
    init:  "RG",
    color: "#0284c7",
    img:   "https://randomuser.me/api/portraits/women/52.jpg",
  },
  {
    text:  "Backout risk AI is real — stopped making expensive offers to candidates who ghost.",
    name:  "Rajan Pillai",
    title: "Owner, Nambiar HR Services",
    loc:   "Kannur",
    init:  "RP",
    color: "#0891b2",
    img:   "https://randomuser.me/api/portraits/men/91.jpg",
  },
];

const ORBIT_RADIUS = 200;

export function TestimonialsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [angle,  setAngle]  = useState(0);

  // Rotate the ring
  useEffect(() => {
    const iv = setInterval(() => setAngle(a => a + 0.3), 30);
    return () => clearInterval(iv);
  }, []);

  // Auto-advance active quote every 4 seconds
  useEffect(() => {
    const iv = setInterval(() => setActive(a => (a + 1) % quotes.length), 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="testimonials" ref={ref} className="bg-slate-50 py-16 md:py-24 overflow-hidden border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-4">Customers</p>
          <h2 className="text-[38px] sm:text-[52px] font-black text-slate-900 leading-none tracking-tight">
            156 agencies can&apos;t be wrong.
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

          {/* Orbital ring — hidden on mobile (480px would overflow) */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative shrink-0 hidden md:block"
            style={{ width: 480, height: 480 }}
          >
            <svg className="absolute inset-0" width="480" height="480">
              <circle cx="240" cy="240" r={ORBIT_RADIUS} fill="none" stroke="rgba(37,99,235,0.1)" strokeWidth="1.5" />
              <circle cx="240" cy="240" r={ORBIT_RADIUS - 40} fill="none" stroke="rgba(37,99,235,0.06)" strokeWidth="1" strokeDasharray="4 8" />
            </svg>

            {/* Avatar nodes on orbit */}
            {quotes.map((q, i) => {
              const baseAngle = (i / quotes.length) * 360;
              const rad = ((baseAngle + angle) * Math.PI) / 180;
              const x   = Math.round(240 + Math.cos(rad) * ORBIT_RADIUS - 24);
              const y   = Math.round(240 + Math.sin(rad) * ORBIT_RADIUS - 24);
              const isActive = active === i;

              return (
                <motion.button
                  key={i}
                  style={{ position: "absolute", left: x, top: y }}
                  onClick={() => setActive(i)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      border:     `2.5px solid ${isActive ? q.color : "#e2e8f0"}`,
                      boxShadow:  isActive ? `0 4px 20px ${q.color}50` : "0 1px 4px rgba(0,0,0,0.08)",
                      transform:  isActive ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    <Image
                      src={q.img}
                      alt={q.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 rounded-full"
                      style={{ border: `1.5px solid ${q.color}40` }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Center — active avatar large */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35 }}
                  className="relative"
                >
                  <div
                    className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-2xl"
                    style={{
                      borderColor: quotes[active].color,
                      boxShadow:   `0 8px 40px ${quotes[active].color}35`,
                    }}
                  >
                    <Image
                      src={quotes[active].img}
                      alt={quotes[active].name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Name pill below */}
                  <div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-md"
                    style={{ background: quotes[active].color }}
                  >
                    {quotes[active].name.split(" ")[0]}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quote panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Large quote mark */}
                <div className="text-[72px] leading-none font-serif mb-2"
                  style={{ color: `${quotes[active].color}25` }}>
                  &ldquo;
                </div>

                <blockquote className="text-[22px] sm:text-[26px] font-bold text-slate-900 leading-[1.3] tracking-tight mb-8">
                  {quotes[active].text}
                </blockquote>

                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden border-2 shadow-md flex-shrink-0"
                    style={{ borderColor: `${quotes[active].color}50` }}
                  >
                    <Image
                      src={quotes[active].img}
                      alt={quotes[active].name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-slate-900">{quotes[active].name}</div>
                    <div className="text-[13px] text-slate-400">{quotes[active].title} · {quotes[active].loc}</div>
                  </div>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-2">
                  {quotes.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className="h-1.5 rounded-full transition-all duration-300 overflow-hidden relative"
                      style={{ width: active === i ? 64 : 6, background: active === i ? "#e2e8f0" : "#cbd5e1" }}
                    >
                      {active === i && (
                        <motion.span
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ background: q.color }}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 4, ease: "linear" }}
                          key={active}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
