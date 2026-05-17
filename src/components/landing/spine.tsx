"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─── Data ───────────────────────────────────────────────────── */
const JOBS = [
  {
    title: "Senior Electrician", location: "Dubai, UAE",
    candidates: [
      { initials: "AM", name: "Arun Menon",    role: "Electrician · 4 yrs",      score: 96, tag: "Best Match",  color: "#10b981" },
      { initials: "SR", name: "Sajid Rahman",  role: "Electrician · 3 yrs",      score: 84, tag: "Good Fit",    color: "#2563eb" },
      { initials: "RK", name: "Rajan K.",       role: "Electrician · 2 yrs",      score: 71, tag: "Trainable",   color: "#f59e0b" },
      { initials: "MT", name: "Manoj Thomas",   role: "Cable Tech · 5 yrs",       score: 52, tag: "Weak Match",  color: "#94a3b8" },
    ],
  },
  {
    title: "Staff Nurse (ICU)", location: "Riyadh, KSA",
    candidates: [
      { initials: "FN", name: "Fathima Nizar", role: "Staff Nurse · 5 yrs",      score: 94, tag: "Best Match",  color: "#10b981" },
      { initials: "BK", name: "Bindu K.",       role: "Staff Nurse · 4 yrs",      score: 88, tag: "Good Fit",    color: "#2563eb" },
      { initials: "PS", name: "Priya Suresh",   role: "ANM Nurse · 3 yrs",        score: 65, tag: "Trainable",   color: "#f59e0b" },
      { initials: "MR", name: "Meera Raj",       role: "Lab Technician · 2 yrs",  score: 38, tag: "Weak Match",  color: "#94a3b8" },
    ],
  },
  {
    title: "Civil Engineer", location: "Abu Dhabi, UAE",
    candidates: [
      { initials: "RP", name: "Rajan Pillai",   role: "Civil Engr · 6 yrs",      score: 91, tag: "Best Match",  color: "#10b981" },
      { initials: "SK", name: "Suresh Kumar",   role: "Civil Engr · 4 yrs",       score: 79, tag: "Good Fit",    color: "#2563eb" },
      { initials: "AJ", name: "Anil Jose",       role: "Site Supervisor · 5 yrs", score: 66, tag: "Trainable",   color: "#f59e0b" },
      { initials: "VR", name: "Vijay Raj",        role: "Draftsman · 3 yrs",       score: 43, tag: "Weak Match",  color: "#94a3b8" },
    ],
  },
];

const GRAD = [
  "from-blue-500 to-indigo-500",
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-blue-500",
  "from-slate-400 to-slate-500",
];

/* ─── Score bar row ──────────────────────────────────────────── */
function CandidateRow({
  candidate, rank, animate: doAnimate, delay,
}: {
  candidate: typeof JOBS[0]["candidates"][0];
  rank: number;
  animate: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        rank === 1 ? "bg-white/[0.07] border border-white/10" : ""
      }`}
    >
      {/* Rank */}
      <span className={`text-[11px] font-black w-5 text-center shrink-0 ${
        rank === 1 ? "text-emerald-400" : "text-white/25"
      }`}>
        #{rank}
      </span>

      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black bg-linear-to-br ${GRAD[rank - 1]}`}>
        {candidate.initials}
      </div>

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-white leading-tight truncate">{candidate.name}</div>
        <div className="text-[10px] text-white/35 truncate">{candidate.role}</div>
      </div>

      {/* Score bar + number */}
      <div className="w-24 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black text-white">{candidate.score}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: `${candidate.color}22`, color: candidate.color }}>
            {candidate.tag}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg,${candidate.color},${candidate.color}90)` }}
            initial={{ width: 0 }}
            animate={doAnimate ? { width: `${candidate.score}%` } : { width: 0 }}
            transition={{ duration: 0.9, delay: delay + 0.2, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Full matching panel ────────────────────────────────────── */
function MatchingPanel() {
  const [jobIndex, setJobIndex]   = useState(0);
  const [phase, setPhase]         = useState<"idle" | "scanning" | "done">("idle");
  const [scanCount, setScanCount] = useState(0);
  const [doAnimate, setDoAnimate] = useState(true);

  const job = JOBS[jobIndex];

  /* cycle: scan → done → next job → scan … */
  useEffect(() => {
    setPhase("scanning");
    setDoAnimate(false);
    const t1 = setTimeout(() => { setDoAnimate(true); setPhase("done"); }, 600);
    return () => clearTimeout(t1);
  }, [jobIndex]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      setJobIndex(j => (j + 1) % JOBS.length);
      setScanCount(c => c + 1);
    }, 4200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="absolute inset-0 flex flex-col p-5 overflow-hidden">

      {/* Header */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-blue-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
            AI Matching Engine
          </span>
          <span className="ml-auto text-[10px] text-white/25 font-mono">
            {(1247 + scanCount * 3).toLocaleString()} candidates
          </span>
        </div>

        {/* Job card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={jobIndex}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="bg-white/[0.07] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-white leading-tight">{job.title}</div>
              <div className="text-[11px] text-white/40">{job.location}</div>
            </div>
            <div className="ml-auto">
              <AnimatePresence mode="wait">
                {phase === "scanning" ? (
                  <motion.span key="scanning"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] text-amber-400 font-semibold flex items-center gap-1.5">
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
                      animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
                    Scanning…
                  </motion.span>
                ) : (
                  <motion.span key="done"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Ranked
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-[9px] text-white/25 font-semibold uppercase tracking-widest">
          Top Matches
        </span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Candidate rows */}
      <div className="flex-1 space-y-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={jobIndex} className="space-y-1">
            {job.candidates.map((c, i) => (
              <CandidateRow
                key={c.initials}
                candidate={c}
                rank={i + 1}
                animate={doAnimate}
                delay={i * 0.1}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`footer-${jobIndex}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-3 pt-3 border-t border-white/[0.07] flex items-center justify-between shrink-0"
        >
          <span className="text-[10px] text-white/25 font-mono">
            {phase === "scanning" ? "Analyzing…" : `Completed in 0.${2 + jobIndex}s`}
          </span>
          <div className="flex items-center gap-1.5">
            {JOBS.map((_, i) => (
              <div key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{ width: i === jobIndex ? 20 : 6, background: i === jobIndex ? "#3b82f6" : "rgba(255,255,255,0.15)" }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────── */
export function SpineSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-slate-50 py-14 md:py-20 overflow-hidden border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — text */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-5"
            >
              AI Intelligence Core
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[36px] sm:text-[48px] font-black text-slate-900 leading-[1.05] tracking-tight mb-6"
            >
              Matching built<br />
              into <span className="text-blue-600">the DNA.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              className="text-[15px] text-slate-500 leading-relaxed mb-8"
            >
              Every candidate profile, CV, and job requirement feeds a matching engine
              that ranks your pool and surfaces the right fit in seconds.
            </motion.p>

            <div className="space-y-4">
              {[
                { label: "AI CV Parser",       desc: "Extracts 20+ fields from any CV format"   },
                { label: "Match Scoring",       desc: "0–100 score for every candidate-job pair" },
                { label: "Backout Risk AI",     desc: "Predicts candidates likely to ghost"       },
                { label: "Fake Profile Detect", desc: "Flags inflated or inconsistent profiles"  },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800">{item.label}</div>
                    <div className="text-[12px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — live matching panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-slate-300/60 shadow-2xl shadow-blue-900/12"
            style={{ height: "440px" }}
          >
            {/* Dark background */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(145deg,#04070e 0%,#07112a 55%,#060a1d 100%)" }}
            />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

            {inView && <MatchingPanel />}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
