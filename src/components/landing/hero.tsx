"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const fade = (delay = 0) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

/* ─── Product preview ───────────────────────────────────────── */
function ProductPreview() {
  const rows = [
    { name: "Arun Menon",     role: "Electrician",     loc: "Kochi",      score: 92, tag: "SHORTLISTED", tc: "bg-blue-50 text-blue-600"     },
    { name: "Sajid Rahman",   role: "Welder",          loc: "Thrissur",   score: 87, tag: "INTERVIEW",   tc: "bg-amber-50 text-amber-600"   },
    { name: "Bindu Krishnan", role: "Nurse (GNM)",     loc: "Trivandrum", score: 95, tag: "OFFER",       tc: "bg-violet-50 text-violet-600" },
    { name: "Manoj Thomas",   role: "Driver (HMV)",    loc: "Kozhikode",  score: 78, tag: "APPLIED",     tc: "bg-zinc-100 text-zinc-500"    },
    { name: "Fathima Nizar",  role: "Sales Executive", loc: "Kannur",     score: 91, tag: "PLACED",      tc: "bg-emerald-50 text-emerald-700"},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.45 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="rounded-2xl overflow-hidden border border-white/[0.09] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">

        {/* Browser chrome */}
        <div className="bg-[#1A1A1E] px-4 py-3 flex items-center gap-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-[#28282C] rounded-md h-6 w-64 flex items-center px-3">
              <span className="text-[11px] text-white/25 font-mono">app.talentaxiss.in/candidates</span>
            </div>
          </div>
        </div>

        {/* App shell */}
        <div className="flex bg-[#F9F9F8]" style={{ height: 372 }}>

          {/* Sidebar */}
          <div className="w-48 bg-white border-r border-gray-100 flex flex-col shrink-0">
            <div className="p-3.5 border-b border-gray-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
                <span className="text-[9px] font-black text-black">TA</span>
              </div>
              <span className="text-[13px] font-semibold text-gray-900 tracking-tight">TalentAxiss</span>
            </div>
            <div className="p-2 flex-1 space-y-0.5">
              {["Dashboard","Candidates","Jobs","Pipeline","Follow-ups","Analytics"].map((item, i) => (
                <div key={item} className={`px-2.5 py-2 rounded-lg text-[11.5px] font-medium ${i === 1 ? "bg-gray-900 text-white" : "text-gray-400"}`}>
                  {item}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-amber-700">AK</span>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-gray-800">Arun Kumar</div>
                <div className="text-[10px] text-gray-400">Agency Owner</div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between shrink-0">
              <div>
                <div className="text-[13px] font-semibold text-gray-900">Candidates</div>
                <div className="text-[10px] text-gray-400 mt-0.5">1,247 total · 34 active this week</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 px-3 bg-gray-100 rounded-lg flex items-center">
                  <span className="text-[10px] text-gray-400">Search candidates…</span>
                </div>
                <div className="h-7 px-3 bg-gray-900 rounded-lg flex items-center">
                  <span className="text-[10px] font-semibold text-white">+ Add</span>
                </div>
              </div>
            </div>

            {/* Table head */}
            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 grid grid-cols-5 gap-3">
              {["Name","Role","Location","AI Score","Status"].map(h => (
                <div key={h} className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-wide">{h}</div>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50/80 overflow-hidden">
              {rows.map((r, i) => (
                <div key={i} className={`px-5 py-2.5 grid grid-cols-5 gap-3 items-center ${i === 2 ? "bg-indigo-50/20" : "hover:bg-white/60"}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-gray-500">{r.name.split(" ").map(n=>n[0]).join("")}</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-800 truncate">{r.name}</span>
                  </div>
                  <span className="text-[10.5px] text-gray-500 truncate">{r.role}</span>
                  <span className="text-[10.5px] text-gray-400">{r.loc}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-8 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.score}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700">{r.score}</span>
                  </div>
                  <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full w-fit ${r.tc}`}>{r.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section className="bg-[#0B0B0F] pt-32 pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Pill */}
        <motion.div {...fade(0)} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[12px] text-white/45 font-medium">Built for Kerala placement consultancies</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fade(0.08)}
          className="text-center text-[46px] sm:text-[62px] lg:text-[74px] font-extrabold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mx-auto mb-6">
          One place for every candidate, job, and placement.
        </motion.h1>

        {/* Sub */}
        <motion.p {...fade(0.16)}
          className="text-center text-[17px] text-white/40 leading-relaxed max-w-lg mx-auto mb-10">
          Stop running your agency on WhatsApp and Excel.
          Get AI matching, pipeline tracking, follow-ups,
          and analytics — all in one proper tool.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fade(0.22)} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link href="/auth/register">
            <button className="group inline-flex items-center gap-2 h-12 px-7 bg-white text-black text-[14px] font-bold rounded-xl hover:bg-white/90 transition-colors">
              Start free — 7 days
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
          <a href="#features"
            className="inline-flex h-12 px-6 items-center text-[14px] font-medium text-white/40 hover:text-white/70 transition-colors">
            See how it works
          </a>
        </motion.div>

        {/* Trust */}
        <motion.div {...fade(0.28)} className="flex flex-wrap items-center justify-center gap-6 mb-20">
          {["No credit card required","Free for 7 days","156+ Kerala agencies"].map(t => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="text-[12px] text-white/30 font-medium">{t}</span>
            </div>
          ))}
        </motion.div>

        {/* Product */}
        <ProductPreview />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto text-center">
          {[
            { n: "12,000+", l: "Candidates managed" },
            { n: "156+",    l: "Active agencies"    },
            { n: "94%",     l: "Placement rate"     },
            { n: "₹2.4Cr+", l: "Revenue tracked"   },
          ].map(s => (
            <div key={s.l}>
              <div className="text-[28px] font-bold text-white leading-none mb-1.5 tracking-tight">{s.n}</div>
              <div className="text-[12px] text-white/25">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
