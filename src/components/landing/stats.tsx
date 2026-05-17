"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCount(target: number, inView: boolean, duration = 2000) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return val;
}

const stats = [
  { value: 12000, suffix: "+",    label: "Candidates managed", sub: "across all agencies"   },
  { value: 156,   suffix: "+",    label: "Active agencies",    sub: "in Kerala"             },
  { value: 94,    suffix: "%",    label: "Placement success",  sub: "industry avg is 67%"   },
  { value: 2400,  suffix: "Cr+",  prefix: "₹", label: "Revenue tracked", sub: "by our agencies" },
];

function GlassStatCard({ value, suffix, prefix, label, sub, index, inView }: {
  value: number; suffix: string; prefix?: string; label: string; sub: string; index: number; inView: boolean;
}) {
  const count = useCount(value, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group cursor-default"
    >
      {/* Glow border on hover */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(135deg,rgba(37,99,235,0.4),rgba(99,102,241,0.3),rgba(14,165,233,0.4))" }}
      />

      {/* Glass card */}
      <div className="relative rounded-2xl border border-slate-200/80 p-7 flex flex-col gap-1 overflow-hidden bg-white/80"
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 20px 60px rgba(37,99,235,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Top-right shine */}
        <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
          style={{ background: "radial-gradient(circle at top right,rgba(37,99,235,0.05),transparent 70%)" }}
        />

        <div className="text-[42px] font-black text-slate-900 leading-none tracking-tight tabular-nums">
          {prefix}{count.toLocaleString("en-IN")}{suffix}
        </div>
        <div className="text-[14px] font-semibold text-slate-700">{label}</div>
        <div className="text-[12px] text-slate-400">{sub}</div>

        {/* Animated bottom bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg,#2563eb,#6366f1,#0ea5e9)" }}
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : {}}
          transition={{ duration: 1.5, delay: index * 0.1 + 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className="bg-slate-50 py-14 md:py-20 border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-10"
        >
          Numbers that matter
        </motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <GlassStatCard key={s.label} {...s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
