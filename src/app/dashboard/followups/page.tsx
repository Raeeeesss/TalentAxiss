"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, CheckCircle2, Clock, AlertTriangle,
  Calendar, Phone, Briefcase, Zap, User, X, Save, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FollowUp {
  id: string;
  title: string;
  description?: string;
  type: string;
  priority: string;
  dueDate: string;
  isDone: boolean;
  candidate?: { id: string; name: string } | null;
  job?: { id: string; title: string; company: string } | null;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  INTERVIEW_REMINDER:    { icon: Calendar,      color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  OFFER_PENDING:         { icon: Briefcase,     color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20" },
  JOINING_DATE:          { icon: CheckCircle2,  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  CANDIDATE_UNRESPONSIVE:{ icon: Phone,         color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20" },
  BACKOUT_RISK:          { icon: AlertTriangle, color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
  SUBSCRIPTION_EXPIRY:   { icon: Zap,           color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
  GENERAL:               { icon: Bell,          color: "text-foreground/50",bg: "bg-white/5 border-white/10" },
};

const priorityVariant: Record<string, "destructive" | "warning" | "secondary"> = {
  HIGH: "destructive", MEDIUM: "warning", LOW: "secondary", NORMAL: "secondary",
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<"ALL" | "PENDING" | "OVERDUE" | "DONE">("PENDING");
  const [showAdd, setShowAdd]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [newR, setNewR]           = useState({ title: "", description: "", dueDate: "", type: "GENERAL", priority: "MEDIUM" });

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/followups");
      const data = await res.json();
      setFollowUps(data.followUps || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFollowUps(); }, [fetchFollowUps]);

  const markDone = async (id: string) => {
    try {
      await fetch("/api/followups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDone: true }),
      });
      setFollowUps((prev) => prev.map((f) => f.id === id ? { ...f, isDone: true } : f));
      toast.success("Marked as done!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const addReminder = async () => {
    if (!newR.title || !newR.dueDate) { toast.error("Title and due date are required"); return; }
    setSaving(true);
    try {
      const res  = await fetch("/api/followups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newR),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");
      setFollowUps((prev) => [data.followUp, ...prev]);
      setNewR({ title: "", description: "", dueDate: "", type: "GENERAL", priority: "MEDIUM" });
      setShowAdd(false);
      toast.success("Reminder added!");
    } catch {
      toast.error("Failed to add reminder");
    } finally {
      setSaving(false);
    }
  };

  const now = new Date();
  const isOverdue = (f: FollowUp) => !f.isDone && new Date(f.dueDate) < now;

  const filtered = followUps.filter((f) => {
    if (filter === "PENDING") return !f.isDone;
    if (filter === "OVERDUE") return isOverdue(f);
    if (filter === "DONE")    return f.isDone;
    return true;
  });

  const pendingCnt  = followUps.filter((f) => !f.isDone).length;
  const overdueCnt  = followUps.filter(isOverdue).length;
  const doneCnt     = followUps.filter((f) => f.isDone).length;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-amber-400" />
            Follow-Up Center
          </h1>
          <p className="text-foreground/40 text-sm mt-0.5">Automated reminders so nothing falls through the cracks</p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" />Add Reminder
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending",   value: pendingCnt, color: "text-foreground",  bg: "bg-white/2 border-white/8",           action: () => setFilter("PENDING") },
          { label: "Overdue",   value: overdueCnt, color: "text-red-400",     bg: "bg-red-500/5 border-red-500/20",      action: () => setFilter("OVERDUE") },
          { label: "Completed", value: doneCnt,    color: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/20", action: () => setFilter("DONE") },
        ].map((s) => (
          <button key={s.label} onClick={s.action} className={`rounded-xl border ${s.bg} px-4 py-3 text-left hover:opacity-80 transition-opacity`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-foreground/40">{s.label}</div>
          </button>
        ))}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["ALL", "PENDING", "OVERDUE", "DONE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-indigo-600 text-white" : "bg-white/5 text-foreground/40 hover:bg-white/10"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 text-indigo-400 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((f, i) => {
              const cfg     = typeConfig[f.type] || typeConfig.GENERAL;
              const overdue = isOverdue(f);
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl border p-4 flex items-start gap-4 ${f.isDone ? "opacity-50" : ""} ${overdue && !f.isDone ? "border-red-500/20 bg-red-500/3" : cfg.bg}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg}`}>
                    <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${f.isDone ? "line-through text-foreground/40" : "text-foreground"}`}>
                          {f.title}
                        </span>
                        {overdue && !f.isDone && (
                          <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">OVERDUE</span>
                        )}
                        <Badge variant={priorityVariant[f.priority] || "secondary"}>{f.priority}</Badge>
                      </div>
                    </div>
                    {f.description && <p className="text-xs text-foreground/40 mb-2 leading-relaxed">{f.description}</p>}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/30">
                      {f.candidate && <span className="flex items-center gap-1"><User className="h-3 w-3" />{f.candidate.name}</span>}
                      {f.job       && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{f.job.title}</span>}
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

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16 text-foreground/20">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No follow-ups in this category</p>
            </div>
          )}
        </div>
      )}

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-900/10 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Add Reminder</h3>
                  <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-700 transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Title <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g. Call Rajan to confirm joining" value={newR.title} onChange={(e) => setNewR({ ...newR, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Description</label>
                    <Input placeholder="Additional details..." value={newR.description} onChange={(e) => setNewR({ ...newR, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1.5 block">Due Date <span className="text-red-500">*</span></label>
                      <Input type="datetime-local" value={newR.dueDate} onChange={(e) => setNewR({ ...newR, dueDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1.5 block">Priority</label>
                      <select className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" value={newR.priority} onChange={(e) => setNewR({ ...newR, priority: e.target.value })}>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Type</label>
                    <select className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" value={newR.type} onChange={(e) => setNewR({ ...newR, type: e.target.value })}>
                      <option value="GENERAL">General</option>
                      <option value="INTERVIEW_REMINDER">Interview Reminder</option>
                      <option value="OFFER_PENDING">Offer Pending</option>
                      <option value="JOINING_DATE">Joining Date</option>
                      <option value="CANDIDATE_UNRESPONSIVE">Candidate Unresponsive</option>
                      <option value="BACKOUT_RISK">Backout Risk</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button variant="gradient" className="flex-1" loading={saving} onClick={addReminder}>
                    <Save className="h-4 w-4" />Add Reminder
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
