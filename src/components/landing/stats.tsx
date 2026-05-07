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
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return val;
}

const stats = [
  { value: 12000, suffix: "+", label: "Candidates managed",   sub: "across all agencies"    },
  { value: 156,   suffix: "+", label: "Active agencies",      sub: "in Kerala"              },
  { value: 94,    suffix: "%", label: "Placement success",    sub: "industry avg is 67%"    },
  { value: 2400,  suffix: "₹Cr+", label: "Revenue tracked",  sub: "by our agencies"        },
];

function GlassStatCard({ value, suffix, label, sub, index, inView }: {
  value: number; suffix: string; label: string; sub: string; index: number; inView: boolean;
}) {
  const count = useCount(value, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group cursor-default"
    >
      {/* Gradient border glow on hover */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.5),rgba(139,92,246,0.3),rgba(245,158,11,0.4))" }}
      />

      {/* Glass card */}
      <div className="relative rounded-2xl border border-white/[0.09] p-7 flex flex-col gap-1 overflow-hidden"
        style={{
          background: "linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Corner shine */}
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{ background: "radial-gradient(circle at top right,rgba(255,255,255,0.06),transparent 70%)" }}
        />

        {/* Value */}
        <div className="text-[44px] font-black text-white leading-none tracking-tight tabular-nums">
          {suffix.startsWith("₹") ? suffix : ""}
          {count.toLocaleString("en-IN")}
          {!suffix.startsWith("₹") ? suffix : ""}
        </div>

        {/* Label */}
        <div className="text-[14px] font-semibold text-white/70">{label}</div>
        <div className="text-[12px] text-white/30">{sub}</div>

        {/* Bottom bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6,#f59e0b)" }}
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
    <section ref={ref} className="bg-[#050507] py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold text-white/20 uppercase tracking-[0.2em] mb-10"
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
