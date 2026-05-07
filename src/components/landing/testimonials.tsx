"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const quotes = [
  { text: "Placed 40% more candidates in month one. The AI matching alone saves 3 hours a day.", name: "Arun Menon",     title: "MD, AM Consultants",       loc: "Ernakulam", init: "AM", color: "#6366f1" },
  { text: "Finally a CRM that understands Gulf recruitment. Passport tracking is a game-changer.", name: "Suresh Kumar",   title: "Owner, Cochin Job Services", loc: "Kochi",      init: "SK", color: "#f59e0b" },
  { text: "My whole team is on one platform now. Nothing falls through the cracks any more.",      name: "Anitha Vijayan", title: "Director, Kerala Manpower",  loc: "Thrissur",   init: "AV", color: "#10b981" },
  { text: "Every morning I know exactly who to call. Response time went from days to hours.",      name: "Shafeeq M.",     title: "Partner, Gulf Careers",      loc: "Kozhikode",  init: "MS", color: "#8b5cf6" },
  { text: "Analytics showed 60% of revenue came from two categories. Changed everything.",        name: "Reena George",   title: "CEO, Milestone Placements",  loc: "Trivandrum", init: "RG", color: "#ec4899" },
  { text: "Backout risk AI is real — stopped making expensive offers to candidates who ghost.",    name: "Rajan Pillai",   title: "Owner, Nambiar HR Services", loc: "Kannur",     init: "RP", color: "#14b8a6" },
];

const ORBIT_RADIUS = 200;

export function TestimonialsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [angle,  setAngle]  = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setAngle(a => a + 0.3);
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const handleClick = (i: number) => {
    setActive(i);
  };

  return (
    <section id="testimonials" ref={ref} className="bg-[#050507] py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">Customers</p>
          <h2 className="text-[40px] sm:text-[54px] font-black text-white leading-[1.0] tracking-[-0.03em]">
            156 agencies can&apos;t be wrong.
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Orbital ring */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative shrink-0"
            style={{ width: 480, height: 480 }}
          >
            {/* Ring */}
            <svg className="absolute inset-0" width="480" height="480">
              <circle cx="240" cy="240" r={ORBIT_RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <circle cx="240" cy="240" r={ORBIT_RADIUS - 40} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />
            </svg>

            {/* Avatars on orbit */}
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
                  onClick={() => handleClick(i)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center z-10 transition-shadow duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[12px]"
                    style={{
                      background: isActive ? q.color : "rgba(255,255,255,0.08)",
                      color:      isActive ? "#fff"   : "rgba(255,255,255,0.4)",
                      boxShadow:  isActive ? `0 0 24px ${q.color}66` : "none",
                      border:     `2px solid ${isActive ? q.color : "rgba(255,255,255,0.1)"}`,
                      transition: "all 0.3s",
                    }}
                  >
                    {q.init}
                  </div>
                  {isActive && (
                    <motion.div className="absolute -inset-2 rounded-full"
                      style={{ border: `1px solid ${q.color}40` }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Center display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-center border border-white/[0.08]"
                  style={{
                    background: `radial-gradient(circle,${quotes[active].color}18 0%,transparent 70%)`,
                  }}
                >
                  <div className="text-[28px] font-black mb-1"
                    style={{ color: quotes[active].color }}>
                    {quotes[active].init}
                  </div>
                  <div className="text-[9px] text-white/40 font-medium leading-tight px-3">
                    {quotes[active].loc}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quote */}
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
                <div className="text-[80px] leading-none font-serif mb-2" style={{ color: quotes[active].color + "40" }}>
                  &ldquo;
                </div>

                <blockquote className="text-[22px] sm:text-[26px] font-bold text-white leading-[1.3] tracking-[-0.01em] mb-8">
                  {quotes[active].text}
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[13px]"
                    style={{ background: quotes[active].color, color: "#fff" }}>
                    {quotes[active].init}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-white">{quotes[active].name}</div>
                    <div className="text-[13px] text-white/35">{quotes[active].title} · {quotes[active].loc}</div>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex items-center gap-2 mt-8">
                  {quotes.map((q, i) => (
                    <button key={i} onClick={() => setActive(i)}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width:      active === i ? 24 : 6,
                        background: active === i ? q.color : "rgba(255,255,255,0.15)",
                      }}
                    />
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
