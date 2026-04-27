"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, Briefcase, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";

const floatingStats = [
  { label: "Candidates placed", value: "2,847", icon: Users, color: "from-indigo-500 to-purple-500" },
  { label: "Active agencies", value: "156", icon: Briefcase, color: "from-emerald-500 to-cyan-500" },
  { label: "Placement rate", value: "94%", icon: TrendingUp, color: "from-amber-500 to-orange-500" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />
        <div className="grid-pattern absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-xs text-indigo-300 font-medium">
            AI-Powered Recruitment Platform for Kerala Agencies
          </span>
          <span className="text-xs bg-indigo-500 text-foreground px-2 py-0.5 rounded-full font-semibold">NEW</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
        >
          Transform Your
          <br />
          <span className="gradient-text">Consultancy Into an</span>
          <br />
          AI Recruitment Machine
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Stop losing candidates in WhatsApp and Excel sheets.
          TalentAxiss gives Kerala recruitment agencies a modern AI-powered CRM
          to manage, match, and place candidates at lightning speed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/auth/register">
            <Button variant="gradient" size="xl" className="w-full sm:w-auto group">
              Start Free Trial — 7 Days
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <button className="flex items-center gap-3 text-foreground/60 hover:text-foreground transition-colors">
            <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-white/30 transition-colors bg-white/5">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </div>
            <span className="text-sm font-medium">Watch 2-min Demo</span>
          </button>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {floatingStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-5 py-3"
            >
              <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 text-foreground" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-foreground/40">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/50">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050508] z-10 pointer-events-none" />
            {/* Mock dashboard */}
            <div className="bg-[#0a0a12] p-4">
              {/* Top bar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <div className="flex-1 mx-4 h-6 bg-white/5 rounded-lg" />
              </div>
              {/* Dashboard content mock */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Total Candidates", value: "1,247", color: "from-indigo-500 to-purple-500" },
                  { label: "Active Jobs", value: "34", color: "from-emerald-500 to-cyan-500" },
                  { label: "Placements Today", value: "7", color: "from-amber-500 to-orange-500" },
                  { label: "Follow-ups Due", value: "12", color: "from-rose-500 to-pink-500" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-white/3 border border-white/6 rounded-xl p-3"
                  >
                    <div className={`text-lg font-bold bg-linear-to-r ${s.color} bg-clip-text text-transparent`}>
                      {s.value}
                    </div>
                    <div className="text-xs text-foreground/40 mt-0.5">{s.label}</div>
                  </motion.div>
                ))}
              </div>
              {/* Chart area */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 bg-white/3 border border-white/6 rounded-xl p-3 h-32">
                  <div className="text-xs text-foreground/40 mb-2">Placements This Month</div>
                  <div className="flex items-end gap-1 h-20">
                    {[30, 50, 40, 70, 55, 80, 65, 90, 75, 85, 95, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1 + i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-sm opacity-80"
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-white/3 border border-white/6 rounded-xl p-3 h-32">
                  <div className="text-xs text-foreground/40 mb-2">Top Skills</div>
                  {["React.js", "Sales", "Accounting", "Driving"].map((skill, i) => (
                    <div key={skill} className="flex items-center gap-2 mb-1.5">
                      <div className="text-xs text-foreground/60 w-16 truncate">{skill}</div>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${90 - i * 15}%` }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                          className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
