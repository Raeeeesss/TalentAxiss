"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  FolderOpen, MessageSquare, FileSpreadsheet, UserX,
  AlertTriangle, Clock, BarChart2, Wifi
} from "lucide-react";

const problems = [
  {
    icon: FolderOpen,
    title: "CVs Everywhere",
    desc: "Thousands of resumes scattered across WhatsApp, email, USB drives, and desktop folders — impossible to find quickly.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: FileSpreadsheet,
    title: "Manual Excel Chaos",
    desc: "Tracking candidates and jobs in complex spreadsheets that break, get corrupted, or become outdated in hours.",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: UserX,
    title: "Candidate Backouts",
    desc: "Candidates accepting offers and disappearing at the last minute with no early warning system to prevent it.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: AlertTriangle,
    title: "Fake Profiles",
    desc: "Fake experience, inflated skills, and fabricated certifications waste hours of your recruiters' time.",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: MessageSquare,
    title: "Poor Follow-Ups",
    desc: "Missing important interviews, forgotten offer deadlines, and unanswered candidates slipping through the cracks.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: BarChart2,
    title: "Zero Analytics",
    desc: "No visibility into team performance, placement rates, revenue, or what's actually working in your agency.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Clock,
    title: "Slow Matching",
    desc: "Manually scanning 500+ CVs for every new opening takes days while the client hires someone else.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Wifi,
    title: "No Online Identity",
    desc: "While modern agencies build digital brands, local consultancies are invisible online and losing clients.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-linear-to-b from-[#050508] via-[#08080f] to-[#050508]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs text-red-400 font-medium">The Real Problem</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Why Most Kerala Consultancies
            <br />
            <span className="gradient-text-gold">Struggle to Scale</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Running a consultancy in 2025 with 2005 tools is a silent killer.
            Here's what's holding your agency back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`rounded-2xl border p-5 card-hover ${p.bg}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${p.color}`}>
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
