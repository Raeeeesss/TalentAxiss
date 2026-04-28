"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Brain, Star, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockJob = {
  title:      "Senior Accountant",
  skills:     ["Tally", "GST", "Excel", "MIS Reports"],
  experience: "3-5 years",
  salary:     "₹35,000 – ₹45,000",
  location:   "Ernakulam",
};

const mockCandidates = [
  {
    name:    "Rajan K.",
    role:    "Senior Accountant",
    exp:     "4 years",
    score:   96,
    tier:    "BEST_FIT",
    reasons: ["4yr experience matches", "All required skills", "Same district"],
  },
  {
    name:    "Priya M.",
    role:    "Accountant",
    exp:     "3.5 years",
    score:   78,
    tier:    "GOOD_FIT",
    reasons: ["3.5yr matches range", "3/4 skills match", "Willing to relocate"],
  },
  {
    name:    "Anoop S.",
    role:    "Finance Executive",
    exp:     "2 years",
    score:   52,
    tier:    "TRAINABLE_FIT",
    reasons: ["Strong Tally skills", "Quick learner profile"],
  },
];

const tierConfig = {
  BEST_FIT:      { label: "Best Fit",  bg: "bg-emerald-50 border-emerald-200 text-emerald-700", bar: "from-emerald-400 to-teal-500"    },
  GOOD_FIT:      { label: "Good Fit",  bg: "bg-blue-50 border-blue-200 text-blue-700",          bar: "from-blue-400 to-indigo-500"     },
  TRAINABLE_FIT: { label: "Trainable", bg: "bg-amber-50 border-amber-200 text-amber-700",        bar: "from-amber-400 to-orange-500"    },
};

export function AIDemo() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [running, setRunning] = useState(false);
  const [done,    setDone]    = useState(false);

  const runDemo = () => {
    setRunning(true);
    setDone(false);
    setTimeout(() => { setRunning(false); setDone(true); }, 2200);
  };

  return (
    <section ref={ref} className="py-28 px-4 relative bg-white">
      <div className="absolute top-0 inset-x-0 h-px mesh-divider" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-100/60 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-6">
            <Brain className="h-3.5 w-3.5 text-purple-600" />
            <span className="text-xs text-purple-600 font-semibold">Live AI Demo</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-4">
            Watch AI Match Candidates
            <br />
            <span className="gradient-text">in Real Time</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Post a job, hit match — AI scans your entire database and ranks the best candidates instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Job input card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-sm font-semibold text-gray-900">Job Opening</span>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Position</div>
                <div className="text-gray-900 font-semibold">{mockJob.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Experience</div>
                  <div className="text-gray-800 text-sm">{mockJob.experience}</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Location</div>
                  <div className="text-gray-800 text-sm">{mockJob.location}</div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-2">Required Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {mockJob.skills.map((s) => (
                    <span key={s} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-1">Salary Range</div>
                <div className="text-gray-800 text-sm font-medium">{mockJob.salary}</div>
              </div>
            </div>
            <Button
              className="w-full mt-5 bg-gray-950 hover:bg-gray-800 text-white"
              onClick={runDemo}
              loading={running}
            >
              {running ? "AI Scanning 1,247 candidates…" : done ? "Re-run Matching" : "Run AI Matching Engine"}
              {!running && <Brain className="h-4 w-4" />}
            </Button>
          </div>

          {/* Results card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-gray-900">AI Match Results</span>
              {done && (
                <span className="ml-auto text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  Scanned 1,247 candidates
                </span>
              )}
            </div>

            {!done && !running && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                <Brain className="h-12 w-12 mb-3" />
                <p className="text-sm text-gray-400">Click &ldquo;Run AI Matching Engine&rdquo; to see results</p>
              </div>
            )}

            {running && (
              <div className="flex flex-col items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-2 border-indigo-200 border-t-indigo-600 mb-4"
                />
                <div className="text-gray-500 text-sm mb-3">Analyzing candidates…</div>
                <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
                        whileHover={{ x: 3, transition: { duration: 0.15 } }}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{c.name}</div>
                            <div className="text-xs text-gray-400">{c.role} · {c.exp}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">{c.score}%</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tier.bg}`}>
                              {tier.label}
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <motion.div
                            className={`h-full rounded-full bg-linear-to-r ${tier.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${c.score}%` }}
                            transition={{ delay: i * 0.15 + 0.3, duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {c.reasons.map((r) => (
                            <span key={r} className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                              {r}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                  <div className="text-center text-xs text-gray-400 mt-2">
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
