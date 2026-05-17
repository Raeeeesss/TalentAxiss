"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Users, TrendingUp, Zap, Globe, BarChart3, Shield } from "lucide-react";

const JOBS = [
  {
    title: "Senior Electrician · Dubai",
    candidates: [
      { initials: "AM", name: "Arun Menon",    score: 96, tag: "Best Match",  color: "#10b981" },
      { initials: "SR", name: "Sajid Rahman",  score: 84, tag: "Good Fit",    color: "#2563eb" },
      { initials: "RK", name: "Rajan K.",       score: 71, tag: "Trainable",   color: "#f59e0b" },
      { initials: "MT", name: "Manoj Thomas",   score: 49, tag: "Weak Match",  color: "#94a3b8" },
    ],
  },
  {
    title: "Staff Nurse (ICU) · Riyadh",
    candidates: [
      { initials: "FN", name: "Fathima Nizar", score: 94, tag: "Best Match",  color: "#10b981" },
      { initials: "BK", name: "Bindu K.",       score: 87, tag: "Good Fit",    color: "#2563eb" },
      { initials: "PS", name: "Priya Suresh",   score: 68, tag: "Trainable",   color: "#f59e0b" },
      { initials: "MR", name: "Meera Raj",       score: 42, tag: "Weak Match",  color: "#94a3b8" },
    ],
  },
  {
    title: "Civil Engineer · Abu Dhabi",
    candidates: [
      { initials: "RP", name: "Rajan Pillai",   score: 91, tag: "Best Match",  color: "#10b981" },
      { initials: "SK", name: "Suresh K.",       score: 78, tag: "Good Fit",    color: "#2563eb" },
      { initials: "AJ", name: "Anil Jose",       score: 63, tag: "Trainable",   color: "#f59e0b" },
      { initials: "VR", name: "Vijay R.",         score: 38, tag: "Weak Match",  color: "#94a3b8" },
    ],
  },
];

const FEATURES = [
  { icon: Zap,      label: "AI CV Parser",      sub: "20+ fields auto-filled"     },
  { icon: Globe,    label: "Gulf Mode",          sub: "Passport & visa tracking"   },
  { icon: BarChart3,label: "Live Analytics",     sub: "Revenue & placements"       },
  { icon: Shield,   label: "Backout Risk AI",    sub: "Predict candidate ghosts"   },
];

/* ─── Matching demo panel ────────────────────────────────────── */
function MatchingDemo() {
  const [jobIdx,     setJobIdx]     = useState(0);
  const [animating,  setAnimating]  = useState(true);
  const [scanning,   setScanning]   = useState(true);

  useEffect(() => {
    setScanning(true);
    setAnimating(false);
    const t1 = setTimeout(() => { setScanning(false); setAnimating(true); }, 600);
    return () => clearTimeout(t1);
  }, [jobIdx]);

  useEffect(() => {
    if (!animating) return;
    const t = setTimeout(() => setJobIdx(j => (j + 1) % JOBS.length), 4200);
    return () => clearTimeout(t);
  }, [animating]);

  const job = JOBS[jobIdx];

  return (
    <div className="bg-white/[0.06] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div className="w-2 h-2 rounded-full bg-blue-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">AI Matching Engine</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.span key={jobIdx}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="text-[10px] text-white/30 font-mono">
            {job.title}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Candidates */}
      <div className="p-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div key={jobIdx} className="space-y-3">
            {job.candidates.map((c, i) => (
              <motion.div key={c.initials}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0"
                  style={{ background: `${c.color}40`, border: `1px solid ${c.color}60` }}>
                  {c.initials}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-white/80 truncate">{c.name}</span>
                    <span className="text-[11px] font-black ml-2 shrink-0" style={{ color: c.color }}>{c.score}</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg,${c.color},${c.color}80)` }}
                      initial={{ width: 0 }}
                      animate={animating ? { width: `${c.score}%` } : { width: 0 }}
                      transition={{ delay: i * 0.12 + 0.2, duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Tag */}
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: `${c.color}18`, color: c.color }}>
                  {c.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="pt-2 border-t border-white/8 flex items-center justify-between">
          <span className="text-[10px] text-white/25 font-mono">
            {scanning ? "Scanning 1,247 candidates…" : `Completed in 0.${3 + jobIdx}s`}
          </span>
          <div className="flex items-center gap-1.5">
            {JOBS.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-500"
                style={{ width: i === jobIdx ? 16 : 4, background: i === jobIdx ? "#3b82f6" : "rgba(255,255,255,0.15)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Side panel (shared by login + register) ────────────────── */
export function AuthSidePanel({ step }: { step?: number }) {
  return (
    <div className="hidden lg:flex lg:w-[52%] h-full flex-col justify-center relative overflow-hidden shrink-0"
      style={{ background: "linear-gradient(145deg,#04070e 0%,#07112a 55%,#060a1d 100%)" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient blobs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-600/15 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/5 w-56 h-56 bg-indigo-600/12 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-7 px-10 xl:px-14">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="text-[11px] font-black text-white">TA</span>
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">TalentAxiss</span>
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-[26px] xl:text-[30px] font-black text-white leading-[1.15] mb-2">
            Kerala&apos;s #1<br />
            <span className="text-blue-400">AI Recruitment CRM</span>
          </h2>
          <p className="text-white/40 text-[13px] leading-relaxed max-w-xs">
            Stop losing placements to WhatsApp and Excel. AI matching, pipeline, and analytics — one platform.
          </p>
        </motion.div>

        {/* Live AI matching demo */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <MatchingDemo />
        </motion.div>

        {/* Feature grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-2 gap-2">
          {FEATURES.map((f, i) => (
            <motion.div key={f.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="bg-white/[0.05] border border-white/8 rounded-xl px-3 py-2.5"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <f.icon className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span className="text-[12px] font-semibold text-white/80">{f.label}</span>
              </div>
              <div className="text-[10px] text-white/30 pl-5.5">{f.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center gap-8 pt-2 border-t border-white/8">
          {[
            { value: "156+", label: "Active Agencies" },
            { value: "12K+", label: "CVs Managed"     },
            { value: "94%",  label: "Success Rate"    },
          ].map(s => (
            <div key={s.label}>
              <div className="text-[20px] font-black text-white leading-none">{s.value}</div>
              <div className="text-[10px] text-white/35 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Step tracker for register */}
        {step !== undefined && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="bg-white/[0.05] border border-white/8 rounded-xl p-3.5">
            <div className="text-[10px] text-white/35 font-semibold uppercase tracking-widest mb-2.5">Your progress</div>
            <div className="flex items-center gap-0">
              {["Your Info", "Verify OTPs", "Agency Info"].map((label, i) => {
                const s = i + 1;
                const done = s < step;
                const cur  = s === step;
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                        done ? "bg-emerald-500 text-white" : cur ? "bg-blue-600 text-white ring-3 ring-blue-500/25" : "bg-white/10 text-white/30"
                      }`}>
                        {done ? <CheckCircle2 className="h-3 w-3" /> : s}
                      </div>
                      <span className={`text-[11px] font-medium hidden xl:block ${
                        cur ? "text-white" : done ? "text-emerald-400" : "text-white/25"
                      }`}>{label}</span>
                    </div>
                    {s < 3 && (
                      <div className="flex-1 h-px mx-2 rounded-full overflow-hidden bg-white/10">
                        <motion.div className="h-full bg-emerald-400"
                          initial={{ width: "0%" }} animate={{ width: done ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
