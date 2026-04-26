"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, CheckCircle2, Clock, AlertTriangle,
  Calendar, Phone, Mail, Briefcase, Filter, ChevronRight,
  Zap, User, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface FollowUp {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate: string;
  candidateName?: string;
  jobTitle?: string;
  isDone: boolean;
  isOverdue: boolean;
}

const mockFollowUps: FollowUp[] = [
  {
    id: "1", title: "Interview Tomorrow: Rajan K. @ 10AM", type: "INTERVIEW_REMINDER",
    description: "Interview scheduled with Kerala Tiles Ltd via Zoom. Link sent to candidate.",
    priority: "HIGH", dueDate: "2025-04-27T10:00:00", candidateName: "Rajan Krishnan",
    jobTitle: "Senior Accountant", isDone: false, isOverdue: false,
  },
  {
    id: "2", title: "Offer Pending: Priya M. — Accept by Friday",
    type: "OFFER_PENDING", description: "Priya was offered ₹38,000. She asked for 3 days to decide. Follow up needed.",
    priority: "HIGH", dueDate: "2025-04-26T18:00:00", candidateName: "Priya Menon",
    jobTitle: "HR Executive", isDone: false, isOverdue: true,
  },
  {
    id: "3", title: "Joining Date: Suresh P. — Confirm this week",
    type: "JOINING_DATE", description: "Suresh accepted the offer for Gulf Transport. Joining date needs to be confirmed with client.",
    priority: "HIGH", dueDate: "2025-04-28", candidateName: "Suresh Pillai",
    jobTitle: "Truck Driver UAE", isDone: false, isOverdue: false,
  },
  {
    id: "4", title: "No Response: Anoop S. for 3 days",
    type: "CANDIDATE_UNRESPONSIVE", description: "Anoop hasn't replied to calls or messages since interview invitation was sent.",
    priority: "MEDIUM", dueDate: "2025-04-26", candidateName: "Anoop Suresh",
    jobTitle: "Civil Engineer", isDone: false, isOverdue: true,
  },
  {
    id: "5", title: "High Backout Risk: Mohammed R.",
    type: "BACKOUT_RISK", description: "Mohammed has 2 other offers and delayed replying for 5 days. Risk score: 82%.",
    priority: "HIGH", dueDate: "2025-04-27", candidateName: "Mohammed Rashid",
    jobTitle: "Civil Engineer", isDone: false, isOverdue: false,
  },
  {
    id: "6", title: "Subscription Expiring in 3 Days",
    type: "SUBSCRIPTION_EXPIRY", description: "Your Pro plan expires on April 30. Renew to avoid service interruption.",
    priority: "MEDIUM", dueDate: "2025-04-30", isDone: false, isOverdue: false,
  },
  {
    id: "7", title: "Follow Up: Kerala Tiles — 3 more vacancies",
    type: "GENERAL", description: "Client mentioned they need 3 more accountants. Need to discuss requirements.",
    priority: "MEDIUM", dueDate: "2025-04-29", jobTitle: "Accountant (x3)", isDone: false, isOverdue: false,
  },
  {
    id: "8", title: "Interview Done: Deepa V. — Send feedback to client",
    type: "INTERVIEW_REMINDER", description: "Interview completed yesterday. Client waiting for shortlist recommendation.",
    priority: "LOW", dueDate: "2025-04-25", candidateName: "Deepa Varma",
    jobTitle: "Sales Manager", isDone: true, isOverdue: false,
  },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  INTERVIEW_REMINDER: { icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  OFFER_PENDING: { icon: Briefcase, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  JOINING_DATE: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  CANDIDATE_UNRESPONSIVE: { icon: Phone, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  BACKOUT_RISK: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  SUBSCRIPTION_EXPIRY: { icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  GENERAL: { icon: Bell, color: "text-white/50", bg: "bg-white/5 border-white/10" },
};

const priorityVariant: Record<string, "destructive" | "warning" | "secondary"> = {
  HIGH: "destructive",
  MEDIUM: "warning",
  LOW: "secondary",
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState(mockFollowUps);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "OVERDUE" | "DONE">("PENDING");

  const markDone = (id: string) => {
    setFollowUps((prev) => prev.map((f) => f.id === id ? { ...f, isDone: true } : f));
    toast.success("Follow-up marked as done!");
  };

  const dismiss = (id: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
    toast.success("Dismissed");
  };

  const filtered = followUps.filter((f) => {
    if (filter === "PENDING") return !f.isDone;
    if (filter === "OVERDUE") return !f.isDone && f.isOverdue;
    if (filter === "DONE") return f.isDone;
    return true;
  });

  const overdueCnt = followUps.filter((f) => !f.isDone && f.isOverdue).length;
  const pendingCnt = followUps.filter((f) => !f.isDone).length;
  const doneCnt = followUps.filter((f) => f.isDone).length;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-amber-400" />
            Follow-Up Center
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Automated reminders so nothing falls through the cracks</p>
        </div>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4" />
          Add Reminder
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Pending", value: pendingCnt, color: "text-white", bg: "bg-white/2 border-white/8", action: () => setFilter("PENDING") },
          { label: "Overdue", value: overdueCnt, color: "text-red-400", bg: "bg-red-500/5 border-red-500/20", action: () => setFilter("OVERDUE") },
          { label: "Completed", value: doneCnt, color: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/20", action: () => setFilter("DONE") },
        ].map((s) => (
          <button
            key={s.label}
            onClick={s.action}
            className={`rounded-xl border ${s.bg} px-4 py-3 text-left hover:opacity-80 transition-opacity`}
          >
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </button>
        ))}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["ALL", "PENDING", "OVERDUE", "DONE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-indigo-600 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Follow-up list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((f, i) => {
            const cfg = typeConfig[f.type] || typeConfig.GENERAL;
            return (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-2xl border p-4 flex items-start gap-4 ${f.isDone ? "opacity-50" : ""} ${f.isOverdue && !f.isDone ? "border-red-500/20 bg-red-500/3" : cfg.bg}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg}`}>
                  <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${f.isDone ? "line-through text-white/40" : "text-white"}`}>
                        {f.title}
                      </span>
                      {f.isOverdue && !f.isDone && (
                        <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
                          OVERDUE
                        </span>
                      )}
                      <Badge variant={priorityVariant[f.priority]}>{f.priority}</Badge>
                    </div>
                    <button
                      onClick={() => dismiss(f.id)}
                      className="text-white/20 hover:text-white/60 transition-colors shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-white/40 mb-2.5 leading-relaxed">{f.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
                    {f.candidateName && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {f.candidateName}
                      </span>
                    )}
                    {f.jobTitle && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {f.jobTitle}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(f.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                {!f.isDone && (
                  <button
                    onClick={() => markDone(f.id)}
                    className="shrink-0 w-8 h-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    title="Mark as done"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/20">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No follow-ups in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
