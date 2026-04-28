"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FolderOpen, MessageSquare, FileSpreadsheet, UserX,
  AlertTriangle, Clock, BarChart2, Wifi,
} from "lucide-react";

const problems = [
  { icon: FolderOpen,     title: "CVs Everywhere",    desc: "Thousands of resumes scattered across WhatsApp, email, USB drives, and desktop folders — impossible to find quickly.", icon_c: "text-red-600",     bg: "bg-red-50 border-red-100"     },
  { icon: FileSpreadsheet, title: "Manual Excel Chaos", desc: "Tracking candidates and jobs in complex spreadsheets that break, get corrupted, or become outdated in hours.",       icon_c: "text-orange-600",  bg: "bg-orange-50 border-orange-100" },
  { icon: UserX,           title: "Candidate Backouts", desc: "Candidates accepting offers and disappearing at the last minute with no early warning system to prevent it.",        icon_c: "text-yellow-700",  bg: "bg-yellow-50 border-yellow-100" },
  { icon: AlertTriangle,   title: "Fake Profiles",      desc: "Fake experience, inflated skills, and fabricated certifications waste hours of your recruiters' time.",             icon_c: "text-pink-600",    bg: "bg-pink-50 border-pink-100"     },
  { icon: MessageSquare,   title: "Poor Follow-Ups",    desc: "Missing important interviews, forgotten offer deadlines, and unanswered candidates slipping through the cracks.",   icon_c: "text-purple-600",  bg: "bg-purple-50 border-purple-100" },
  { icon: BarChart2,       title: "Zero Analytics",     desc: "No visibility into team performance, placement rates, revenue, or what's actually working in your agency.",         icon_c: "text-blue-600",    bg: "bg-blue-50 border-blue-100"     },
  { icon: Clock,           title: "Slow Matching",      desc: "Manually scanning 500+ CVs for every new opening takes days while the client hires someone else.",                  icon_c: "text-cyan-600",    bg: "bg-cyan-50 border-cyan-100"     },
  { icon: Wifi,            title: "No Online Identity", desc: "While modern agencies build digital brands, local consultancies are invisible online and losing clients.",           icon_c: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100"},
];

export function ProblemSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 px-4 relative bg-white">
      <div className="absolute top-0 inset-x-0 h-px mesh-divider" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs text-red-600 font-semibold">The Real Problem</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-4">
            Why Most Kerala Consultancies
            <br />
            <span className="gradient-text">Struggle to Scale</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Running a consultancy in 2025 with 2005 tools is a silent killer.
            Here&apos;s what&apos;s holding your agency back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [.22, 1, .36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-2xl border p-5 cursor-default ${p.bg} transition-shadow hover:shadow-md hover:shadow-gray-900/5`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm ${p.icon_c}`}>
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
