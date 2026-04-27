"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Brain, Zap, Award, TrendingUp, Star,
  MapPin, DollarSign, CheckCircle2,
  AlertTriangle, ChevronDown, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const mockJobs = [
  { id: "1", title: "Senior Accountant", company: "Kerala Tiles Ltd", skills: ["Tally", "GST", "Excel"], minExperience: 3, maxSalary: 45000 },
  { id: "2", title: "Civil Engineer", company: "Buildex Construction", skills: ["AutoCAD", "Site Management"], minExperience: 4, maxSalary: 60000 },
  { id: "3", title: "Heavy Truck Driver – UAE", company: "Gulf Transport LLC", skills: ["HMV License", "Gulf Driving"], minExperience: 5, maxSalary: 120000 },
];

const mockMatches = [
  { id: "1", name: "Rajan Krishnan", role: "Senior Accountant", experience: 4, skills: ["Tally Prime", "GST Filing", "Excel", "SAP FI"], district: "Ernakulam", expectedSalary: 45000, score: 96, tier: "BEST_FIT", riskLevel: "LOW", reasons: ["4yr exp matches 3-5yr requirement", "All 3 required skills present", "Same district, no relocation needed", "Salary within budget"], gaps: [] },
  { id: "2", name: "Priya Radhakrishnan", role: "Accountant", experience: 3.5, skills: ["Tally", "GST", "Excel"], district: "Thrissur", expectedSalary: 38000, score: 82, tier: "GOOD_FIT", riskLevel: "LOW", reasons: ["3.5yr matches range", "All required skills match", "Salary under budget"], gaps: ["No SAP experience", "Different district"] },
  { id: "3", name: "Anoop Suresh", role: "Finance Executive", experience: 2, skills: ["Tally", "Excel", "Basic Accounts"], district: "Kottayam", expectedSalary: 32000, score: 61, tier: "TRAINABLE_FIT", riskLevel: "MEDIUM", reasons: ["Strong Tally skills", "Willing to learn GST"], gaps: ["2yr exp (below 3yr minimum)", "No GST filing experience"] },
  { id: "4", name: "Meena Krishnakumar", role: "Accounts Manager", experience: 6, skills: ["Tally Prime", "GST", "Excel", "MIS Reports"], district: "Ernakulam", expectedSalary: 55000, score: 78, tier: "GOOD_FIT", riskLevel: "LOW", reasons: ["Strong skill match", "Overqualified — negotiable"], gaps: ["Expected salary ₹10k above budget"] },
];

const tierConfig = {
  BEST_FIT: { label: "Best Fit", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", glow: "shadow-emerald-500/10", badge: "success" as const },
  GOOD_FIT: { label: "Good Fit", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", glow: "shadow-blue-500/10", badge: "info" as const },
  TRAINABLE_FIT: { label: "Trainable", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", glow: "shadow-amber-500/10", badge: "warning" as const },
};

export function AIMatchingClient() {
  const searchParams = useSearchParams();
  const preselectedJob = searchParams.get("jobId");
  const [selectedJob, setSelectedJob] = useState(preselectedJob || "1");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState("ALL");

  const job = mockJobs.find((j) => j.id === selectedJob) || mockJobs[0];

  const runMatching = async () => {
    setRunning(true); setDone(false); setProgress(0);
    for (let i = 0; i <= 100; i += 4) {
      await new Promise((r) => setTimeout(r, 50));
      setProgress(i);
    }
    setRunning(false); setDone(true);
    toast.success("AI matched 1,247 candidates in 2.3 seconds!");
  };

  const filteredMatches = tierFilter === "ALL" ? mockMatches : mockMatches.filter((m) => m.tier === tierFilter);
  const tierCounts = { BEST_FIT: mockMatches.filter((m) => m.tier === "BEST_FIT").length, GOOD_FIT: mockMatches.filter((m) => m.tier === "GOOD_FIT").length, TRAINABLE_FIT: mockMatches.filter((m) => m.tier === "TRAINABLE_FIT").length };

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Brain className="h-4 w-4 text-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Matching Engine</h1>
        </div>
        <p className="text-foreground/40 text-sm ml-11">Rank your entire candidate database for any job in seconds</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Job selector */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <h3 className="font-semibold text-foreground mb-4">Select Job Opening</h3>
            <div className="space-y-2">
              {mockJobs.map((j) => (
                <button key={j.id} type="button" onClick={() => { setSelectedJob(j.id); setDone(false); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedJob === j.id ? "border-indigo-500/40 bg-indigo-500/10" : "border-white/6 hover:border-white/12 hover:bg-white/3"}`}>
                  <div className="font-medium text-sm text-foreground">{j.title}</div>
                  <div className="text-xs text-foreground/40 mt-0.5">{j.company}</div>
                  <div className="flex flex-wrap gap-1 mt-2">{j.skills.map((s) => <span key={s} className="text-xs bg-white/5 text-foreground/30 px-2 py-0.5 rounded-full">{s}</span>)}</div>
                </button>
              ))}
            </div>
          </div>

          {job && (
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
              <h3 className="font-semibold text-foreground mb-3">Match Criteria</h3>
              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-sm"><span className="text-foreground/50">Position</span><span className="text-foreground font-medium">{job.title}</span></div>
                <div className="flex justify-between text-sm"><span className="text-foreground/50">Min Experience</span><span className="text-foreground">{job.minExperience}+ years</span></div>
                <div className="flex justify-between text-sm"><span className="text-foreground/50">Max Salary</span><span className="text-foreground">{formatCurrency(job.maxSalary)}</span></div>
                <div><span className="text-foreground/50 text-sm">Skills</span><div className="flex flex-wrap gap-1.5 mt-1.5">{job.skills.map((s) => <span key={s} className="text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">{s}</span>)}</div></div>
              </div>
              <Button variant="gradient" className="w-full" onClick={runMatching} loading={running} size="lg">
                {running ? "Scanning 1,247 candidates..." : done ? "Re-run Matching" : "Run AI Matching"}
                {!running && <Brain className="h-4 w-4" />}
              </Button>
              {running && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-foreground/40 mb-1"><span>Analyzing profiles...</span><span>{progress}%</span></div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
                <div className="text-xs text-foreground/40 mb-3">Match Summary</div>
                <div className="space-y-2">
                  {Object.entries(tierCounts).map(([tier, count]) => {
                    const cfg = tierConfig[tier as keyof typeof tierConfig];
                    return (
                      <div key={tier} className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><cfg.icon className={`h-3.5 w-3.5 ${cfg.color}`} /><span className="text-sm text-foreground/60">{cfg.label}</span></div>
                        <span className={`text-sm font-bold ${cfg.color}`}>{count}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-white/6 pt-2 flex justify-between text-sm"><span className="text-foreground/40">Total scanned</span><span className="text-foreground font-medium">1,247</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="lg:col-span-3">
          {!done && !running && (
            <div className="rounded-2xl border border-white/8 bg-white/2 h-96 flex flex-col items-center justify-center text-center p-8">
              <Brain className="h-14 w-14 text-foreground/10 mb-4" />
              <h3 className="text-lg font-semibold text-foreground/30 mb-2">AI Matching Ready</h3>
              <p className="text-sm text-foreground/20 max-w-xs">Select a job and click Run AI Matching to rank all candidates instantly.</p>
            </div>
          )}
          {running && (
            <div className="rounded-2xl border border-white/8 bg-white/2 h-96 flex flex-col items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-14 h-14 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 mb-5" />
              <div className="text-foreground/60 font-medium mb-1">AI is analyzing...</div>
              <div className="text-foreground/30 text-sm">Checking skills, experience, location, salary fit</div>
            </div>
          )}
          <AnimatePresence>
            {done && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {[{ key: "ALL", label: "All", count: mockMatches.length }, { key: "BEST_FIT", label: "Best Fit", count: tierCounts.BEST_FIT }, { key: "GOOD_FIT", label: "Good Fit", count: tierCounts.GOOD_FIT }, { key: "TRAINABLE_FIT", label: "Trainable", count: tierCounts.TRAINABLE_FIT }].map((t) => (
                    <button key={t.key} onClick={() => setTierFilter(t.key)} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${tierFilter === t.key ? "bg-indigo-600 text-foreground" : "bg-white/5 text-foreground/50 hover:bg-white/10"}`}>
                      {t.label} ({t.count})
                    </button>
                  ))}
                </div>
                {filteredMatches.map((match, i) => {
                  const tier = tierConfig[match.tier as keyof typeof tierConfig];
                  const isExpanded = expandedCard === match.id;
                  return (
                    <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`rounded-2xl border ${tier.bg} p-5 shadow-lg`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tier.bg} shrink-0`}><tier.icon className={`h-5 w-5 ${tier.color}`} /></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold text-foreground">{match.name}</span>
                              <Badge variant={tier.badge}>{tier.label}</Badge>
                            </div>
                            <div className="text-sm text-foreground/50">{match.role} · {match.experience}y exp</div>
                            <div className="flex flex-wrap gap-3 text-xs text-foreground/40 mt-1.5">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{match.district}</span>
                              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatCurrency(match.expectedSalary)}/mo</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">{match.skills.map((s) => <span key={s} className="text-xs bg-white/5 text-foreground/40 px-2 py-0.5 rounded-full">{s}</span>)}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-3xl font-bold ${tier.color}`}>{match.score}%</div>
                          <div className="text-xs text-foreground/30">match score</div>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5 ml-auto">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${match.score}%` }} transition={{ delay: i * 0.07 + 0.3, duration: 0.8 }} className={`h-full rounded-full ${match.tier === "BEST_FIT" ? "bg-emerald-500" : match.tier === "GOOD_FIT" ? "bg-blue-500" : "bg-amber-500"}`} />
                          </div>
                        </div>
                      </div>
                      <button className="w-full flex items-center justify-center gap-1.5 mt-3 text-xs text-foreground/30 hover:text-foreground/50 transition-colors" onClick={() => setExpandedCard(isExpanded ? null : match.id)}>
                        {isExpanded ? "Hide details" : "Show AI analysis"}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="pt-4 grid sm:grid-cols-2 gap-4 border-t border-white/8 mt-3">
                              <div>
                                <div className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Why they match</div>
                                <ul className="space-y-1">{match.reasons.map((r) => <li key={r} className="text-xs text-foreground/50 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">✓</span> {r}</li>)}</ul>
                              </div>
                              {match.gaps.length > 0 && (
                                <div>
                                  <div className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" />Gaps</div>
                                  <ul className="space-y-1">{match.gaps.map((g) => <li key={g} className="text-xs text-foreground/50 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">!</span> {g}</li>)}</ul>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="gradient" size="sm">Shortlist & Schedule Interview</Button>
                              <Button variant="outline" size="sm">View Full Profile</Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
