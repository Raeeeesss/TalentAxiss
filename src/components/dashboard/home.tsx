"use client";

import { motion } from "framer-motion";
import {
  Users, Briefcase, Calendar, TrendingUp, Bell,
  AlertTriangle, ArrowRight, Clock, CheckCircle2, Zap
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate, STAGE_COLORS } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface DashboardHomeProps {
  stats: {
    totalCandidates: number;
    activeJobs: number;
    todayInterviews: number;
    monthPlacements: number;
    pendingFollowups: number;
    highRiskCandidates: number;
    recentCandidates: any[];
    recentApplications: any[];
    monthlyChart: { month: string; count: number }[];
  };
  userName: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0f0f1a] border border-border rounded-xl px-3 py-2 text-xs">
        <div className="text-foreground/50 mb-1">{label}</div>
        <div className="font-bold text-foreground">{payload[0].value} placements</div>
      </div>
    );
  }
  return null;
};

export function DashboardHome({ stats, userName }: DashboardHomeProps) {

  const statCards = [
    {
      title: "Total Candidates",
      value: stats.totalCandidates.toLocaleString(),
      change: 12,
      icon: <Users className="h-5 w-5 text-foreground" />,
      gradient: "bg-linear-to-br from-indigo-600 to-purple-600",
      subtitle: "in your database",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      change: 8,
      icon: <Briefcase className="h-5 w-5 text-foreground" />,
      gradient: "bg-linear-to-br from-cyan-600 to-blue-600",
      subtitle: "open positions",
    },
    {
      title: "Today's Interviews",
      value: stats.todayInterviews,
      change: undefined,
      icon: <Calendar className="h-5 w-5 text-foreground" />,
      gradient: "bg-linear-to-br from-amber-500 to-orange-600",
      subtitle: "scheduled today",
    },
    {
      title: "Placements This Month",
      value: stats.monthPlacements,
      change: 15,
      icon: <TrendingUp className="h-5 w-5 text-foreground" />,
      gradient: "bg-linear-to-br from-emerald-500 to-teal-600",
      subtitle: "confirmed",
    },
    {
      title: "Pending Follow-ups",
      value: stats.pendingFollowups,
      change: undefined,
      icon: <Bell className="h-5 w-5 text-foreground" />,
      gradient: "bg-linear-to-br from-rose-500 to-pink-600",
      subtitle: "overdue",
    },
    {
      title: "Backout Risk",
      value: `${stats.highRiskCandidates} High`,
      change: undefined,
      icon: <AlertTriangle className="h-5 w-5 text-foreground" />,
      gradient: "bg-linear-to-br from-red-500 to-orange-600",
      subtitle: "candidates at risk",
    },
  ];

  const quickActions = [
    { label: "Add Candidate", href: "/dashboard/candidates/new", icon: Users, color: "text-indigo-400" },
    { label: "Post Job", href: "/dashboard/jobs/new", icon: Briefcase, color: "text-cyan-400" },
    { label: "Run AI Match", href: "/dashboard/matching", icon: Zap, color: "text-purple-400" },
    { label: "View Follow-ups", href: "/dashboard/followups", icon: Bell, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {userName} 👋
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {quickActions.map((action, i) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/15 transition-all cursor-pointer"
            >
              <action.icon className={`h-5 w-5 ${action.color}`} />
              <span className="text-xs text-foreground/60 font-medium text-center">{action.label}</span>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} delay={0.1 + i * 0.05} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Placements chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Placements Trend</h3>
              <p className="text-xs text-foreground/30 mt-0.5">Last 6 months</p>
            </div>
            <Badge variant="success">↑ 15% this month</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={stats.monthlyChart}>
              <defs>
                <linearGradient id="placementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#placementGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Pipeline Status</h3>
          <div className="space-y-3">
            {[
              { stage: "Applied", count: 47, color: "bg-blue-500" },
              { stage: "Shortlisted", count: 23, color: "bg-purple-500" },
              { stage: "Interview", count: 12, color: "bg-orange-500" },
              { stage: "Offer", count: 8, color: "bg-cyan-500" },
              { stage: "Joined", count: stats.monthPlacements, color: "bg-emerald-500" },
            ].map((s) => (
              <div key={s.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground/50">{s.stage}</span>
                  <span className="text-foreground font-medium">{s.count}</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.count / 50) * 100}%` }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className={`h-full ${s.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent candidates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Candidates</h3>
            <Link href="/dashboard/candidates">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentCandidates.length > 0 ? (
              stats.recentCandidates.map((c: any) => (
                <Link href={`/dashboard/candidates/${c.id}`} key={c.id}>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/4 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-xs font-bold shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                      <div className="text-xs text-foreground/30 truncate">{c.currentRole || "New candidate"}</div>
                    </div>
                    <div className="text-xs text-foreground/20">{formatDate(c.createdAt)}</div>
                  </div>
                </Link>
              ))
            ) : (
              /* Demo rows */
              [
                { name: "Rajan K.", role: "Senior Accountant", time: "1h ago" },
                { name: "Priya M.", role: "HR Executive", time: "3h ago" },
                { name: "Anoop S.", role: "Finance Manager", time: "5h ago" },
                { name: "Reshma T.", role: "Sales Executive", time: "1d ago" },
                { name: "Balu V.", role: "Truck Driver", time: "2d ago" },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/4 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-xs font-bold shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{c.name}</div>
                    <div className="text-xs text-foreground/30">{c.role}</div>
                  </div>
                  <div className="text-xs text-foreground/20">{c.time}</div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Today's tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Today&apos;s Tasks</h3>
            <Link href="/dashboard/followups">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Call Rajan K. — confirm joining date", type: "call", priority: "high", done: false },
              { label: "Send offer letter to Priya M.", type: "offer", priority: "high", done: false },
              { label: "Interview: Anoop S. @ 2PM (Zoom)", type: "interview", priority: "high", done: false },
              { label: "Follow up: Kerala Tiles Co. — 3 openings", type: "followup", priority: "medium", done: true },
              { label: "Review 5 new CVs in queue", type: "cv", priority: "low", done: false },
            ].map((task, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${task.done ? "border-white/4 opacity-40" : "border-white/6 hover:border-border hover:bg-white/2"}`}>
                <button className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${task.done ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-indigo-400"}`}>
                  {task.done && <CheckCircle2 className="h-3 w-3 text-foreground" />}
                </button>
                <span className={`text-sm flex-1 leading-tight ${task.done ? "line-through text-foreground/30" : "text-foreground/70"}`}>
                  {task.label}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border shrink-0 ${task.priority === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" : task.priority === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-foreground/30 border-white/8"}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
