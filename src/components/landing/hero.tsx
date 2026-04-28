"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
  Brain,
  Play,
} from "lucide-react";
import { Bebas_Neue, Inter } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  subsets: ["latin"],
});
/* ── Particle Canvas ─────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0,
      raf = 0;
    let mx = -999,
      my = -999;

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }
    const COUNT =
      typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 65;
    let pts: P[] = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random(),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* move */
      pts.forEach((p) => {
        const dx = mx - p.x,
          dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx -= (dx / dist) * 0.35;
          p.vy -= (dy / dist) * 0.35;
        }
        p.vx = Math.max(-1.4, Math.min(1.4, p.vx * 0.99));
        p.vy = Math.max(-1.4, Math.min(1.4, p.vy * 0.99));
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });

      /* draw connections */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 130) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      /* draw dots */
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99,102,241,0.28)";
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-80"
    />
  );
}

/* ── Animated Counter ─────────────────────────────────────── */
function Counter({
  to,
  suffix = "",
  prefix = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const ctrl = animate(0, to, {
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setDisplay(Math.round(v)),
          });
          return () => ctrl.stop();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="counter-value tabular-nums">
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ── Floating Analytics Widget ────────────────────────────── */
function FloatWidget({
  children,
  className,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`float-card px-4 py-3 select-none cursor-default absolute ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Dashboard Mockup ─────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="device-frame w-full">
      <div className="device-screen bg-gray-50">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-white border-b border-gray-100">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <div className="flex-1 mx-3 h-5 bg-gray-100 rounded-md flex items-center px-2.5">
            <span className="text-[9px] text-gray-400 font-mono">
              app.talentaxiss.in/dashboard
            </span>
          </div>
        </div>

        <div className="flex h-64 sm:h-80">
          {/* Sidebar */}
          <div className="hidden sm:flex w-32 bg-white border-r border-gray-100 flex-col py-3 px-2 gap-0.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2 mb-3">
              <div className="w-5 h-5 rounded-lg bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                <Zap className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-[8px] font-bold gradient-text">
                TalentAxiss
              </span>
            </div>
            {[
              { label: "Dashboard", a: true },
              { label: "Candidates", a: false },
              { label: "Jobs", a: false },
              { label: "Pipeline", a: false },
              { label: "AI Match", a: false },
              { label: "Analytics", a: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`px-2 py-1 rounded-lg text-[8px] font-medium ${
                  item.a ? "bg-indigo-50 text-indigo-700" : "text-gray-400"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-3 overflow-hidden">
            <div className="text-[9px] font-bold text-gray-700 mb-2">
              Good morning, Arun 👋
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-4 gap-1.5 mb-2.5">
              {[
                {
                  v: "1,247",
                  l: "Candidates",
                  c: "from-indigo-500 to-purple-600",
                },
                { v: "34", l: "Active Jobs", c: "from-cyan-500 to-blue-600" },
                { v: "7", l: "Placed", c: "from-emerald-500 to-teal-500" },
                { v: "12", l: "Follow-ups", c: "from-amber-500 to-orange-500" },
              ].map((s) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + Math.random() * 0.3 }}
                  className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm"
                >
                  <div
                    className={`text-[11px] font-bold bg-linear-to-r ${s.c} bg-clip-text text-transparent`}
                  >
                    {s.v}
                  </div>
                  <div className="text-[7px] text-gray-400 mt-0.5">{s.l}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-3 gap-2">
              {/* Bar chart */}
              <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-2.5 h-28 shadow-sm">
                <div className="text-[8px] text-gray-400 mb-2 font-medium">
                  Placements — 6 months
                </div>
                <div className="flex items-end gap-0.5 h-16">
                  {[22, 38, 30, 55, 45, 68, 52, 80, 62, 88, 72, 94].map(
                    (h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{
                          delay: 1 + i * 0.035,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        className="flex-1 rounded-t-sm"
                        style={{
                          background: `linear-gradient(to top, #6366f1, #a78bfa)`,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Pipeline */}
              <div className="bg-white rounded-xl border border-gray-100 p-2.5 h-28 shadow-sm">
                <div className="text-[8px] text-gray-400 mb-2 font-medium">
                  Pipeline
                </div>
                {[
                  { s: "Interview", w: "85%", c: "#6366f1" },
                  { s: "Offer", w: "60%", c: "#8b5cf6" },
                  { s: "Joined", w: "38%", c: "#10b981" },
                ].map((r) => (
                  <div key={r.s} className="mb-2">
                    <div className="text-[7px] text-gray-400 mb-0.5">{r.s}</div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: r.w }}
                        transition={{
                          delay: 1.2,
                          duration: 0.7,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{ background: r.c }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Hero ───────────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  /* Scroll parallax */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  /* Mouse parallax */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 40, damping: 15 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 15 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [rawX, rawY]);

  const w1x = useTransform(springX, [-0.5, 0.5], [-28, 28]);
  const w1y = useTransform(springY, [-0.5, 0.5], [-18, 18]);
  const w2x = useTransform(springX, [-0.5, 0.5], [22, -22]);
  const w2y = useTransform(springY, [-0.5, 0.5], [-14, 14]);
  const w3x = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const w3y = useTransform(springY, [-0.5, 0.5], [16, -16]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-start pt-24 pb-0 overflow-hidden hero-mesh"
    >
      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* ── Text block ───────────────────────────────────── */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 bg-white/80 border border-indigo-100 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 shadow-sm shadow-indigo-100"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span className="text-xs text-indigo-700 font-semibold tracking-wide">
            Kerala&apos;s #1 AI Recruitment Platform
          </span>
          <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse-ring">
            NEW
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center leading-[0.9]"
          style={{
            fontFamily: '"Heathergreen Regular", sans-serif',
            letterSpacing: "-0.02em",
          }}
        >
          <span className="block text-4xl sm:text-5xl lg:text-[5.2rem] text-gray-950 tracking-[-0.03em]">
            Manage Candidates,
          </span>

          <span className="block -mt-2 text-4xl sm:text-5xl lg:text-[5.2rem] gradient-text tracking-[-0.03em]">
            AI Matching &
          </span>

          <span className="block -mt-2 text-4xl sm:text-5xl lg:text-[5.2rem] text-gray-900 tracking-[-0.03em]">
            Placements
          </span>

          <span className="block -mt-2 text-3xl sm:text-4xl lg:text-[4rem] text-gray-700 tracking-[0.04em]">
            In One CRM
          </span>
        </motion.h1>
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Stop losing candidates in WhatsApp groups and Excel sheets.
          TalentAxiss gives Kerala consultancy agencies a powerful AI-driven CRM
          to find, match, and place candidates{" "}
          <strong className="text-gray-700 font-semibold">10× faster.</strong>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link href="/auth/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2.5 h-14 px-8 bg-gray-950 text-white text-base font-semibold rounded-2xl shadow-xl shadow-gray-900/25 btn-glow btn-shine overflow-hidden"
            >
              Start Free Trial — 7 Days
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2.5 h-14 px-8 bg-white/90 backdrop-blur text-gray-700 text-base font-semibold rounded-2xl border border-gray-200 shadow-md hover:border-indigo-200 hover:shadow-indigo-100/50 hover:text-indigo-700 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <Play className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600 ml-0.5" />
            </div>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="flex flex-wrap items-center justify-center gap-5 mb-14 text-xs text-gray-400"
        >
          {[
            "No credit card required",
            "7-day free trial",
            "Cancel anytime",
            "Kerala-built",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* Live stats counter pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-20"
        >
          {[
            {
              icon: Users,
              value: 2847,
              suffix: "+",
              label: "Candidates placed",
              grad: "from-indigo-500 to-purple-600",
            },
            {
              icon: Briefcase,
              value: 156,
              suffix: "+",
              label: "Active agencies",
              grad: "from-emerald-500 to-cyan-500",
            },
            {
              icon: TrendingUp,
              value: 94,
              suffix: "%",
              label: "Placement rate",
              grad: "from-amber-500 to-orange-500",
            },
            {
              icon: Star,
              value: 4.9,
              suffix: "/5",
              label: "Agency rating",
              grad: "from-rose-500 to-pink-500",
            },
          ].map(({ icon: Icon, value, suffix, label, grad }) => (
            <motion.div
              key={label}
              whileHover={{ y: -3, scale: 1.03 }}
              className="stat-pill flex items-center gap-2.5 px-4 py-2.5 cursor-default"
            >
              <div
                className={`w-8 h-8 rounded-xl bg-linear-to-br ${grad} flex items-center justify-center shadow-sm`}
              >
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-gray-900 leading-none">
                  <Counter to={value} suffix={suffix} />
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Device Mockup + Floating Widgets ─────────────── */}
      <motion.div
        ref={mockupRef}
        style={{ y: mockupY }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6"
      >
        {/* Glow under mockup */}
        <div className="absolute -inset-x-10 -bottom-8 h-40 bg-gradient-to-t from-indigo-100/60 via-violet-50/30 to-transparent blur-3xl pointer-events-none" />

        {/* Floating widget — AI match */}
        <motion.div
          style={{ x: w1x, y: w1y }}
          className="absolute -top-8 -left-4 sm:left-4 z-20 hidden sm:block"
        >
          <FloatWidget delay={1.0}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">
                  AI Match · 96%
                </div>
                <div className="text-[10px] text-gray-400">
                  Rajan K. — Best Fit
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 ml-1 animate-pulse" />
            </div>
          </FloatWidget>
        </motion.div>

        {/* Floating widget — placement today */}
        <motion.div
          style={{ x: w2x, y: w2y }}
          className="absolute -top-6 -right-4 sm:right-2 z-20 hidden sm:block"
        >
          <FloatWidget delay={1.15}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["AM", "PR", "SK"].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white"
                  >
                    {i[0]}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">
                  3 Placed Today
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  +₹42,000 revenue
                </div>
              </div>
            </div>
          </FloatWidget>
        </motion.div>

        {/* Floating widget — interview */}
        <motion.div
          style={{ x: w3x, y: w3y }}
          className="absolute -bottom-6 left-4 sm:left-12 z-20 hidden sm:block"
        >
          <FloatWidget delay={1.3}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <span className="text-base">📅</span>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">
                  Interview @ 2:00 PM
                </div>
                <div className="text-[10px] text-gray-400">
                  Priya M. · Gulf Manager Role
                </div>
              </div>
            </div>
          </FloatWidget>
        </motion.div>

        {/* Main device */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardMockup />
        </motion.div>
      </motion.div>
    </section>
  );
}
