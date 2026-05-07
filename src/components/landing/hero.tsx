"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Star, CheckCircle } from "lucide-react";

/* ─── Candidate data ─────────────────────────────────────────── */
const CARDS = [
  {
    name: "Arun Menon",    initials: "AM", role: "Senior Electrician",
    district: "Ernakulam", exp: "4 yrs", score: 96,
    skills: ["HV Wiring", "Panel Board", "Gulf Ready"],
    status: "SHORTLISTED", color: "#2563eb",
  },
  {
    name: "Fathima Nizar", initials: "FN", role: "Staff Nurse (GNM)",
    district: "Kozhikode",  exp: "5 yrs", score: 91,
    skills: ["ICU Care", "OT Scrub", "NCLEX"],
    status: "INTERVIEW",   color: "#6366f1",
  },
  {
    name: "Rajan Pillai",  initials: "RP", role: "Civil Engineer",
    district: "Thrissur",   exp: "6 yrs", score: 88,
    skills: ["AutoCAD", "Site Mgmt", "QS"],
    status: "OFFER",       color: "#0ea5e9",
  },
  {
    name: "Priya Menon",   initials: "PM", role: "HR Executive",
    district: "Kochi",      exp: "3 yrs", score: 85,
    skills: ["Recruitment", "HRMS", "Payroll"],
    status: "PLACED",      color: "#10b981",
  },
];

/* ─── Score ring ─────────────────────────────────────────────── */
function ScoreRing({ score, color }: { score: number; color: string }) {
  const R = 26, C = 2 * Math.PI * R;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
        <motion.circle cx="32" cy="32" r={R} fill="none"
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - score / 100) }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.25 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-black text-[15px] leading-none">{score}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-white/35">AI</span>
      </div>
    </div>
  );
}

/* ─── Stacked candidate card ─────────────────────────────────── */
function CandidateCard({ card, stackPos }: { card: typeof CARDS[0]; stackPos: number }) {
  const pos = [
    { y: 0,  x: 0,  scale: 1,     rotateZ: 0,   opacity: 1    },
    { y: 20, x: 12, scale: 0.955, rotateZ: 2,   opacity: 0.8  },
    { y: 38, x: 22, scale: 0.91,  rotateZ: 4,   opacity: 0.55 },
  ][stackPos] ?? { y: 38, x: 22, scale: 0.91, rotateZ: 4, opacity: 0.55 };

  return (
    <motion.div
      style={{ zIndex: 3 - stackPos, position: "absolute", width: "100%" }}
      initial={{ y: 55, x: 26, scale: 0.86, opacity: 0, rotateZ: 6 }}
      animate={pos}
      exit={{ y: -80, x: 0, scale: 0.88, opacity: 0, rotateZ: -4,
        transition: { duration: 0.38, ease: [0.4, 0, 1, 1] } }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-2xl p-5 border border-white/[0.07]"
        style={{
          background: "linear-gradient(140deg,rgba(13,20,45,0.97) 0%,rgba(8,12,28,0.99) 100%)",
          backdropFilter: "blur(24px)",
          boxShadow: stackPos === 0
            ? `0 30px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04),0 10px 32px ${card.color}18`
            : "0 10px 28px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-start gap-4">
          <ScoreRing score={card.score} color={card.color} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <div className="text-[15px] font-bold text-white leading-tight">{card.name}</div>
                <div className="text-[12px] text-white/40">{card.role}</div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: `${card.color}20`, border: `1px solid ${card.color}45`, color: card.color }}>
                {card.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] text-white/28 flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 shrink-0" />{card.district}
              </span>
              <span className="text-[11px] text-white/28">{card.exp} exp</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {card.skills.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI bar — front card only */}
        {stackPos === 0 && (
          <div className="mt-4 pt-3.5 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">AI Match Score</span>
              <span className="text-[11px] font-black" style={{ color: card.color }}>{card.score}% fit</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg,${card.color},${card.color}70)` }}
                initial={{ width: 0 }}
                animate={{ width: `${card.score}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Clip-path line reveal ──────────────────────────────────── */
function RevealLine({ children, delay, className }: {
  children: React.ReactNode; delay: number; className?: string;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className={className}
        initial={{ y: "112%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
export function HeroSection() {
  const [active, setActive] = useState(0);

  /* Mouse parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 30 });

  /* Auto-advance card stack */
  useEffect(() => {
    const iv = setInterval(() => setActive(a => (a + 1) % CARDS.length), 3800);
    return () => clearInterval(iv);
  }, []);

  const stackIndices = [0, 1, 2].map(i => (active + i) % CARDS.length);
  const activeCard   = CARDS[active];

  return (
    <section
      className="relative min-h-screen flex overflow-hidden"
      style={{ background: "linear-gradient(145deg,#04070e 0%,#07102a 55%,#050919 100%)" }}
      onMouseMove={e => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseX.set((e.clientX - r.left - r.width / 2) * 0.01);
        mouseY.set((e.clientY - r.top  - r.height / 2) * 0.01);
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-700/[0.07] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-700/[0.05] blur-[130px] rounded-full pointer-events-none" />

      {/* Fine grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* ── Left panel ───────────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-[52%] flex flex-col justify-center
        px-6 sm:px-10 lg:px-16 xl:px-20 pt-28 pb-10 lg:pt-0 lg:pb-0">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-blue-500/22 bg-blue-500/[0.07]
            rounded-full px-4 py-2 mb-10 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] text-blue-300/75 font-semibold tracking-wide">
            Kerala&apos;s #1 AI Recruitment CRM
          </span>
        </motion.div>

        {/* Headline — line-by-line reveal */}
        <h1 className="text-[46px] sm:text-[58px] lg:text-[62px] xl:text-[72px]
          font-black leading-[0.92] tracking-[-0.04em] text-white mb-8">
          <RevealLine delay={0.1}>The CRM</RevealLine>
          <RevealLine delay={0.22} className="text-white/45">built for</RevealLine>
          <RevealLine delay={0.34}>Kerala&apos;s</RevealLine>
          <RevealLine delay={0.46}>
            <span style={{
              background: "linear-gradient(95deg,#3b82f6,#818cf8 55%,#c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              best agencies.
            </span>
          </RevealLine>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="text-[15px] sm:text-[16px] text-white/38 leading-relaxed
            max-w-sm lg:max-w-md mb-10"
        >
          Stop running your placements on WhatsApp and Excel.
          AI matching, pipeline, follow-ups, and analytics — one platform.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <Link href="/auth/register">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 h-12 px-7
                bg-blue-600 hover:bg-blue-500 text-white text-[15px] font-bold
                rounded-2xl shadow-xl shadow-blue-600/35 transition-colors"
            >
              Start free — 7 days
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </Link>
          <a href="#features">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 h-12 px-6
                border border-white/10 hover:border-white/22 text-white/45
                hover:text-white/75 text-[14px] font-medium rounded-2xl transition-all"
            >
              See how it works →
            </motion.button>
          </a>
        </motion.div>

        {/* Mobile card preview */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden mb-6"
          >
            <div className="rounded-2xl p-4 border border-white/[0.07]"
              style={{
                background: "linear-gradient(140deg,rgba(13,20,45,0.97) 0%,rgba(8,12,28,0.99) 100%)",
                boxShadow: `0 20px 48px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04),0 6px 24px ${activeCard.color}18`,
              }}
            >
              <div className="flex items-start gap-3">
                <ScoreRing score={activeCard.score} color={activeCard.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="text-[14px] font-bold text-white leading-tight">{activeCard.name}</div>
                      <div className="text-[11px] text-white/40">{activeCard.role}</div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: `${activeCard.color}20`, border: `1px solid ${activeCard.color}45`, color: activeCard.color }}>
                      {activeCard.status}
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {activeCard.skills.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-white/28 font-semibold uppercase tracking-wider">AI Match</span>
                  <span className="text-[11px] font-black" style={{ color: activeCard.color }}>{activeCard.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg,${activeCard.color},${activeCard.color}70)` }}
                    initial={{ width: 0 }} animate={{ width: `${activeCard.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              {CARDS.map((c, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: active === i ? 24 : 6, background: active === i ? c.color : "rgba(255,255,255,0.18)" }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
          className="flex flex-wrap gap-4"
        >
          {["No credit card", "7-day free trial", "156+ agencies"].map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-[12px] text-white/28 font-medium">{t}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right panel — 3D card stack ──────────────────── */}
      <motion.div
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ x: springX, y: springY }}
      >
        {/* Active card color glow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute w-96 h-96 rounded-full blur-[100px] pointer-events-none"
            style={{ background: `radial-gradient(circle,${activeCard.color}22 0%,transparent 70%)` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        {/* Card stack */}
        <div className="relative w-[400px] h-[240px]">
          <AnimatePresence>
            {stackIndices.map((cardIndex, stackPos) => (
              <CandidateCard key={cardIndex} card={CARDS[cardIndex]} stackPos={stackPos} />
            ))}
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {CARDS.map((c, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: active === i ? 24 : 6, background: active === i ? c.color : "rgba(255,255,255,0.18)" }}
            />
          ))}
        </div>

        {/* Floating — placements today */}
        <motion.div
          className="absolute top-20 right-12"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="bg-white/[0.06] border border-white/[0.09] backdrop-blur-xl
            rounded-xl px-3.5 py-2.5 shadow-xl shadow-black/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[12px] font-semibold text-white/60">3 placed today</span>
            </div>
          </div>
        </motion.div>

        {/* Floating — rating */}
        <motion.div
          className="absolute bottom-28 left-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <div className="bg-white/[0.06] border border-white/[0.09] backdrop-blur-xl
            rounded-xl px-3.5 py-2.5 shadow-xl shadow-black/30">
            <div className="flex items-center gap-1 mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-2.5 w-2.5 text-amber-400 fill-current" />
              ))}
            </div>
            <div className="text-[11px] font-semibold text-white/50">4.9 · 156 agencies</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade — blends into next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom,transparent,#04070e)" }} />
    </section>
  );
}
