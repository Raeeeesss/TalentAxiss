"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus, Search, Briefcase, MapPin, Users,
  Clock, Zap, CheckCircle2, Pause, ChevronRight, Loader2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const statusConfig: Record<string, { label: string; variant: string; icon: React.ElementType }> = {
  OPEN: { label: "Open", variant: "success", icon: CheckCircle2 },
  INTERVIEWING: { label: "Interviewing", variant: "info", icon: Users },
  CLOSED: { label: "Closed", variant: "secondary", icon: CheckCircle2 },
  HOLD: { label: "On Hold", variant: "warning", icon: Pause },
  FILLED: { label: "Filled", variant: "purple", icon: CheckCircle2 },
};

const urgencyClass: Record<string, string> = {
  Urgent: "text-red-400 bg-red-500/10 border-red-500/20",
  Normal: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Low: "text-foreground/40 bg-white/5 border-border",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({ open: 0, interviewing: 0, hold: 0, filled: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      const list: any[] = data.jobs || [];
      setJobs(list);
      setStats({
        open: list.filter((j) => j.status === "OPEN").length,
        interviewing: list.filter((j) => j.status === "INTERVIEWING").length,
        hold: list.filter((j) => j.status === "HOLD").length,
        filled: list.filter((j) => j.status === "FILLED").length,
      });
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const filtered = jobs.filter((j) =>
    !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Openings</h1>
          <p className="text-foreground/40 text-sm mt-0.5">Manage and track all recruitment requirements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchJobs}><RefreshCw className="h-4 w-4" /></Button>
          <Link href="/dashboard/jobs/new">
            <Button variant="gradient"><Plus className="h-4 w-4" />Post New Job</Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open Positions", value: stats.open, color: "text-emerald-400" },
          { label: "Interviewing", value: stats.interviewing, color: "text-blue-400" },
          { label: "On Hold", value: stats.hold, color: "text-amber-400" },
          { label: "Filled", value: stats.filled, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 bg-white/2 px-4 py-3">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-foreground/40">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2">
        <Input placeholder="Search jobs, company..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="flex-1" />
      </motion.div>

      {/* Jobs list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-foreground/30">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{search ? "No jobs match your search" : "No jobs posted yet"}</p>
          {!search && (
            <Link href="/dashboard/jobs/new">
              <Button variant="gradient" size="sm" className="mt-4"><Plus className="h-4 w-4" />Post First Job</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((job, i) => {
            const sc = statusConfig[job.status] || statusConfig.OPEN;
            const uc = urgencyClass[job.urgency || "Normal"];
            return (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}
                className="rounded-2xl border border-white/8 bg-white/2 p-5 hover:border-white/15 hover:bg-white/3 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${job.isGulf ? "bg-amber-500/15 border border-amber-500/30" : "bg-indigo-500/15 border border-indigo-500/30"}`}>
                      {job.isGulf ? <span className="text-lg">🌏</span> : <Briefcase className="h-5 w-5 text-indigo-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <Badge variant={sc.variant as any}>{sc.label}</Badge>
                        {job.urgency && <span className={`text-xs px-2 py-0.5 rounded-full border ${uc}`}>{job.urgency}</span>}
                        {job.isGulf && <Badge variant="warning">Gulf 🌙</Badge>}
                      </div>
                      <div className="text-sm text-foreground/50 mb-2">{job.company}</div>
                      <div className="flex flex-wrap gap-3 text-xs text-foreground/40">
                        {job.location && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</div>}
                        {(job.minExperience || job.maxExperience) && (
                          <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.minExperience || 0}–{job.maxExperience || "?"} years</div>
                        )}
                        <div className="flex items-center gap-1"><Users className="h-3 w-3" />{job.vacancies} {job.vacancies === 1 ? "vacancy" : "vacancies"}</div>
                        {(job.minSalary || job.maxSalary) && (
                          <div>{job.minSalary ? formatCurrency(job.minSalary) : "?"} – {job.maxSalary ? formatCurrency(job.maxSalary) : "?"}</div>
                        )}
                      </div>
                      {job.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.skills.slice(0, 5).map((s: string) => (
                            <span key={s} className="text-xs bg-white/5 text-foreground/40 border border-white/8 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                          {job.skills.length > 5 && <span className="text-xs text-foreground/30">+{job.skills.length - 5}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-foreground/30">{job._count?.applications || 0} in pipeline</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/matching?jobId=${job.id}`}>
                        <Button variant="outline" size="sm"><Zap className="h-3.5 w-3.5" />AI Match</Button>
                      </Link>
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        <Button variant="ghost" size="sm">View<ChevronRight className="h-3.5 w-3.5" /></Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
