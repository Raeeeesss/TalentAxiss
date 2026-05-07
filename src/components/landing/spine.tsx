"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

function HelixCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0, raf: number;
    let targetSpeed = 0.012, speed = 0.012;
    const resize = () => {
      const dpr = window.devicePixelRatio;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetSpeed = 0.005 + ((e.clientY - rect.top) / rect.height) * 0.022;
    };
    canvas.addEventListener("mousemove", onMove);

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      speed += (targetSpeed - speed) * 0.05;
      const CX = W / 2, CY = H / 2;
      const radius = Math.min(W, H) * 0.22;
      const nPoints = 60, spread = H * 0.82;

      for (let strand = 0; strand < 2; strand++) {
        const phase = strand === 0 ? 0 : Math.PI;
        for (let i = 0; i < nPoints - 1; i++) {
          const p0 = i / (nPoints - 1), p1 = (i + 1) / (nPoints - 1);
          const a0 = t + p0 * Math.PI * 6 + phase;
          const a1 = t + p1 * Math.PI * 6 + phase;
          const x0 = CX + Math.cos(a0) * radius, y0 = CY - spread/2 + p0 * spread;
          const x1 = CX + Math.cos(a1) * radius, y1 = CY - spread/2 + p1 * spread;
          const depth = (Math.sin(a0) + 1) / 2;
          const alpha = 0.25 + depth * 0.65;
          const g = ctx.createLinearGradient(x0, y0, x1, y1);
          if (strand === 0) {
            g.addColorStop(0, `rgba(37,99,235,${alpha})`);
            g.addColorStop(1, `rgba(99,102,241,${alpha})`);
          } else {
            g.addColorStop(0, `rgba(14,165,233,${alpha * 0.85})`);
            g.addColorStop(1, `rgba(6,182,212,${alpha * 0.85})`);
          }
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
          ctx.strokeStyle = g; ctx.lineWidth = depth * 2.5 + 0.5; ctx.lineCap = "round"; ctx.stroke();
        }
      }

      const nRungs = 18;
      for (let i = 0; i < nRungs; i++) {
        const pct = i / (nRungs - 1), angle = t + pct * Math.PI * 6;
        const y = CY - spread/2 + pct * spread;
        const x0 = CX + Math.cos(angle) * radius, x1 = CX + Math.cos(angle + Math.PI) * radius;
        const depth = (Math.sin(angle) + 1) / 2;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y);
        ctx.strokeStyle = `rgba(37,99,235,${0.1 + depth * 0.25})`; ctx.lineWidth = 0.8; ctx.stroke();
        [[x0,y],[x1,y]].forEach(([nx,ny]) => {
          ctx.beginPath(); ctx.arc(nx as number, ny as number, depth * 3.5 + 1.5, 0, Math.PI * 2);
          ctx.fillStyle = depth > 0.6 ? `rgba(14,165,233,${depth*0.8})` : `rgba(37,99,235,${depth*0.8})`;
          ctx.fill();
        });
      }
      t += speed; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); canvas.removeEventListener("mousemove", onMove); };
  }, []);
  return <canvas ref={ref} className="w-full h-full cursor-crosshair" />;
}

export function SpineSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="bg-white py-14 md:py-20 overflow-hidden border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.2em] mb-5">
              AI Intelligence Core
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[38px] sm:text-[50px] font-black text-slate-900 leading-[1.0] tracking-[-0.03em] mb-6">
              Matching built into the DNA.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
              className="text-[16px] text-slate-500 leading-relaxed mb-10">
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
                  className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800">{item.label}</div>
                    <div className="text-[12px] text-slate-400">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative h-70 md:h-120 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shadow-blue-100/50"
            style={{ background: "radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, white 70%)" }}
          >
            <HelixCanvas />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 inset-x-0 h-16" style={{ background: "linear-gradient(to bottom,white,transparent)" }} />
              <div className="absolute bottom-0 inset-x-0 h-16" style={{ background: "linear-gradient(to top,white,transparent)" }} />
            </div>
            <div className="absolute bottom-5 right-5 text-[10px] text-slate-300 font-mono">
              Move cursor to control speed
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
