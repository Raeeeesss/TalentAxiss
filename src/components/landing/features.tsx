"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Upload, Search, GitBranch, Bell, AlertOctagon, FileText,
  Users, Globe, MapPin, BarChart, Download, Phone,
  FilePlus, Star, Layers, Mail, Zap, Brain,
} from "lucide-react";

/* ── Bento items — varying spans for premium asymmetric feel ── */
const bento = [
  {
    icon: Brain,
    title: "AI Matching Engine",
    desc: "Post a job and rank your entire candidate database by fit score in under 2 seconds. Best Fit · Good Fit · Trainable Fit.",
    color: "text-indigo-600", bg: "bg-indigo-50",
    col: "lg:col-span-2", row: "lg:row-span-2",
    featured: true,
    accent: "from-indigo-500/10 to-purple-500/5",
    preview: (
      <div className="mt-4 space-y-2 pointer-events-none select-none">
        {[
          { name: "Rajan K.", score: 96, c: "bg-emerald-500", label: "Best Fit", lc: "text-emerald-700 bg-emerald-50" },
          { name: "Priya M.", score: 78, c: "bg-blue-500",    label: "Good Fit", lc: "text-blue-700 bg-blue-50"       },
          { name: "Anoop S.", score: 52, c: "bg-amber-500",   label: "Trainable", lc: "text-amber-700 bg-amber-50"   },
        ].map((r) => (
          <div key={r.name} className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
              {r.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-gray-800">{r.name}</div>
              <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.score}%` }}
                  transition={{ duration: .8, delay: .2 }}
                  className={`h-full rounded-full ${r.c}`}
                  viewport={{ once: true }}
                />
              </div>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${r.lc}`}>{r.label}</span>
            <span className="text-[11px] font-bold text-gray-700">{r.score}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Upload,
    title: "Bulk CV Upload",
    desc: "PDF, DOCX, images — upload 100s at once. AI extracts 20+ fields automatically.",
    color: "text-purple-600", bg: "bg-purple-50",
    col: "", row: "",
    featured: false,
    accent: "from-purple-500/8 to-pink-500/5",
    preview: null,
  },
  {
    icon: GitBranch,
    title: "Kanban Pipeline",
    desc: "Drag-drop board across 7 stages: Applied → Screening → Interview → Offer → Joined.",
    color: "text-cyan-600", bg: "bg-cyan-50",
    col: "", row: "",
    featured: false,
    accent: "from-cyan-500/8 to-blue-500/5",
    preview: (
      <div className="mt-3 flex gap-1.5 overflow-hidden pointer-events-none select-none">
        {["Applied", "Interview", "Offer", "Joined"].map((s, i) => (
          <div key={s} className="flex-1 min-w-0">
            <div className="text-[8px] text-gray-400 mb-1 truncate">{s}</div>
            <div className="space-y-1">
              {Array.from({ length: 3 - i }).map((_, j) => (
                <div key={j} className="h-4 bg-cyan-100 rounded text-[7px] text-cyan-700 px-1 flex items-center truncate">
                  {["Rajan", "Priya", "Anoop"][j] || ""}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: BarChart,
    title: "Revenue Analytics",
    desc: "Track placements, fees, and team ROI with live charts and exportable reports.",
    color: "text-emerald-600", bg: "bg-emerald-50",
    col: "lg:col-span-2", row: "",
    featured: false,
    accent: "from-emerald-500/8 to-teal-500/5",
    preview: (
      <div className="mt-3 flex items-end gap-1 h-10 pointer-events-none select-none">
        {[40,65,50,80,70,90,78,95,85,100].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ delay: i * .04, duration: .5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex-1 rounded-t bg-linear-to-t from-emerald-500 to-emerald-300"
          />
        ))}
      </div>
    ),
  },
  {
    icon: AlertOctagon,
    title: "Backout Risk Alert",
    desc: "Predict candidate dropout before it happens with AI risk scoring.",
    color: "text-rose-600", bg: "bg-rose-50",
    col: "", row: "",
    featured: false,
    accent: "from-rose-500/8 to-pink-500/5",
    preview: null,
  },
  {
    icon: Globe,
    title: "Gulf Recruitment Mode",
    desc: "Passport, visa, and Gulf experience tracking. Built for Kerala-to-Gulf agencies.",
    color: "text-teal-600", bg: "bg-teal-50",
    col: "", row: "",
    featured: false,
    accent: "from-teal-500/8 to-green-500/5",
    preview: null,
  },
  {
    icon: Bell,
    title: "Smart Follow-ups",
    desc: "Auto-reminders for interviews, offer deadlines, and joining dates. Never miss a step.",
    color: "text-amber-600", bg: "bg-amber-50",
    col: "", row: "",
    featured: false,
    accent: "from-amber-500/8 to-orange-500/5",
    preview: null,
  },
  {
    icon: Search,
    title: "Instant Search",
    desc: "Find any candidate by skill, location, salary, or Gulf experience in under 0.1s.",
    color: "text-blue-600", bg: "bg-blue-50",
    col: "", row: "",
    featured: false,
    accent: "from-blue-500/8 to-indigo-500/5",
    preview: null,
  },
  {
    icon: Users,
    title: "Team Permissions",
    desc: "Multi-recruiter with role-based access. Know exactly what each team member handles.",
    color: "text-violet-600", bg: "bg-violet-50",
    col: "", row: "",
    featured: false,
    accent: "from-violet-500/8 to-purple-500/5",
    preview: null,
  },
  {
    icon: FileText,
    title: "PDF Profile Export",
    desc: "Send branded candidate profiles directly to clients — one click.",
    color: "text-orange-600", bg: "bg-orange-50",
    col: "", row: "",
    featured: false,
    accent: "from-orange-500/8 to-amber-500/5",
    preview: null,
  },
  {
    icon: MapPin,
    title: "Kerala District Filter",
    desc: "Search candidates by exact Kerala district. Essential for local placement.",
    color: "text-pink-600", bg: "bg-pink-50",
    col: "", row: "",
    featured: false,
    accent: "from-pink-500/8 to-rose-500/5",
    preview: null,
  },
  {
    icon: Download,
    title: "CSV / Excel Import",
    desc: "Migrate your entire old database in minutes. Duplicate detection included.",
    color: "text-lime-600", bg: "bg-lime-50",
    col: "", row: "",
    featured: false,
    accent: "from-lime-500/8 to-green-500/5",
    preview: null,
  },
  {
    icon: Phone,
    title: "WhatsApp Import",
    desc: "Import leads directly from WhatsApp chats and shared CV lists.",
    color: "text-green-600", bg: "bg-green-50",
    col: "", row: "",
    featured: false,
    accent: "from-green-500/8 to-emerald-500/5",
    preview: null,
  },
  {
    icon: FilePlus,
    title: "Invoice Generator",
    desc: "Create professional placement invoices with GST in one click.",
    color: "text-sky-600", bg: "bg-sky-50",
    col: "", row: "",
    featured: false,
    accent: "from-sky-500/8 to-cyan-500/5",
    preview: null,
  },
  {
    icon: Layers,
    title: "Duplicate Detector",
    desc: "Auto-merge duplicate candidate profiles — keep your database clean.",
    color: "text-red-600", bg: "bg-red-50",
    col: "", row: "",
    featured: false,
    accent: "from-red-500/8 to-rose-500/5",
    preview: null,
  },
  {
    icon: Mail,
    title: "Email Automation",
    desc: "Auto-send interview invites, offer letters, and status updates.",
    color: "text-indigo-600", bg: "bg-indigo-50",
    col: "", row: "",
    featured: false,
    accent: "from-indigo-500/8 to-blue-500/5",
    preview: null,
  },
];

export function FeaturesGrid() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-28 px-4 relative bg-white">
      <div className="absolute top-0 inset-x-0 h-px mesh-divider" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .65 }}
          className="text-center mb-16"
        >
          <div className="section-label bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6">
            <Zap className="h-3 w-3" />
            Full Feature Suite
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-950 mb-4 leading-tight">
            16 Powerful Tools.
            <br />
            <span className="gradient-text">One Platform.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Everything a modern Kerala recruitment agency needs —
            no more juggling 10 different apps.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
          {bento.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28, scale: .96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: .5, delay: i * .04, ease: [.22, 1, .36, 1] }}
              whileHover={{ y: -5, transition: { duration: .2 } }}
              className={`bento-card p-5 cursor-default relative overflow-hidden group ${f.col} ${f.row}`}
            >
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-linear-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>

                {/* Text */}
                <h3 className={`font-bold text-gray-900 mb-2 ${f.featured ? "text-lg" : "text-sm"}`}>
                  {f.title}
                </h3>
                <p className={`text-gray-500 leading-relaxed ${f.featured ? "text-sm" : "text-xs"}`}>
                  {f.desc}
                </p>

                {/* Preview */}
                {f.preview}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
