"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { n:1, label:"Add Candidates", desc:"Upload CVs — AI fills the profile automatically",      angle:-90 },
  { n:2, label:"AI Matching",    desc:"Score every candidate against any job requirement",    angle:0   },
  { n:3, label:"Pipeline",       desc:"Move candidates from Applied to Joined visually",      angle:90  },
  { n:4, label:"Placement",      desc:"Log the fee, analytics update automatically",          angle:180 },
];
const RADIUS = 160;

export function TimelineSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  // Auto-advance steps every 3 seconds once in view
  useEffect(() => {
    if (!inView) return;
    const iv = setInterval(() => setActive(a => (a + 1) % steps.length), 3000);
    return () => clearInterval(iv);
  }, [inView]);

  return (
    <section ref={ref} className="bg-white py-24 overflow-hidden border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20">
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-4">Workflow</p>
          <h2 className="text-[38px] sm:text-[52px] font-black text-slate-900 leading-none tracking-tight">
            Four steps. One platform.
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Orbital diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative shrink-0" style={{ width: 380, height: 380 }}>

            {/* Rings */}
            {[1, 0.75, 0.5].map((scale, i) => (
              <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div className="rounded-full border border-slate-200"
                  style={{ width: 380 * scale, height: 380 * scale }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ))}

            {/* Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-full border-2 border-blue-200 flex items-center justify-center bg-white shadow-xl shadow-blue-100/50"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <span className="text-[10px] font-black text-white">TA</span>
                  </div>
                </motion.div>
                {[1, 2].map(i => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border border-blue-300"
                    animate={{ scale: [1, 1.8, 2.4], opacity: [0.3, 0.1, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.9 }}
                  />
                ))}
              </div>
            </div>

            {/* Step nodes */}
            {steps.map((step, i) => {
              const rad = (step.angle * Math.PI) / 180;
              const x   = Math.round(190 + Math.cos(rad) * RADIUS - 28);
              const y   = Math.round(190 + Math.sin(rad) * RADIUS - 28);
              const isActive = active === i;
              return (
                <motion.button key={step.n}
                  style={{ left: x, top: y, position: "absolute" }}
                  onClick={() => setActive(i)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}>
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isActive
                      ? "border-blue-600 bg-blue-600 shadow-lg shadow-blue-600/30"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}>
                    <span className={`text-[14px] font-black transition-colors ${isActive ? "text-white" : "text-slate-400"}`}>
                      {String(step.n).padStart(2, "0")}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Steps list */}
          <div className="flex-1 min-w-0">
            {steps.map((step, i) => (
              <motion.button key={step.n}
                className={`relative w-full text-left mb-3 rounded-2xl border px-6 py-5 overflow-hidden transition-all duration-300 ${
                  active === i
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-slate-100 bg-white hover:border-blue-100"
                }`}
                onClick={() => setActive(i)}
                whileHover={{ x: 3 }}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}>
                {/* Progress fill bar */}
                {active === i && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-blue-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    key={active}
                  />
                )}
                <div className="flex items-center gap-4">
                  <span className={`text-[11px] font-black tabular-nums transition-colors ${active === i ? "text-blue-600" : "text-slate-300"}`}>
                    {String(step.n).padStart(2, "0")}
                  </span>
                  <div>
                    <div className={`text-[16px] font-bold transition-colors ${active === i ? "text-slate-900" : "text-slate-400"}`}>
                      {step.label}
                    </div>
                    <div className={`text-[13px] mt-0.5 transition-colors ${active === i ? "text-slate-500" : "text-slate-300"}`}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
