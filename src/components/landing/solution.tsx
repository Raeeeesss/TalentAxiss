"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Zap, Brain, Shield, BarChart3, Users } from "lucide-react";

const solutions = [
  {
    icon: Brain,
    title: "AI Resume Parsing",
    desc: "Upload hundreds of CVs at once. AI instantly extracts every detail — skills, experience, contacts, Gulf history — into structured profiles.",
    gradient: "from-indigo-500 to-purple-600",
    points: ["Bulk PDF/DOCX upload", "OCR for scanned CVs", "Auto-fills 20+ fields", "Gulf-specific extraction"],
  },
  {
    icon: Zap,
    title: "Smart Candidate Matching",
    desc: "Post a job opening and AI instantly ranks your entire candidate database — Best Fit, Good Fit, Trainable Fit — in seconds.",
    gradient: "from-cyan-500 to-blue-600",
    points: ["AI scoring 0-100%", "Skill gap analysis", "Salary match check", "Location filtering"],
  },
  {
    icon: Shield,
    title: "Fake Profile Detection",
    desc: "AI flags suspicious profiles, inflated experience, and inconsistencies before you waste time on fraud candidates.",
    gradient: "from-rose-500 to-pink-600",
    points: ["Risk score on every profile", "Experience verification", "Duplicate detection", "Blacklist system"],
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "See exactly which recruiters perform best, which job categories have highest placement rate, and your monthly revenue — all live.",
    gradient: "from-amber-500 to-orange-600",
    points: ["Revenue dashboard", "Staff performance", "Placement ratio", "Dropout analysis"],
  },
  {
    icon: Users,
    title: "Pipeline CRM",
    desc: "Drag-drop Kanban board tracks every candidate from Applied → Joined. Never lose track of where anyone stands.",
    gradient: "from-emerald-500 to-teal-600",
    points: ["7-stage kanban board", "Auto-reminders", "One-click shortlist", "PDF profile export"],
  },
];

export function SolutionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="solution" ref={ref} className="py-24 px-4 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">The TalentAxiss Solution</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything Your Agency Needs,
            <br />
            <span className="gradient-text">Built for Kerala</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            We built TalentAxiss after talking to 50+ Kerala recruiters.
            Every feature solves a real pain you face daily.
          </p>
        </motion.div>

        <div className="space-y-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col lg:flex-row items-center gap-6 rounded-2xl border border-white/8 bg-white/2 p-6 lg:p-8 card-hover"
            >
              <div className={`shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                <s.icon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/50 mb-4 leading-relaxed">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.points.map((pt) => (
                    <span key={pt} className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
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
