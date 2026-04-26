"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, ShieldAlert, TrendingDown, User,
  Clock, Phone, MessageSquare, ChevronDown, ChevronUp,
  Briefcase, Calendar, BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface RiskCandidate {
  id: string;
  name: string;
  role: string;
  company: string;
  offeredSalary: number;
  expectedSalary: number;
  joiningDate: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  factors: string[];
  daysToJoining: number;
  responseDelay: number;
  multipleOffers: boolean;
  previousBackouts: number;
  lastContact: string;
}

const mockRiskCandidates: RiskCandidate[] = [
  {
    id: "1", name: "Mohammed Rashid", role: "Civil Engineer", company: "Buildex Construction",
    offeredSalary: 55000, expectedSalary: 60000, joiningDate: "2025-05-10",
    riskScore: 82, riskLevel: "CRITICAL",
    factors: ["Salary gap ₹5k below expectation", "2 other offers in hand", "5-day response delay", "Hasn't confirmed verbally"],
    daysToJoining: 14, responseDelay: 5, multipleOffers: true, previousBackouts: 1,
    lastContact: "2025-04-21",
  },
  {
    id: "2", name: "Suresh Pillai", role: "Truck Driver UAE", company: "Gulf Transport LLC",
    offeredSalary: 95000, expectedSalary: 110000, joiningDate: "2025-05-20",
    riskScore: 68, riskLevel: "HIGH",
    factors: ["Salary gap ₹15k below expectation", "Long notice period (45 days)", "Family opposition suspected"],
    daysToJoining: 24, responseDelay: 3, multipleOffers: false, previousBackouts: 0,
    lastContact: "2025-04-23",
  },
  {
    id: "3", name: "Deepa Varma", role: "Sales Manager", company: "FMCG Corp",
    offeredSalary: 50000, expectedSalary: 52000, joiningDate: "2025-05-05",
    riskScore: 45, riskLevel: "MEDIUM",
    factors: ["Slight salary gap", "Hasn't confirmed joining formally"],
    daysToJoining: 9, responseDelay: 1, multipleOffers: false, previousBackouts: 0,
    lastContact: "2025-04-25",
  },
  {
    id: "4", name: "Anjali Nair", role: "Sales Executive", company: "Reliance Retail",
    offeredSalary: 28000, expectedSalary: 28000, joiningDate: "2025-05-01",
    riskScore: 12, riskLevel: "LOW",
    factors: [],
    daysToJoining: 5, responseDelay: 0, multipleOffers: false, previousBackouts: 0,
    lastContact: "2025-04-25",
  },
];

const riskColors = {
  CRITICAL: { text: "text-red-400", bg: "bg-red-500/10 border-red-500/30", meter: "bg-red-500", badge: "destructive" as const },
  HIGH: { text: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", meter: "bg-orange-500", badge: "orange" as const },
  MEDIUM: { text: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", meter: "bg-yellow-500", badge: "warning" as const },
  LOW: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", meter: "bg-emerald-500", badge: "success" as const },
};

function RiskMeter({ score }: { score: number }) {
  const segments = [
    { max: 25, color: "bg-emerald-500", label: "Safe" },
    { max: 50, color: "bg-yellow-500", label: "Watch" },
    { max: 75, color: "bg-orange-500", label: "At Risk" },
    { max: 100, color: "bg-red-500", label: "Critical" },
  ];
  const activeColor = score >= 75 ? "bg-red-500" : score >= 50 ? "bg-orange-500" : score >= 25 ? "bg-yellow-500" : "bg-emerald-500";
  return (
    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${activeColor} rounded-full`}
      />
    </div>
  );
}

export default function BackoutRiskPage() {
  const [expanded, setExpanded] = useState<string | null>("1");

  const critical = mockRiskCandidates.filter((c) => c.riskLevel === "CRITICAL" || c.riskLevel === "HIGH");
  const medium = mockRiskCandidates.filter((c) => c.riskLevel === "MEDIUM");
  const low = mockRiskCandidates.filter((c) => c.riskLevel === "LOW");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Backout Risk Monitor</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">AI identifies candidates likely to back out before joining</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Critical Risk", value: mockRiskCandidates.filter((c) => c.riskLevel === "CRITICAL").length, color: "text-red-400", bg: "border-red-500/20 bg-red-500/5" },
          { label: "High Risk", value: mockRiskCandidates.filter((c) => c.riskLevel === "HIGH").length, color: "text-orange-400", bg: "border-orange-500/20 bg-orange-500/5" },
          { label: "Medium Risk", value: medium.length, color: "text-yellow-400", bg: "border-yellow-500/20 bg-yellow-500/5" },
          { label: "Safe", value: low.length, color: "text-emerald-400", bg: "border-emerald-500/20 bg-emerald-500/5" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.bg} px-4 py-3`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Risk cards */}
      <div className="space-y-4">
        {mockRiskCandidates
          .sort((a, b) => b.riskScore - a.riskScore)
          .map((candidate, i) => {
            const risk = riskColors[candidate.riskLevel];
            const isExpanded = expanded === candidate.id;

            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`rounded-2xl border ${risk.bg} overflow-hidden`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-white">{candidate.name}</span>
                          <Badge variant={risk.badge}>{candidate.riskLevel}</Badge>
                          {candidate.multipleOffers && (
                            <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                              Multiple Offers
                            </span>
                          )}
                          {candidate.previousBackouts > 0 && (
                            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
                              {candidate.previousBackouts} prev. backout
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-white/50">{candidate.role} → {candidate.company}</div>
                        <div className="flex items-center gap-3 text-xs text-white/30 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joining: {new Date(candidate.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{candidate.daysToJoining} days left</span>
                        </div>
                      </div>
                    </div>

                    {/* Risk score */}
                    <div className="text-right shrink-0">
                      <div className={`text-3xl font-bold ${risk.text}`}>{candidate.riskScore}%</div>
                      <div className="text-xs text-white/30">risk score</div>
                    </div>
                  </div>

                  {/* Risk meter */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/30 mb-1.5">
                      <span>Backout Probability</span>
                      <span className={risk.text}>{candidate.riskScore}% risk</span>
                    </div>
                    <RiskMeter score={candidate.riskScore} />
                    <div className="flex justify-between text-xs text-white/20 mt-1">
                      <span>Safe</span>
                      <span>Critical</span>
                    </div>
                  </div>

                  {/* Salary comparison */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                      <div className="text-xs text-white/30 mb-0.5">Offered Salary</div>
                      <div className="font-semibold text-white">{formatCurrency(candidate.offeredSalary)}</div>
                    </div>
                    <div className={`rounded-xl p-3 border ${candidate.offeredSalary < candidate.expectedSalary ? "bg-red-500/8 border-red-500/20" : "bg-emerald-500/8 border-emerald-500/20"}`}>
                      <div className="text-xs text-white/30 mb-0.5">Expected Salary</div>
                      <div className={`font-semibold ${candidate.offeredSalary < candidate.expectedSalary ? "text-red-400" : "text-emerald-400"}`}>
                        {formatCurrency(candidate.expectedSalary)}
                        {candidate.offeredSalary < candidate.expectedSalary && (
                          <span className="text-xs ml-1">(gap: {formatCurrency(candidate.expectedSalary - candidate.offeredSalary)})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="gradient" size="sm">
                      <Phone className="h-3.5 w-3.5" />
                      Call Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Send WhatsApp
                    </Button>
                    <Button variant="outline" size="sm">
                      <Briefcase className="h-3.5 w-3.5" />
                      Negotiate Offer
                    </Button>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : candidate.id)}
                      className="ml-auto flex items-center gap-1 text-xs text-white/30 hover:text-white transition-colors"
                    >
                      {isExpanded ? "Hide" : "Risk factors"}
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Risk factors */}
                {isExpanded && candidate.factors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/8 p-5"
                  >
                    <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                      AI Identified Risk Factors
                    </div>
                    <ul className="space-y-2">
                      {candidate.factors.map((factor, fi) => (
                        <motion.li
                          key={fi}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: fi * 0.05 }}
                          className="flex items-start gap-2 text-sm text-white/60"
                        >
                          <AlertTriangle className={`h-3.5 w-3.5 ${risk.text} shrink-0 mt-0.5`} />
                          {factor}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
