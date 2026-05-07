"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─── Background Paths ─────────────────────────────────────── */
function BackgroundPaths() {
  const paths = [
    { d: "M-100 400 C200 100 400 600 800 200 S1200 400 1600 300", delay: 0    },
    { d: "M0 600 C300 200 600 800 1000 400 S1400 600 1700 500",   delay: 0.8  },
    { d: "M100 200 C400 500 700 100 1100 500 S1500 200 1800 400", delay: 1.6  },
    { d: "M-200 700 C100 400 500 900 900 500 S1300 700 1700 600", delay: 2.4  },
    { d: "M200 900 C500 600 800 900 1200 600 S1500 800 1900 700", delay: 3.2  },
    { d: "M-50 100 C250 400 550 0 950 300 S1350 100 1650 200",    delay: 0.4  },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="pathGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(99,102,241,0)"   />
            <stop offset="50%"  stopColor="rgba(99,102,241,0.15)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)"   />
          </linearGradient>
          <linearGradient id="pathGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(245,158,11,0)"    />
            <stop offset="50%"  stopColor="rgba(245,158,11,0.08)"  />
            <stop offset="100%" stopColor="rgba(245,158,11,0)"    />
          </linearGradient>
        </defs>
        {paths.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="none"
            stroke={i % 2 === 0 ? "url(#pathGrad1)" : "url(#pathGrad2)"}
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, delay: p.delay, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Sparkle ───────────────────────────────────────────────── */
interface Sparkle { id: number; createdAt: number; size: number; style: React.CSSProperties }

function SparkleInstance({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <motion.span
      style={{ position: "absolute", display: "block", ...style }}
      initial={{ scale: 0, opacity: 0, rotate: -30 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: 30 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path
          d="M34 4L37.5 30.5L64 34L37.5 37.5L34 64L30.5 37.5L4 34L30.5 30.5L34 4Z"
          fill="#F59E0B"
          style={{ filter: "drop-shadow(0 0 4px #F59E0B88)" }}
        />
      </svg>
    </motion.span>
  );
}

function Sparkles({ children }: { children: React.ReactNode }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const counter = useRef(0);

  const generate = useCallback((): Sparkle => ({
    id: counter.current++,
    createdAt: Date.now(),
    size: Math.random() * 12 + 8,
    style: {
      top:  `${Math.random() * 120 - 10}%`,
      left: `${Math.random() * 110 - 5}%`,
    },
  }), []);

  useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now();
      setSparkles(prev => [...prev.filter(s => now - s.createdAt < 700), generate()]);
    }, 350);
    return () => clearInterval(iv);
  }, [generate]);

  return (
    <span className="relative inline-block">
      {sparkles.map(s => <SparkleInstance key={s.id} size={s.size} style={s.style} />)}
      <span className="relative">{children}</span>
    </span>
  );
}

/* ─── Reveal Text ───────────────────────────────────────────── */
function RevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.06 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Shader Noise Canvas ───────────────────────────────────── */
function ShaderCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    let raf: number;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Animated gradient orbs simulating shader
      const cx1 = W * (0.3 + 0.15 * Math.sin(t * 0.4));
      const cy1 = H * (0.4 + 0.12 * Math.cos(t * 0.3));
      const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, W * 0.55);
      g1.addColorStop(0, "rgba(99,102,241,0.18)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      const cx2 = W * (0.7 + 0.12 * Math.cos(t * 0.35));
      const cy2 = H * (0.3 + 0.14 * Math.sin(t * 0.45));
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, W * 0.45);
      g2.addColorStop(0, "rgba(139,92,246,0.14)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      const cx3 = W * (0.5 + 0.18 * Math.sin(t * 0.25));
      const cy3 = H * (0.7 + 0.1 * Math.cos(t * 0.5));
      const g3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, W * 0.35);
      g3.addColorStop(0, "rgba(245,158,11,0.08)");
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, W, H);

      t += 0.008;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── Floating Shapes ───────────────────────────────────────── */
function FloatingShapes() {
  const shapes = [
    { type: "ring",     size: 320, top: "10%",  left: "-8%",  dur: 18, color: "rgba(99,102,241,0.12)"  },
    { type: "ring",     size: 200, top: "60%",  right: "-5%", dur: 22, color: "rgba(139,92,246,0.1)"   },
    { type: "diamond",  size: 80,  top: "20%",  right: "12%", dur: 14, color: "rgba(245,158,11,0.15)"  },
    { type: "triangle", size: 60,  top: "72%",  left: "8%",   dur: 16, color: "rgba(99,102,241,0.18)"  },
    { type: "dot",      size: 12,  top: "35%",  right: "25%", dur: 10, color: "rgba(245,158,11,0.6)"   },
    { type: "dot",      size: 8,   top: "55%",  left: "22%",  dur: 8,  color: "rgba(99,102,241,0.5)"   },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: s.top, left: "left" in s ? s.left : undefined, right: "right" in s ? s.right : undefined }}
          animate={{ y: ["0%", "2%", "-2%", "0%"], rotate: s.type === "ring" ? [0, 360] : [0, 8, -8, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "linear" }}
        >
          {s.type === "ring" && (
            <div style={{ width: s.size, height: s.size, borderRadius: "50%", border: `1.5px solid ${s.color}` }} />
          )}
          {s.type === "diamond" && (
            <div style={{ width: s.size, height: s.size, border: `1.5px solid ${s.color}`, transform: "rotate(45deg)" }} />
          )}
          {s.type === "triangle" && (
            <svg width={s.size} height={s.size} viewBox="0 0 60 60">
              <polygon points="30,4 56,52 4,52" fill="none" stroke={s.color} strokeWidth="1.5" />
            </svg>
          )}
          {s.type === "dot" && (
            <div style={{ width: s.size, height: s.size, borderRadius: "50%", background: s.color }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 25 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.02);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.02);
  };

  return (
    <section
      className="relative min-h-screen bg-[#050507] flex flex-col items-center justify-center overflow-hidden pt-20"
      onMouseMove={handleMouse}
    >
      <ShaderCanvas />
      <BackgroundPaths />
      <FloatingShapes />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 border border-white/[0.12] bg-white/[0.04] backdrop-blur-sm rounded-full px-4 py-2 mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] text-white/50 font-medium tracking-widest uppercase">
            Kerala's Recruitment OS
          </span>
        </motion.div>

        {/* Headline with Sparkles */}
        <h1 className="text-[52px] sm:text-[72px] lg:text-[88px] font-black text-white leading-[0.95] tracking-[-0.04em] mb-8">
          <RevealText text="One place for" className="block" />
          <span className="block mt-1">
            <RevealText text="every" className="" />
            {" "}
            <Sparkles>
              <span className="text-amber-400">placement.</span>
            </Sparkles>
          </span>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[17px] text-white/40 max-w-lg mx-auto leading-relaxed mb-12 font-normal"
        >
          Stop managing your agency in WhatsApp and spreadsheets.
          TalentAxiss is the CRM built specifically for Kerala&apos;s
          placement consultancies.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link href="/auth/register">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2.5 h-14 px-8 bg-white text-black text-[15px] font-bold rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              <motion.span
                className="absolute inset-0 bg-amber-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Start free — 7 days</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </Link>
          <a href="#features" className="text-[15px] text-white/35 hover:text-white/70 transition-colors font-medium">
            See the product →
          </a>
        </motion.div>

        {/* Parallax mockup teaser */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Glass container */}
          <div className="relative rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                {["#FF5F57","#FFBD2E","#28C840"].map(c => (
                  <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/8 rounded h-6 w-56 flex items-center px-3">
                  <span className="text-[11px] text-white/25 font-mono">app.talentaxiss.in</span>
                </div>
              </div>
            </div>

            {/* App */}
            <div className="flex" style={{ height: 340 }}>
              {/* Sidebar */}
              <div className="w-44 border-r border-white/[0.06] flex flex-col shrink-0 bg-black/20">
                <div className="p-3.5 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center">
                    <span className="text-[8px] font-black text-black">TA</span>
                  </div>
                  <span className="text-[12px] font-semibold text-white/80">TalentAxiss</span>
                </div>
                <div className="p-2 space-y-0.5">
                  {["Dashboard","Candidates","Jobs","Pipeline","Follow-ups","Analytics"].map((item, i) => (
                    <div key={item} className={`px-2.5 py-2 rounded-lg text-[11px] font-medium ${
                      i === 1 ? "bg-white/10 text-white" : "text-white/30"
                    }`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main */}
              <div className="flex-1 flex flex-col">
                <div className="border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-white/80">Candidates</div>
                    <div className="text-[10px] text-white/25 mt-0.5">1,247 total</div>
                  </div>
                  <div className="h-7 px-3 bg-amber-400/90 rounded-lg flex items-center">
                    <span className="text-[11px] font-bold text-black">+ Add CV</span>
                  </div>
                </div>
                <div className="divide-y divide-white/[0.04] overflow-hidden">
                  {[
                    { n: "Arun Menon",    r: "Electrician",  s: 92, t: "SHORTLISTED" },
                    { n: "Sajid Rahman",  r: "Welder",       s: 87, t: "INTERVIEW"   },
                    { n: "Bindu K.",      r: "Nurse (GNM)",  s: 95, t: "OFFER"       },
                    { n: "Manoj Thomas",  r: "Driver",       s: 78, t: "APPLIED"     },
                    { n: "Fathima N.",    r: "Sales Exec",   s: 91, t: "PLACED"      },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-white/50">{r.n.split(" ").map(x=>x[0]).join("")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-white/75 truncate">{r.n}</div>
                        <div className="text-[10px] text-white/30">{r.r}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="h-1 w-8 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${r.s}%` }} />
                        </div>
                        <span className="text-[10px] text-white/50 w-5 text-right">{r.s}</span>
                      </div>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        r.t === "PLACED" ? "bg-emerald-400/15 text-emerald-400"
                        : r.t === "OFFER" ? "bg-violet-400/15 text-violet-400"
                        : r.t === "INTERVIEW" ? "bg-amber-400/15 text-amber-400"
                        : r.t === "SHORTLISTED" ? "bg-blue-400/15 text-blue-400"
                        : "bg-white/8 text-white/30"
                      }`}>{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating glass cards */}
          <motion.div
            className="absolute -top-5 -right-6 hidden lg:block"
            animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="rounded-xl border border-white/15 px-4 py-3 text-left"
              style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
              <div className="text-[10px] text-white/35 mb-1">AI Match Score</div>
              <div className="text-[22px] font-black text-white">96%</div>
              <div className="text-[10px] text-emerald-400">Best Fit ↑</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-5 -left-6 hidden lg:block"
            animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="rounded-xl border border-white/15 px-4 py-3 text-left"
              style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
              <div className="text-[10px] text-white/35 mb-1">Placed this month</div>
              <div className="text-[22px] font-black text-white">34</div>
              <div className="text-[10px] text-amber-400">+12 vs last month</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #050507)" }}
      />
    </section>
  );
}
