"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

/* ─── Background Paths ─────────────────────────────────────── */
function BackgroundPaths() {
  const paths = [
    { d: "M-100 400 C200 100 400 600 800 200 S1200 400 1600 300", delay: 0   },
    { d: "M0 600 C300 200 600 800 1000 400 S1400 600 1700 500",   delay: 0.8 },
    { d: "M100 200 C400 500 700 100 1100 500 S1500 200 1800 400", delay: 1.6 },
    { d: "M-200 700 C100 400 500 900 900 500 S1300 700 1700 600", delay: 2.4 },
    { d: "M200 900 C500 600 800 900 1200 600 S1500 800 1900 700", delay: 3.2 },
    { d: "M-50 100 C250 400 550 0 950 300 S1350 100 1650 200",    delay: 0.4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(37,99,235,0)"    />
            <stop offset="50%"  stopColor="rgba(37,99,235,0.12)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)"   />
          </linearGradient>
          <linearGradient id="pg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(14,165,233,0)"   />
            <stop offset="50%"  stopColor="rgba(14,165,233,0.1)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)"   />
          </linearGradient>
        </defs>
        {paths.map((p, i) => (
          <motion.path key={i} d={p.d} fill="none"
            stroke={i % 2 === 0 ? "url(#pg1)" : "url(#pg2)"}
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
    <motion.span style={{ position: "absolute", display: "block", ...style }}
      initial={{ scale: 0, opacity: 0, rotate: -20 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: 20 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}>
      <svg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path d="M34 4L37.5 30.5L64 34L37.5 37.5L34 64L30.5 37.5L4 34L30.5 30.5L34 4Z"
          fill="#2563eb"
          style={{ filter: "drop-shadow(0 0 4px rgba(37,99,235,0.5))" }}
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
    style: { top: `${Math.random() * 120 - 10}%`, left: `${Math.random() * 110 - 5}%` },
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
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <motion.span key={i} className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}>
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Shader Canvas (light) ─────────────────────────────────── */
function ShaderCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let t = 0, raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const orbs: [number, number, number, string][] = [
        [W * (0.2 + 0.1 * Math.sin(t * 0.4)),  H * (0.3 + 0.1 * Math.cos(t * 0.3)),  W * 0.5,  "rgba(37,99,235,0.06)"],
        [W * (0.75 + 0.1 * Math.cos(t * 0.35)), H * (0.25 + 0.1 * Math.sin(t * 0.45)), W * 0.4, "rgba(99,102,241,0.05)"],
        [W * (0.5 + 0.15 * Math.sin(t * 0.25)), H * (0.7 + 0.08 * Math.cos(t * 0.5)),  W * 0.35, "rgba(14,165,233,0.06)"],
      ];
      orbs.forEach(([cx, cy, r, color]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      t += 0.006; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── Floating Shapes ───────────────────────────────────────── */
function FloatingShapes() {
  const shapes = [
    { type: "ring",    size: 300, top: "8%",   left: "-6%",  dur: 20, col: "rgba(37,99,235,0.08)"   },
    { type: "ring",    size: 180, top: "58%",  right: "-4%", dur: 24, col: "rgba(99,102,241,0.07)"  },
    { type: "diamond", size: 70,  top: "18%",  right: "10%", dur: 14, col: "rgba(14,165,233,0.15)"  },
    { type: "triangle",size: 50,  top: "70%",  left: "7%",   dur: 16, col: "rgba(37,99,235,0.12)"   },
    { type: "dot",     size: 10,  top: "34%",  right: "24%", dur: 10, col: "rgba(99,102,241,0.4)"   },
    { type: "dot",     size: 7,   top: "54%",  left: "20%",  dur: 8,  col: "rgba(14,165,233,0.4)"   },
  ] as const;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div key={i} className="absolute"
          style={{ top: s.top, left: "left" in s ? s.left : undefined, right: "right" in s ? s.right : undefined }}
          animate={{ y: ["0%","2%","-2%","0%"], rotate: s.type === "ring" ? [0,360] : [0,8,-8,0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "linear" }}>
          {s.type === "ring"    && <div style={{ width: s.size, height: s.size, borderRadius: "50%", border: `1.5px solid ${s.col}` }} />}
          {s.type === "diamond" && <div style={{ width: s.size, height: s.size, border: `1.5px solid ${s.col}`, transform: "rotate(45deg)" }} />}
          {s.type === "triangle"&& <svg width={s.size} height={s.size} viewBox="0 0 60 60"><polygon points="30,4 56,52 4,52" fill="none" stroke={s.col} strokeWidth="1.5"/></svg>}
          {s.type === "dot"     && <div style={{ width: s.size, height: s.size, borderRadius: "50%", background: s.col }} />}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
export function HeroSection() {
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 25 });

  return (
    <section
      className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden pt-20"
      onMouseMove={e => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseX.set((e.clientX - r.left - r.width / 2) * 0.015);
        mouseY.set((e.clientY - r.top  - r.height / 2) * 0.015);
      }}
    >
      <ShaderCanvas />
      <BackgroundPaths />
      <FloatingShapes />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(rgba(37,99,235,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 rounded-full px-4 py-2 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[12px] text-blue-700 font-semibold tracking-wide">
            Built for Kerala placement consultancies
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-[50px] sm:text-[68px] lg:text-[82px] font-black text-slate-900 leading-[0.96] tracking-[-0.04em] mb-8">
          <RevealText text="One place for" className="block" />
          <span className="block mt-1">
            <RevealText text="every" />
            {" "}
            <Sparkles>
              <span className="text-blue-600">placement.</span>
            </Sparkles>
          </span>
        </h1>

        {/* Sub */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[17px] text-slate-500 max-w-lg mx-auto leading-relaxed mb-12">
          Stop running your agency on WhatsApp and Excel.
          TalentAxiss gives Kerala&apos;s recruitment consultancies a proper CRM —
          AI matching, pipeline tracking, follow-ups, and analytics in one tool.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link href="/auth/register">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2.5 h-14 px-8 bg-blue-600 text-white text-[15px] font-bold rounded-2xl overflow-hidden shadow-xl shadow-blue-600/25 hover:bg-blue-700 transition-colors">
              Start free — 7 days
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </Link>
          <a href="#features" className="text-[15px] text-slate-400 hover:text-slate-700 transition-colors font-medium">
            See how it works →
          </a>
        </motion.div>

        {/* Trust */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-20">
          {["No credit card required","Free for 7 days","156+ Kerala agencies"].map(t => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="text-[12px] text-slate-400 font-medium">{t}</span>
            </div>
          ))}
        </motion.div>

        {/* Product mockup */}
        <motion.div style={{ x: springX, y: springY }} className="relative max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/10"
            style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)" }}>

            {/* Light chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-1.5">
                {["#FF5F57","#FFBD2E","#28C840"].map(c => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white border border-slate-200 rounded h-6 w-60 flex items-center px-3 shadow-sm">
                  <span className="text-[11px] text-slate-400 font-mono">app.talentaxiss.in/candidates</span>
                </div>
              </div>
            </div>

            {/* App */}
            <div className="flex bg-slate-50" style={{ height: 340 }}>
              <div className="w-44 bg-white border-r border-slate-100 flex flex-col shrink-0">
                <div className="p-3.5 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                    <span className="text-[9px] font-black text-white">TA</span>
                  </div>
                  <span className="text-[12px] font-semibold text-slate-800">TalentAxiss</span>
                </div>
                <div className="p-2 space-y-0.5">
                  {["Dashboard","Candidates","Jobs","Pipeline","Follow-ups","Analytics"].map((item, i) => (
                    <div key={item} className={`px-2.5 py-2 rounded-lg text-[11px] font-medium ${
                      i === 1 ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-50"
                    }`}>{item}</div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between shrink-0">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800">Candidates</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">1,247 total</div>
                  </div>
                  <div className="h-7 px-3 bg-blue-600 rounded-lg flex items-center">
                    <span className="text-[11px] font-bold text-white">+ Add CV</span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 grid grid-cols-5 gap-3">
                  {["Name","Role","Location","AI Score","Status"].map(h =>
                    <div key={h} className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">{h}</div>
                  )}
                </div>
                <div className="divide-y divide-slate-50 overflow-hidden">
                  {[
                    { n:"Arun Menon",    r:"Electrician",  s:92, t:"SHORTLISTED", tc:"bg-blue-50 text-blue-600"     },
                    { n:"Sajid Rahman",  r:"Welder",       s:87, t:"INTERVIEW",   tc:"bg-amber-50 text-amber-600"   },
                    { n:"Bindu K.",      r:"Nurse (GNM)",  s:95, t:"OFFER",       tc:"bg-violet-50 text-violet-600" },
                    { n:"Manoj Thomas",  r:"Driver",       s:78, t:"APPLIED",     tc:"bg-slate-100 text-slate-500"  },
                    { n:"Fathima N.",    r:"Sales Exec",   s:91, t:"PLACED",      tc:"bg-emerald-50 text-emerald-700"},
                  ].map((r,i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/30 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-slate-500">{r.n.split(" ").map(x=>x[0]).join("")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11.5px] font-medium text-slate-700 truncate">{r.n}</div>
                        <div className="text-[10px] text-slate-400">{r.r}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="h-1 w-8 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width:`${r.s}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600">{r.s}</span>
                      </div>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${r.tc}`}>{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating stat cards */}
          <motion.div className="absolute -top-5 -right-6 hidden lg:block"
            animate={{ y:[0,-6,0] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}>
            <div className="rounded-xl border border-blue-100 bg-white/90 backdrop-blur-md px-4 py-3 shadow-lg shadow-blue-100/50">
              <div className="text-[10px] text-slate-400 mb-1">AI Match Score</div>
              <div className="text-[22px] font-black text-blue-600">96%</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Best Fit ↑</div>
            </div>
          </motion.div>
          <motion.div className="absolute -bottom-5 -left-6 hidden lg:block"
            animate={{ y:[0,6,0] }} transition={{ duration:5, repeat:Infinity, ease:"easeInOut", delay:1 }}>
            <div className="rounded-xl border border-indigo-100 bg-white/90 backdrop-blur-md px-4 py-3 shadow-lg shadow-indigo-100/50">
              <div className="text-[10px] text-slate-400 mb-1">Placed this month</div>
              <div className="text-[22px] font-black text-indigo-600">34</div>
              <div className="text-[10px] text-blue-600 font-semibold">+12 vs last month</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
    </section>
  );
}
