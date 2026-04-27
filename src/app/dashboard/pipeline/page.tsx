"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Users, Loader2, GitBranch, Phone, MapPin, Zap, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STAGES = ["APPLIED", "SHORTLISTED", "CALLED", "INTERVIEW", "OFFER", "JOINED", "REJECTED"] as const;
type Stage = typeof STAGES[number];

const STAGE_META: Record<Stage, { label: string; color: string; bg: string }> = {
  APPLIED:     { label: "Applied",     color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  SHORTLISTED: { label: "Shortlisted", color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
  CALLED:      { label: "Called",      color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20" },
  INTERVIEW:   { label: "Interview",   color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
  OFFER:       { label: "Offer",       color: "text-indigo-400",  bg: "bg-indigo-500/10 border-indigo-500/20" },
  JOINED:      { label: "Joined",      color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  REJECTED:    { label: "Rejected",    color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
};

const RISK_COLOR: Record<string, string> = {
  LOW: "text-emerald-400", MEDIUM: "text-amber-400", HIGH: "text-red-400", CRITICAL: "text-red-500",
};

export default function PipelinePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [activeStage, setActiveStage]   = useState<Stage | "ALL">("ALL");
  const [moving, setMoving]             = useState<string | null>(null);

  const fetchPipeline = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/pipeline");
      const data = await res.json();
      setApplications(data.applications || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPipeline(); }, [fetchPipeline]);

  const moveStage = async (applicationId: string, newStage: Stage) => {
    setMoving(applicationId);
    try {
      const res = await fetch("/api/pipeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, stage: newStage }),
      });
      if (!res.ok) throw new Error("Failed");
      setApplications((prev) =>
        prev.map((a) => a.id === applicationId ? { ...a, stage: newStage } : a)
      );
      toast.success(`Moved to ${STAGE_META[newStage].label}`);
      if (newStage === "JOINED") toast.success("🎉 Placement recorded automatically!");
    } catch {
      toast.error("Failed to update stage");
    } finally {
      setMoving(null);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      !search ||
      a.candidate?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.title?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (activeStage === "ALL" || a.stage === activeStage);
  });

  const stageCounts: Record<string, number> = {};
  STAGES.forEach((s) => { stageCounts[s] = applications.filter((a) => a.stage === s).length; });

  return (
    <div className="space-y-5 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-indigo-400" />
            Recruitment Pipeline
          </h1>
          <p className="text-foreground/40 text-sm mt-0.5">{applications.length} total applications</p>
        </div>
      </motion.div>

      {/* Stage filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveStage("ALL")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeStage === "ALL" ? "bg-indigo-600 text-white" : "bg-white/5 text-foreground/50 hover:bg-white/10"}`}
        >
          All <span className="ml-1 text-xs opacity-70">{applications.length}</span>
        </button>
        {STAGES.map((s) => {
          const meta = STAGE_META[s];
          return (
            <button
              key={s}
              onClick={() => setActiveStage(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeStage === s ? `${meta.bg} ${meta.color} border` : "bg-white/5 text-foreground/50 hover:bg-white/10"}`}
            >
              {meta.label} <span className="ml-1 text-xs opacity-70">{stageCounts[s]}</span>
            </button>
          );
        })}
      </div>

      <Input
        placeholder="Search candidate or job..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
        className="max-w-sm"
      />

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-foreground/30">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{search ? "No applications match" : "No applications in pipeline yet"}</p>
          <p className="text-xs mt-1 text-foreground/20">Add candidates to jobs via AI Matching to see them here</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((app, i) => {
            const meta       = STAGE_META[app.stage as Stage] || STAGE_META.APPLIED;
            const stageIndex = STAGES.indexOf(app.stage as Stage);
            const nextStage  = stageIndex >= 0 && stageIndex < STAGES.length - 2 ? STAGES[stageIndex + 1] : null;
            const prevStage  = stageIndex > 0 ? STAGES[stageIndex - 1] : null;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-white/8 bg-white/2 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-white font-bold">
                  {app.candidate?.name?.charAt(0) || "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <Link
                      href={`/dashboard/candidates/${app.candidate?.id}`}
                      className="font-semibold text-foreground hover:text-indigo-400 transition-colors"
                    >
                      {app.candidate?.name}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    {app.candidate?.riskLevel && app.candidate.riskLevel !== "LOW" && (
                      <span className={`text-xs flex items-center gap-0.5 ${RISK_COLOR[app.candidate.riskLevel]}`}>
                        <AlertTriangle className="h-3 w-3" />{app.candidate.riskLevel}
                      </span>
                    )}
                    {app.aiMatchScore != null && (
                      <span className="text-xs text-indigo-400 flex items-center gap-0.5">
                        <Zap className="h-3 w-3" />{Math.round(app.aiMatchScore)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-foreground/40">
                    {app.candidate?.currentRole && <span>{app.candidate.currentRole} · </span>}
                    <span className="font-medium text-foreground/60">{app.job?.title}</span>
                    {app.job?.company && <span> @ {app.job.company}</span>}
                    {app.candidate?.district && (
                      <span> · <MapPin className="h-3 w-3 inline" /> {app.candidate.district}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {app.candidate?.phone && (
                    <a href={`tel:${app.candidate.phone}`}>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                  {prevStage && (
                    <Button
                      variant="outline" size="sm" className="text-xs h-8"
                      disabled={!!moving} onClick={() => moveStage(app.id, prevStage)}
                    >
                      ← Back
                    </Button>
                  )}
                  {nextStage && (
                    <Button
                      variant="gradient" size="sm" className="text-xs h-8"
                      disabled={!!moving} onClick={() => moveStage(app.id, nextStage)}
                    >
                      {moving === app.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : `${STAGE_META[nextStage].label} →`}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
