"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, Phone, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const RISK_CONFIG = {
  CRITICAL: { color: "text-red-500",    bg: "bg-red-500/10 border-red-500/30",    bar: "bg-red-500" },
  HIGH:     { color: "text-red-400",    bg: "bg-red-500/8 border-red-500/20",     bar: "bg-red-400" },
  MEDIUM:   { color: "text-amber-400",  bg: "bg-amber-500/8 border-amber-500/20", bar: "bg-amber-400" },
  LOW:      { color: "text-emerald-400",bg: "bg-emerald-500/5 border-white/8",    bar: "bg-emerald-500" },
} as const;

export default function BackoutRiskPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");

  const fetchRisk = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/candidates?riskLevel=HIGH,CRITICAL,MEDIUM&status=ACTIVE&limit=50");
      const data = await res.json();
      setCandidates(data.candidates || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRisk(); }, [fetchRisk]);

  const filtered = candidates.filter((c) =>
    filter === "ALL" || c.riskLevel === filter
  );

  const counts = {
    CRITICAL: candidates.filter((c) => c.riskLevel === "CRITICAL").length,
    HIGH:     candidates.filter((c) => c.riskLevel === "HIGH").length,
    MEDIUM:   candidates.filter((c) => c.riskLevel === "MEDIUM").length,
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            Backout Risk Monitor
          </h1>
          <p className="text-foreground/40 text-sm mt-0.5">
            Candidates at risk of not joining after accepting an offer
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRisk}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Summary pills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-4 gap-3">
        {[
          { label: "All At-Risk", value: candidates.length, color: "text-foreground",  action: () => setFilter("ALL") },
          { label: "Critical",    value: counts.CRITICAL,   color: "text-red-500",     action: () => setFilter("CRITICAL") },
          { label: "High",        value: counts.HIGH,        color: "text-red-400",     action: () => setFilter("HIGH") },
          { label: "Medium",      value: counts.MEDIUM,      color: "text-amber-400",   action: () => setFilter("MEDIUM") },
        ].map((s) => (
          <button
            key={s.label}
            onClick={s.action}
            className="rounded-xl border border-white/8 bg-white/2 px-4 py-3 text-left hover:bg-white/4 transition-colors"
          >
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-foreground/40">{s.label}</div>
          </button>
        ))}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-indigo-600 text-white" : "bg-white/5 text-foreground/40 hover:bg-white/10"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-foreground/30">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {filter === "ALL" ? "No at-risk candidates right now" : `No ${filter.toLowerCase()} risk candidates`}
          </p>
          <p className="text-xs mt-1 text-foreground/20">
            Risk levels are set when editing a candidate profile
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => {
            const risk    = (c.riskLevel || "LOW") as keyof typeof RISK_CONFIG;
            const cfg     = RISK_CONFIG[risk] || RISK_CONFIG.LOW;
            const factors = Array.isArray(c.riskFactors)
              ? c.riskFactors
              : (c.riskFactors as any)?.factors || [];

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-2xl border p-5 ${cfg.bg}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-white font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link href={`/dashboard/candidates/${c.id}`} className="font-semibold text-foreground hover:text-indigo-400 transition-colors">
                          {c.name}
                        </Link>
                        <Badge variant={risk === "CRITICAL" || risk === "HIGH" ? "destructive" : "warning"}>
                          {risk} RISK
                        </Badge>
                      </div>
                      <div className="text-xs text-foreground/50 mb-2">
                        {c.currentRole || "Candidate"}
                        {c.expectedSalary ? ` · Expected: ${formatCurrency(c.expectedSalary)}` : ""}
                        {c.district ? ` · ${c.district}` : ""}
                      </div>

                      {/* Risk bar */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: risk === "CRITICAL" ? "90%" : risk === "HIGH" ? "70%" : "45%" }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className={`h-full rounded-full ${cfg.bar}`}
                          />
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${cfg.color}`}>
                          {risk === "CRITICAL" ? "~90%" : risk === "HIGH" ? "~70%" : "~45%"} risk
                        </span>
                      </div>

                      {/* Risk factors */}
                      {factors.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {factors.slice(0, 4).map((f: string, j: number) => (
                            <span key={j} className="text-xs bg-white/5 text-foreground/50 border border-white/8 px-2 py-0.5 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {c.phone && (
                      <a href={`tel:${c.phone}`}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Phone className="h-3 w-3" /> Call
                        </Button>
                      </a>
                    )}
                    <Link href={`/dashboard/candidates/${c.id}`}>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View Profile
                      </Button>
                    </Link>
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
