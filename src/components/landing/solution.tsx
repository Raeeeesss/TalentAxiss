"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Zap, Brain, Shield, BarChart3, Users } from "lucide-react";

const solutions = [
  {
    icon: Brain,
    title: "AI Resume Parsing",
    desc: "Upload hundreds of CVs at once. AI instantly extracts every detail — skills, experience, contacts, Gulf history — into structured profiles.",
    gradient: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50",
    points: ["Bulk PDF/DOCX upload", "OCR for scanned CVs", "Auto-fills 20+ fields", "Gulf-specific extraction"],
  },
  {
    icon: Zap,
    title: "Smart Candidate Matching",
    desc: "Post a job opening and AI instantly ranks your entire candidate database — Best Fit, Good Fit, Trainable Fit — in seconds.",
    gradient: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-50",
    points: ["AI scoring 0-100%", "Skill gap analysis", "Salary match check", "Location filtering"],
  },
  {
    icon: Shield,
    title: "Fake Profile Detection",
    desc: "AI flags suspicious profiles, inflated experience, and inconsistencies before you waste time on fraud candidates.",
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    points: ["Risk score on every profile", "Experience verification", "Duplicate detection", "Blacklist system"],
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "See exactly which recruiters perform best, which job categories have highest placement rate, and your monthly revenue — all live.",
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    points: ["Revenue dashboard", "Staff performance", "Placement ratio", "Dropout analysis"],
  },
  {
    icon: Users,
    title: "Pipeline CRM",
    desc: "Drag-drop Kanban board tracks every candidate from Applied → Joined. Never lose track of where anyone stands.",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    points: ["7-stage kanban board", "Auto-reminders", "One-click shortlist", "PDF profile export"],
  },
];

export function SolutionSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="solution" ref={ref} className="py-28 px-4 relative bg-gray-50/60">
      <div className="absolute top-0 inset-x-0 h-px mesh-divider" />
      <div className="absolute bottom-0 inset-x-0 h-px mesh-divider" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-87.5 bg-indigo-100/60 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-semibold">The TalentAxiss Solution</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-4">
            Everything Your Agency Needs,
            <br />
            <span className="gradient-text">Built for Kerala</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We built TalentAxiss after talking to 50+ Kerala recruiters.
            Every feature solves a real pain you face daily.
          </p>
        </motion.div>

        <div className="space-y-4">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [.22, 1, .36, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="flex flex-col lg:flex-row items-start lg:items-center gap-6 glass-card p-6 lg:p-8"
            >
              <div className={`shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                <s.icon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 mb-4 leading-relaxed">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.points.map((pt) => (
                    <span
                      key={pt}
                      className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 shadow-sm"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
