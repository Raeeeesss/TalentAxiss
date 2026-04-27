"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Upload, Search, GitBranch, Bell, AlertOctagon, FileText,
  Users, Globe, MapPin, BarChart, Download, Phone,
  FilePlus, Star, Layers, Mail
} from "lucide-react";

const features = [
  { icon: Upload, title: "Bulk CV Upload", desc: "PDF, DOCX, images — upload 100s at once", color: "text-indigo-400" },
  { icon: Search, title: "Instant Search", desc: "Find any candidate by skill, location, salary in 0.1s", color: "text-purple-400" },
  { icon: GitBranch, title: "Kanban Pipeline", desc: "Drag-drop candidate tracking across 7 stages", color: "text-cyan-400" },
  { icon: Bell, title: "Smart Reminders", desc: "Auto follow-up for interviews, offers, joinings", color: "text-emerald-400" },
  { icon: AlertOctagon, title: "Backout Risk Score", desc: "Predict candidate dropout before it happens", color: "text-rose-400" },
  { icon: FileText, title: "PDF Profile Export", desc: "Branded candidate profiles to send clients", color: "text-amber-400" },
  { icon: Users, title: "Team Management", desc: "Multiple recruiters with role-based permissions", color: "text-blue-400" },
  { icon: Globe, title: "Gulf Recruitment Mode", desc: "Passport, visa tracking for Gulf placements", color: "text-teal-400" },
  { icon: MapPin, title: "Kerala Districts Filter", desc: "Find candidates by exact Kerala location", color: "text-pink-400" },
  { icon: BarChart, title: "Revenue Analytics", desc: "Track placements, fees, and team ROI", color: "text-orange-400" },
  { icon: Download, title: "CSV Import", desc: "Import your old Excel database instantly", color: "text-lime-400" },
  { icon: Phone, title: "WhatsApp Import", desc: "Import leads directly from WhatsApp chats", color: "text-green-400" },
  { icon: FilePlus, title: "Invoice Generator", desc: "Create professional placement invoices", color: "text-violet-400" },
  { icon: Star, title: "AI Matching Engine", desc: "Rank 500+ candidates for any job in seconds", color: "text-yellow-400" },
  { icon: Layers, title: "Duplicate Detector", desc: "Auto-merge duplicate candidate profiles", color: "text-red-400" },
  { icon: Mail, title: "Email Automation", desc: "Auto-send interview invites and updates", color: "text-sky-400" },
];

export function FeaturesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-linear-to-b from-[#050508] via-[#08080f] to-[#050508]" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs text-indigo-400 font-medium">Full Feature Suite</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            16 Powerful Tools in
            <br />
            <span className="gradient-text">One Platform</span>
          </h2>
          <p className="text-foreground/50 text-lg max-w-xl mx-auto">
            Everything a modern recruitment agency needs — no more juggling 10 different apps.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-white/6 bg-white/2 p-5 group cursor-default hover:border-white/12 hover:bg-white/4 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 ${f.color} group-hover:scale-110 transition-transform`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-foreground/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
