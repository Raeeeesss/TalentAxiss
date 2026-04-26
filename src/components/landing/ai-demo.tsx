"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, ChevronRight, Star, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockJob = {
  title: "Senior Accountant",
  skills: ["Tally", "GST", "Excel", "MIS Reports"],
  experience: "3-5 years",
  salary: "₹35,000 – ₹45,000",
  location: "Ernakulam",
};

const mockCandidates = [
  {
    name: "Rajan K.",
    role: "Senior Accountant",
    exp: "4 years",
    skills: ["Tally", "GST", "Excel", "MIS Reports", "SAP"],
    location: "Kochi, Ernakulam",
    score: 96,
    tier: "BEST_FIT",
    reasons: ["4yr experience matches", "All required skills", "Same district"],
  },
  {
    name: "Priya M.",
    role: "Accountant",
    exp: "3.5 years",
    skills: ["Tally", "GST", "Excel"],
    location: "Thrissur",
    score: 78,
    tier: "GOOD_FIT",
    reasons: ["3.5yr matches range", "3/4 skills match", "Willing to relocate"],
  },
  {
    name: "Anoop S.",
    role: "Finance Executive",
    exp: "2 years",
    skills: ["Tally", "Excel", "Basic Accounts"],
    location: "Alappuzha",
    score: 52,
    tier: "TRAINABLE_FIT",
    reasons: ["Strong Tally skills", "Quick learner profile"],
  },
];

const tierConfig = {
  BEST_FIT: { label: "Best Fit", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: Award },
  GOOD_FIT: { label: "Good Fit", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: TrendingUp },
  TRAINABLE_FIT: { label: "Trainable", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Star },
};

export function AIDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runDemo = () => {
    setRunning(true);
    setDone(false);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, 2200);
  };

  return (
    <section ref={ref} className="py-24 px-4 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-600/8 blur-[120px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
            <Brain className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">Live AI Demo</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Watch AI Match Candidates
            <br />
            <span className="gradient-text">in Real Time</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Post a job, hit match — AI scans your entire database and ranks the best candidates instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Job Input */}
          <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-sm font-semibold text-white">Job Opening</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                <div className="text-xs text-white/40 mb-1">Position</div>
                <div className="text-white font-semibold">{mockJob.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/4 border border-white/8 rounded-xl p-3">
                  <div className="text-xs text-white/40 mb-1">Experience</div>
                  <div className="text-white text-sm">{mockJob.experience}</div>
                </div>
                <div className="bg-white/4 border border-white/8 rounded-xl p-3">
                  <div className="text-xs text-white/40 mb-1">Location</div>
                  <div className="text-white text-sm">{mockJob.location}</div>
                </div>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-xl p-3">
                <div className="text-xs text-white/40 mb-2">Required Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {mockJob.skills.map((s) => (
                    <span key={s} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-xl p-3">
                <div className="text-xs text-white/40 mb-1">Salary Range</div>
                <div className="text-white text-sm">{mockJob.salary}</div>
              </div>
            </div>
            <Button
              variant="gradient"
              className="w-full mt-5"
              onClick={runDemo}
              loading={running}
            >
              {running ? "AI Scanning 1,247 candidates..." : done ? "Re-run Matching" : "Run AI Matching Engine"}
              {!running && <Brain className="h-4 w-4" />}
            </Button>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold text-white">AI Match Results</span>
              {done && (
                <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Scanned 1,247 candidates
                </span>
              )}
            </div>

            {!done && !running && (
              <div className="flex flex-col items-center justify-center h-64 text-white/20">
                <Brain className="h-12 w-12 mb-3" />
                <p className="text-sm">Click "Run AI Matching Engine" to see results</p>
              </div>
            )}

            {running && (
              <div className="flex flex-col items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 mb-4"
                />
                <div className="text-white/60 text-sm mb-2">Analyzing candidates...</div>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {done && (
                <div className="space-y-3">
                  {mockCandidates.map((c, i) => {
                    const tier = tierConfig[c.tier as keyof typeof tierConfig];
                    return (
                      <motion.div
                        key={c.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-white text-sm">{c.name}</div>
                            <div className="text-xs text-white/40">{c.role} · {c.exp}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-white">{c.score}%</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${tier.bg} ${tier.color}`}>
                              {tier.label}
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                          <motion.div
                            className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${c.score}%` }}
                            transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {c.reasons.map((r) => (
                            <span key={r} className="text-xs text-white/40 bg-white/4 px-2 py-0.5 rounded-full">{r}</span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                  <div className="text-center text-xs text-white/30 mt-2">
                    + 23 more candidates matched
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
