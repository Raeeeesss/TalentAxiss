"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  GitBranch, Plus, Search, Filter, MoreHorizontal,
  Phone, Mail, MapPin, Clock, AlertTriangle, User, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, STAGE_COLORS } from "@/lib/utils";
import { toast } from "sonner";

const stages = [
  { key: "APPLIED", label: "Applied", color: "border-blue-500/30 bg-blue-500/5" },
  { key: "SHORTLISTED", label: "Shortlisted", color: "border-purple-500/30 bg-purple-500/5" },
  { key: "CALLED", label: "Called", color: "border-yellow-500/30 bg-yellow-500/5" },
  { key: "INTERVIEW", label: "Interview", color: "border-orange-500/30 bg-orange-500/5" },
  { key: "OFFER", label: "Offer", color: "border-cyan-500/30 bg-cyan-500/5" },
  { key: "JOINED", label: "Joined", color: "border-emerald-500/30 bg-emerald-500/5" },
  { key: "REJECTED", label: "Rejected", color: "border-red-500/30 bg-red-500/5" },
];

const stageLabel = (s: string) => STAGE_COLORS[s] || "bg-white/5 text-white/40 border-white/10";

interface PipelineCard {
  id: string;
  candidateName: string;
  jobTitle: string;
  company: string;
  district: string;
  phone: string;
  stage: string;
  aiScore?: number;
  riskLevel: string;
  daysInStage: number;
  nextAction?: string;
}

const mockCards: PipelineCard[] = [
  { id: "1", candidateName: "Rajan Krishnan", jobTitle: "Senior Accountant", company: "Kerala Tiles Ltd", district: "Ernakulam", phone: "9876543210", stage: "OFFER", aiScore: 96, riskLevel: "LOW", daysInStage: 2, nextAction: "Confirm joining date" },
  { id: "2", candidateName: "Priya Menon", jobTitle: "HR Executive", company: "Tech Corp", district: "Thrissur", phone: "9876543211", stage: "INTERVIEW", aiScore: 82, riskLevel: "LOW", daysInStage: 1, nextAction: "Interview @ 2PM today" },
  { id: "3", candidateName: "Mohammed Rashid", jobTitle: "Civil Engineer", company: "Buildex", district: "Malappuram", phone: "9876543212", stage: "SHORTLISTED", aiScore: 78, riskLevel: "MEDIUM", daysInStage: 3, nextAction: "Call to schedule interview" },
  { id: "4", candidateName: "Anjali Nair", jobTitle: "Sales Executive", company: "Reliance", district: "Kozhikode", phone: "9876543213", stage: "CALLED", aiScore: 70, riskLevel: "LOW", daysInStage: 0, nextAction: "Awaiting response" },
  { id: "5", candidateName: "Suresh Pillai", jobTitle: "Truck Driver UAE", company: "Gulf Transport", district: "TVM", phone: "9876543214", stage: "APPLIED", aiScore: 65, riskLevel: "HIGH", daysInStage: 5, nextAction: "Review profile" },
  { id: "6", candidateName: "Nisha Radhakrishnan", jobTitle: "Staff Nurse", company: "Lakeshore Hospital", district: "Kottayam", phone: "9876543215", stage: "JOINED", aiScore: 88, riskLevel: "LOW", daysInStage: 0, nextAction: "Placement complete 🎉" },
  { id: "7", candidateName: "Biju Thomas", jobTitle: "Accountant", company: "ABC Traders", district: "Kannur", phone: "9876543216", stage: "APPLIED", aiScore: 55, riskLevel: "LOW", daysInStage: 2 },
  { id: "8", candidateName: "Deepa Varma", jobTitle: "Sales Manager", company: "FMCG Co", district: "Ernakulam", phone: "9876543217", stage: "INTERVIEW", aiScore: 74, riskLevel: "MEDIUM", daysInStage: 4, nextAction: "Second round pending" },
  { id: "9", candidateName: "Arun Kumar", jobTitle: "IT Support", company: "TechStart", district: "Kochi", phone: "9876543218", stage: "SHORTLISTED", aiScore: 68, riskLevel: "LOW", daysInStage: 1 },
  { id: "10", candidateName: "Simi Mathew", jobTitle: "Accountant", company: "ABC Tiles", district: "Thrissur", phone: "9876543219", stage: "REJECTED", aiScore: 42, riskLevel: "LOW", daysInStage: 0, nextAction: "Skill mismatch" },
];

const riskColors: Record<string, string> = {
  LOW: "bg-emerald-500/20 text-emerald-400",
  MEDIUM: "bg-yellow-500/20 text-yellow-400",
  HIGH: "bg-red-500/20 text-red-400",
  CRITICAL: "bg-red-600/30 text-red-300",
};

function KanbanCard({ card, onMove }: { card: PipelineCard; onMove: (id: string, newStage: string) => void }) {
  const stageIdx = stages.findIndex((s) => s.key === card.stage);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border border-white/8 bg-[#0c0c18] p-3.5 cursor-grab active:cursor-grabbing shadow-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {card.candidateName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-medium text-white leading-tight">{card.candidateName}</div>
            <div className="text-xs text-white/30 leading-tight">{card.jobTitle}</div>
          </div>
        </div>
        <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${riskColors[card.riskLevel]}`}>
          {card.riskLevel === "HIGH" ? "⚠️" : ""} {card.riskLevel}
        </div>
      </div>

      <div className="text-xs text-white/30 mb-2">{card.company}</div>

      <div className="flex items-center gap-2 text-xs text-white/30 mb-2.5">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>{card.district}</span>
        {card.daysInStage > 3 && (
          <span className="ml-auto flex items-center gap-1 text-amber-400">
            <Clock className="h-3 w-3" />
            {card.daysInStage}d
          </span>
        )}
      </div>

      {card.aiScore && (
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${card.aiScore >= 80 ? "bg-emerald-500" : card.aiScore >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
              style={{ width: `${card.aiScore}%` }}
            />
          </div>
          <span className="text-xs text-white/30">{card.aiScore}%</span>
        </div>
      )}

      {card.nextAction && (
        <div className="text-xs text-indigo-400 bg-indigo-500/10 rounded-lg px-2 py-1 mb-2.5">
          → {card.nextAction}
        </div>
      )}

      <div className="flex gap-1.5">
        {stageIdx > 0 && stageIdx < stages.length - 1 && (
          <button
            onClick={() => onMove(card.id, stages[stageIdx - 1].key)}
            className="flex-1 text-xs py-1 rounded-lg bg-white/4 text-white/40 hover:bg-white/8 hover:text-white transition-all"
          >
            ← Back
          </button>
        )}
        {stageIdx < stages.length - 2 && (
          <button
            onClick={() => onMove(card.id, stages[stageIdx + 1].key)}
            className="flex-1 text-xs py-1 rounded-lg bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 transition-all font-medium"
          >
            Move → {stages[stageIdx + 1].label}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function PipelinePage() {
  const [cards, setCards] = useState<PipelineCard[]>(mockCards);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("ALL");

  const moveCard = useCallback((id: string, newStage: string) => {
    setCards((prev) =>
      prev.map((c) => c.id === id ? { ...c, stage: newStage, daysInStage: 0 } : c)
    );
    toast.success(`Moved to ${newStage.replace("_", " ")}`);
  }, []);

  const filteredCards = cards.filter((c) =>
    (!search || c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(search.toLowerCase()))
  );

  const getStageCards = (stageKey: string) =>
    filteredCards.filter((c) => c.stage === stageKey);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-indigo-400" />
            Candidate Pipeline
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{cards.length} candidates across all stages</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="w-56"
          />
          <Button variant="gradient" size="sm">
            <Plus className="h-4 w-4" />
            Add to Pipeline
          </Button>
        </div>
      </motion.div>

      {/* Stage summary pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 flex-wrap"
      >
        {stages.map((stage) => {
          const count = getStageCards(stage.key).length;
          return (
            <div
              key={stage.key}
              className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs", stage.color)}
            >
              <span className="text-white/60">{stage.label}</span>
              <span className="font-bold text-white">{count}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage, si) => {
            const stageCards = getStageCards(stage.key);
            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + si * 0.04 }}
                className="w-64 shrink-0"
              >
                {/* Column header */}
                <div className={cn("rounded-t-xl border-t border-x px-3 py-2.5 flex items-center justify-between", stage.color)}>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", stageLabel(stage.key))}>
                      {stage.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">{stageCards.length}</span>
                </div>

                {/* Cards */}
                <div className={cn("rounded-b-xl border-b border-x px-2.5 py-2.5 min-h-[400px] space-y-2.5", stage.color)}>
                  {stageCards.map((card) => (
                    <KanbanCard key={card.id} card={card} onMove={moveCard} />
                  ))}
                  {stageCards.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs text-white/15 border-2 border-dashed border-white/5 rounded-xl">
                      No candidates
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
