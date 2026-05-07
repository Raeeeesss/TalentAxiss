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

    let t = 0;
    let raf: number;
    let mouseY = 0;
    let targetSpeed = 0.012;
    let speed = 0.012;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseY = (e.clientY - rect.top) / rect.height;
      targetSpeed = 0.006 + mouseY * 0.024;
    };
    canvas.addEventListener("mousemove", onMove);

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      speed += (targetSpeed - speed) * 0.05;

      const CX = W / 2;
      const CY = H / 2;
      const radius  = Math.min(W, H) * 0.22;
      const nPoints = 60;
      const spread  = H * 0.85;
      const helixH  = spread / nPoints;

      // Helix strands
      for (let strand = 0; strand < 2; strand++) {
        const phaseOffset = strand === 0 ? 0 : Math.PI;

        for (let i = 0; i < nPoints - 1; i++) {
          const pct0 = i / (nPoints - 1);
          const pct1 = (i + 1) / (nPoints - 1);
          const angle0 = t + pct0 * Math.PI * 6 + phaseOffset;
          const angle1 = t + pct1 * Math.PI * 6 + phaseOffset;

          const x0 = CX + Math.cos(angle0) * radius;
          const y0 = CY - spread / 2 + pct0 * spread;
          const x1 = CX + Math.cos(angle1) * radius;
          const y1 = CY - spread / 2 + pct1 * spread;

          // Depth for brightness
          const depth = (Math.sin(angle0) + 1) / 2;
          const alpha = 0.3 + depth * 0.6;

          const grad = ctx.createLinearGradient(x0, y0, x1, y1);
          if (strand === 0) {
            grad.addColorStop(0, `rgba(99,102,241,${alpha})`);
            grad.addColorStop(1, `rgba(139,92,246,${alpha})`);
          } else {
            grad.addColorStop(0, `rgba(245,158,11,${alpha * 0.7})`);
            grad.addColorStop(1, `rgba(251,191,36,${alpha * 0.7})`);
          }

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = grad;
          ctx.lineWidth = depth * 2 + 0.5;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      // Cross-links (rungs of the helix)
      const nRungs = 18;
      for (let i = 0; i < nRungs; i++) {
        const pct   = i / (nRungs - 1);
        const angle = t + pct * Math.PI * 6;
        const y     = CY - spread / 2 + pct * spread;

        const x0 = CX + Math.cos(angle) * radius;
        const x1 = CX + Math.cos(angle + Math.PI) * radius;

        const depth = (Math.sin(angle) + 1) / 2;
        const alpha = 0.15 + depth * 0.3;

        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        // Node dots
        [[x0, y], [x1, y]].forEach(([nx, ny]) => {
          ctx.beginPath();
          ctx.arc(nx as number, ny as number, depth * 3 + 1, 0, Math.PI * 2);
          ctx.fillStyle = depth > 0.6
            ? `rgba(245,158,11,${depth * 0.7})`
            : `rgba(99,102,241,${depth * 0.7})`;
          ctx.fill();
        });
      }

      t += speed;
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="w-full h-full cursor-crosshair"
      style={{ opacity: 0.9 }}
    />
  );
}

export function SpineSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#050507] py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.2em] mb-5"
            >
              AI Intelligence Core
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[40px] sm:text-[52px] font-black text-white leading-[1.0] tracking-[-0.03em] mb-6"
            >
              Matching built into the DNA.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-[16px] text-white/40 leading-relaxed mb-10"
            >
              Every candidate profile, CV, job requirement, and Gulf history
              feeds a matching engine that ranks your pool and surfaces the
              right fit — before you even think to search.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="space-y-4"
            >
              {[
                { label: "AI CV Parser",       desc: "Extracts 20+ fields from any CV format"   },
                { label: "Match Scoring",       desc: "0–100 score for every candidate-job pair" },
                { label: "Backout Risk AI",     desc: "Predicts candidates likely to ghost"       },
                { label: "Fake Profile Detect", desc: "Flags inflated or inconsistent profiles"  },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white/80">{item.label}</div>
                    <div className="text-[12px] text-white/30">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — helix */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative h-[480px] rounded-3xl overflow-hidden border border-white/[0.07]"
            style={{
              background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, rgba(5,5,7,1) 70%)",
            }}
          >
            <HelixCanvas />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 inset-x-0 h-16"
                style={{ background: "linear-gradient(to bottom,#050507,transparent)" }} />
              <div className="absolute bottom-0 inset-x-0 h-16"
                style={{ background: "linear-gradient(to top,#050507,transparent)" }} />
            </div>
            <div className="absolute bottom-5 right-5 text-[11px] text-white/15 font-mono">
              Move cursor to control speed
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
