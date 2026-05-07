"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const steps = [
  { n: 1, label: "Add Candidates", desc: "Upload CVs — AI fills the profile automatically", angle: -90 },
  { n: 2, label: "AI Matching",    desc: "Score every candidate against any job requirement", angle: 0  },
  { n: 3, label: "Pipeline",       desc: "Move candidates from Applied to Joined visually", angle: 90  },
  { n: 4, label: "Placement",      desc: "Log the fee, analytics update automatically", angle: 180     },
];
const RADIUS = 160;

/* ─── Step preview mockups ───────────────────────────────────── */

function Step1Preview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-300" />
        <span className="text-[11px] font-medium text-slate-400">Add New Candidate</span>
      </div>
      <div className="p-5">
        {/* Upload zone */}
        <motion.div
          className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40 p-5 flex flex-col items-center mb-4"
          animate={{ borderColor: ["#bfdbfe", "#3b82f6", "#bfdbfe"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <span className="text-[12px] font-semibold text-blue-600">Drop CV here or click to upload</span>
          <span className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX supported</span>
        </motion.div>
        {/* Auto-filled fields */}
        <div className="space-y-2">
          {[
            { label: "Name",     value: "Arun Menon",       done: true  },
            { label: "Role",     value: "Electrician",      done: true  },
            { label: "Skills",   value: "Wiring, Panel...", done: true  },
            { label: "District", value: "Ernakulam",        done: false },
          ].map((f, i) => (
            <div key={f.label} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-14 shrink-0">{f.label}</span>
              <div className="flex-1 h-7 rounded-lg border border-slate-100 bg-slate-50 flex items-center px-3 overflow-hidden">
                {f.done ? (
                  <motion.span
                    className="text-[11px] font-medium text-slate-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.25 + 0.3 }}
                  >
                    {f.value}
                  </motion.span>
                ) : (
                  <motion.div className="h-2 rounded-full bg-blue-200"
                    animate={{ width: ["0%", "60%"] }}
                    transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                  />
                )}
              </div>
              {f.done && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.25 + 0.5 }}
                  className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"
                >
                  <span className="text-[8px] text-emerald-600 font-bold">✓</span>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2Preview() {
  const candidates = [
    { name: "Arun Menon",   role: "Electrician",  score: 96, tag: "Best Fit",  tc: "bg-emerald-100 text-emerald-700" },
    { name: "Rajan K.",     role: "Electrician",  score: 84, tag: "Good Fit",  tc: "bg-blue-100 text-blue-700"      },
    { name: "Sujith M.",    role: "Electrician",  score: 71, tag: "Trainable", tc: "bg-amber-100 text-amber-700"    },
    { name: "Vikram P.",    role: "Electrician",  score: 55, tag: "Weak",      tc: "bg-slate-100 text-slate-500"    },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">AI Match Results</span>
        <span className="text-[10px] bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full">Job: Electrician · Dubai</span>
      </div>
      <div className="p-4 space-y-2">
        {candidates.map((c, i) => (
          <motion.div key={c.name}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-slate-500">{c.name.split(" ").map(x => x[0]).join("")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-slate-700 truncate">{c.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${c.score}%` }}
                    transition={{ delay: i * 0.12 + 0.2, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[11px] font-black text-slate-700 w-6 text-right">{c.score}</span>
              </div>
            </div>
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${c.tc}`}>{c.tag}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Step3Preview() {
  const stages = [
    { label: "Applied",     color: "#94a3b8", cards: ["Arun M.", "Bindu K."] },
    { label: "Interview",   color: "#f59e0b", cards: ["Sajid R."]            },
    { label: "Offer",       color: "#6366f1", cards: ["Manoj T."]            },
    { label: "Joined",      color: "#10b981", cards: ["Fathima N."]          },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5">
        <span className="text-[11px] font-medium text-slate-400">Pipeline — October 2025</span>
      </div>
      <div className="p-4 grid grid-cols-4 gap-2">
        {stages.map((s, si) => (
          <div key={s.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide truncate">{s.label}</span>
            </div>
            {s.cards.map((name, ci) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.08 + ci * 0.06 }}
                className="rounded-lg p-2 border text-center"
                style={{ borderColor: `${s.color}30`, background: `${s.color}08` }}
              >
                <div className="w-6 h-6 rounded-full bg-white border mx-auto mb-1 flex items-center justify-center" style={{ borderColor: `${s.color}40` }}>
                  <span className="text-[7px] font-bold" style={{ color: s.color }}>{name.split(" ").map(x => x[0]).join("")}</span>
                </div>
                <div className="text-[9px] font-medium text-slate-600 truncate">{name}</div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4Preview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5">
        <span className="text-[11px] font-medium text-slate-400">Placement Confirmed</span>
      </div>
      <div className="p-5">
        {/* Placement card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-2"
          >
            <span className="text-white text-xl font-black">✓</span>
          </motion.div>
          <div className="text-[14px] font-black text-emerald-800">Fathima Nizar · Placed!</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Sales Executive · Dubai Retail Group</div>
        </motion.div>

        {/* Stats update */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Fee",         value: "₹18,500", color: "#2563eb" },
            { label: "Month total", value: "34 placed", color: "#6366f1" },
            { label: "Revenue",     value: "₹6.2L",   color: "#10b981" },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center"
            >
              <div className="text-[13px] font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = [Step1Preview, Step2Preview, Step3Preview, Step4Preview];

/* ─── Section ────────────────────────────────────────────────── */

export function TimelineSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const iv = setInterval(() => setActive(a => (a + 1) % steps.length), 3500);
    return () => clearInterval(iv);
  }, [inView]);

  const Preview = PREVIEWS[active];

  return (
    <section ref={ref} className="bg-white py-16 md:py-24 overflow-hidden border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-4">Workflow</p>
          <h2 className="text-[38px] sm:text-[52px] font-black text-slate-900 leading-none tracking-tight">
            Four steps. One platform.
          </h2>
        </motion.div>

        {/* ── Mobile layout (< lg) ─────────────────────────── */}
        <div className="lg:hidden space-y-5">

          {/* Step number tabs */}
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, i) => (
              <motion.button
                key={step.n}
                onClick={() => setActive(i)}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`relative flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  active === i
                    ? "border-blue-600 bg-blue-600 shadow-lg shadow-blue-600/25"
                    : "border-slate-200 bg-white"
                }`}
              >
                {active === i && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.75 bg-blue-400 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                    key={active}
                  />
                )}
                <span className={`text-xl font-black leading-none tabular-nums ${active === i ? "text-white" : "text-slate-800"}`}>
                  {String(step.n).padStart(2, "0")}
                </span>
                <span className={`text-[10px] font-semibold leading-tight text-center ${active === i ? "text-blue-100" : "text-slate-400"}`}>
                  {step.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Step description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-[14px] text-slate-500 text-center px-2 leading-relaxed"
            >
              {steps[active].desc}
            </motion.p>
          </AnimatePresence>

          {/* Step mockup preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Preview />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Desktop layout (lg+) ─────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-10 items-center">

          {/* Orbital diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative shrink-0 mx-auto" style={{ width: 320, height: 320 }}
          >
            {[1, 0.72, 0.44].map((scale, i) => (
              <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div className="rounded-full border border-slate-200"
                  style={{ width: 320 * scale, height: 320 * scale }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="w-16 h-16 rounded-full border-2 border-blue-200 flex items-center justify-center bg-white shadow-xl shadow-blue-100/50"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                    <span className="text-[9px] font-black text-white">TA</span>
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

            {steps.map((step, i) => {
              const rad      = (step.angle * Math.PI) / 180;
              const x        = Math.round(160 + Math.cos(rad) * 120 - 22);
              const y        = Math.round(160 + Math.sin(rad) * 120 - 22);
              const isActive = active === i;
              return (
                <motion.button key={step.n}
                  style={{ left: x, top: y, position: "absolute" }}
                  onClick={() => setActive(i)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isActive
                      ? "border-blue-600 bg-blue-600 shadow-lg shadow-blue-600/30"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}>
                    <span className={`text-[12px] font-black transition-colors ${isActive ? "text-white" : "text-slate-400"}`}>
                      {String(step.n).padStart(2, "0")}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Step image preview */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Preview />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Steps list */}
          <div className="flex-1 min-w-0">
            {steps.map((step, i) => (
              <motion.button key={step.n}
                className={`relative w-full text-left mb-3 rounded-2xl border px-5 py-4 overflow-hidden transition-all duration-300 ${
                  active === i
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-slate-100 bg-white hover:border-blue-100"
                }`}
                onClick={() => setActive(i)}
                whileHover={{ x: 3 }}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {active === i && (
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                    key={active}
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] font-black tabular-nums transition-colors ${active === i ? "text-blue-600" : "text-slate-300"}`}>
                    {String(step.n).padStart(2, "0")}
                  </span>
                  <div>
                    <div className={`text-[14px] font-bold transition-colors ${active === i ? "text-slate-900" : "text-slate-400"}`}>
                      {step.label}
                    </div>
                    <div className={`text-[12px] mt-0.5 transition-colors ${active === i ? "text-slate-500" : "text-slate-300"}`}>
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
