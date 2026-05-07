"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { n: 1, label: "Add Candidates",  desc: "Upload CVs — AI fills the profile",           angle: -90  },
  { n: 2, label: "AI Matching",     desc: "Score every candidate against any job",         angle: 0    },
  { n: 3, label: "Pipeline",        desc: "Move candidates from applied to joined",         angle: 90   },
  { n: 4, label: "Placement",       desc: "Log the fee, update analytics automatically",   angle: 180  },
];

const RADIUS = 160;

export function TimelineSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} className="bg-[#080809] py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">Workflow</p>
          <h2 className="text-[40px] sm:text-[54px] font-black text-white leading-[1.0] tracking-[-0.03em]">
            Four steps. One platform.
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Orbital diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative shrink-0"
            style={{ width: 380, height: 380 }}
          >
            {/* Outer decorative rings */}
            {[1, 0.75, 0.5].map((scale, i) => (
              <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="rounded-full border"
                  style={{
                    width:  380 * scale,
                    height: 380 * scale,
                    borderColor: `rgba(255,255,255,${0.04 - i * 0.01})`,
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ))}

            {/* Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-full border-2 border-amber-400/30 flex items-center justify-center"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                    <span className="text-[10px] font-black text-black">TA</span>
                  </div>
                </motion.div>
                {/* Pulse rings */}
                {[1, 2].map(i => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border border-amber-400/20"
                    animate={{ scale: [1, 1.8, 2.4], opacity: [0.4, 0.15, 0] }}
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
                <motion.button
                  key={step.n}
                  style={{ left: x, top: y, position: "absolute" }}
                  className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer z-10"
                  onClick={() => setActive(i)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: isActive ? 1.15 : 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "border-amber-400 bg-amber-400/10 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                      : "border-white/15 bg-white/5 hover:border-white/30"
                  }`}>
                    <span className={`text-[14px] font-black transition-colors ${isActive ? "text-amber-400" : "text-white/40"}`}>
                      {String(step.n).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Connector line to center */}
                  <svg
                    className="absolute pointer-events-none"
                    style={{
                      left:   28 - Math.cos(rad) * RADIUS + 28,
                      top:    28 - Math.sin(rad) * RADIUS + 28,
                      width:  Math.abs(Math.cos(rad) * RADIUS) + "px",
                      height: Math.abs(Math.sin(rad) * RADIUS) + "px",
                      transform: `translate(${Math.cos(rad) < 0 ? "100%" : "0"},${Math.sin(rad) < 0 ? "100%" : "0"})`,
                    }}
                  />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Step detail */}
          <div className="flex-1 min-w-0">
            {steps.map((step, i) => (
              <motion.button
                key={step.n}
                className="w-full text-left mb-3 rounded-2xl border px-6 py-5 transition-all duration-300"
                style={{
                  borderColor: active === i ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)",
                  background: active === i
                    ? "linear-gradient(135deg,rgba(245,158,11,0.06),rgba(245,158,11,0.02))"
                    : "rgba(255,255,255,0.02)",
                }}
                onClick={() => setActive(i)}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-[11px] font-black tabular-nums transition-colors ${active === i ? "text-amber-400" : "text-white/20"}`}>
                    {String(step.n).padStart(2, "0")}
                  </span>
                  <div>
                    <div className={`text-[16px] font-bold transition-colors ${active === i ? "text-white" : "text-white/40"}`}>
                      {step.label}
                    </div>
                    <div className={`text-[13px] mt-0.5 transition-colors ${active === i ? "text-white/50" : "text-white/20"}`}>
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
