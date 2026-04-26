"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, Briefcase, DollarSign,
  Award, Calendar, Download, Filter, ArrowUp, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const monthlyData = [
  { month: "Nov", placements: 18, candidates: 45, revenue: 270000 },
  { month: "Dec", placements: 22, candidates: 58, revenue: 330000 },
  { month: "Jan", placements: 19, candidates: 42, revenue: 285000 },
  { month: "Feb", placements: 26, candidates: 65, revenue: 390000 },
  { month: "Mar", placements: 24, candidates: 60, revenue: 360000 },
  { month: "Apr", placements: 28, candidates: 72, revenue: 420000 },
];

const categoryData = [
  { name: "Accounting", value: 32, color: "#6366f1" },
  { name: "Engineering", value: 22, color: "#8b5cf6" },
  { name: "Healthcare", value: 18, color: "#06b6d4" },
  { name: "Gulf", value: 15, color: "#f59e0b" },
  { name: "Sales", value: 8, color: "#10b981" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const staffData = [
  { name: "Rajan (You)", placements: 12, candidates: 28, calls: 145 },
  { name: "Priya", placements: 8, candidates: 22, calls: 98 },
  { name: "Anoop", placements: 5, candidates: 15, calls: 67 },
  { name: "Sneha", placements: 3, candidates: 7, calls: 34 },
];

const dropoutData = [
  { stage: "Applied→Short", rate: 55 },
  { stage: "Short→Called", rate: 72 },
  { stage: "Called→Interview", rate: 68 },
  { stage: "Interview→Offer", rate: 82 },
  { stage: "Offer→Joined", rate: 91 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0f0f1a] border border-white/10 rounded-xl px-3 py-2.5 text-xs shadow-xl">
        <div className="text-white/50 mb-2 font-medium">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex justify-between gap-4 mb-1">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-bold text-white">
              {p.dataKey === "revenue" ? formatCurrency(p.value) : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-400" />
            Analytics & Reports
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Full visibility into your agency's performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 border border-white/8 rounded-xl p-1">
            {(["7d", "30d", "90d", "1y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? "bg-indigo-600 text-white" : "text-white/40 hover:text-white"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Placements", value: "137", change: 15, icon: <Award className="h-5 w-5 text-white" />, gradient: "bg-linear-to-br from-indigo-600 to-purple-600", subtitle: "this year" },
          { title: "Total Revenue", value: "₹20.55L", change: 22, icon: <DollarSign className="h-5 w-5 text-white" />, gradient: "bg-linear-to-br from-emerald-600 to-teal-600", subtitle: "placement fees" },
          { title: "Avg Placement Time", value: "8.3 days", change: -12, icon: <Calendar className="h-5 w-5 text-white" />, gradient: "bg-linear-to-br from-amber-500 to-orange-600", subtitle: "per placement" },
          { title: "Success Rate", value: "94%", change: 3, icon: <TrendingUp className="h-5 w-5 text-white" />, gradient: "bg-linear-to-br from-cyan-600 to-blue-600", subtitle: "offer-to-joining" },
        ].map((s, i) => (
          <StatCard key={s.title} {...s} delay={i * 0.05} />
        ))}
      </div>

      {/* Main charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Placement trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white">Placements & Revenue</h3>
              <p className="text-xs text-white/30 mt-0.5">Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="placGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="left" type="monotone" dataKey="placements" stroke="#6366f1" strokeWidth={2} fill="url(#placGrad)" name="Placements" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <h3 className="font-semibold text-white mb-4">Placements by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" innerRadius={45} outerRadius={70} strokeWidth={0}>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-white/50">{c.name}</span>
                </div>
                <span className="text-white font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Staff performance + Dropout funnel */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Staff leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Team Performance</h3>
            <span className="text-xs text-white/30">This month</span>
          </div>
          <div className="space-y-4">
            {staffData.map((s, i) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${i === 0 ? "bg-amber-500" : "bg-white/10"}`}>
                      {i + 1}
                    </div>
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span>{s.candidates} candidates</span>
                    <span className="text-indigo-400 font-bold">{s.placements} placed</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.placements / 12) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full ${i === 0 ? "bg-linear-to-r from-amber-500 to-orange-500" : "bg-linear-to-r from-indigo-500 to-purple-500"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pipeline conversion funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/8 bg-white/2 p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Pipeline Conversion</h3>
            <span className="text-xs text-white/30">Stage → Stage success rate</span>
          </div>
          <div className="space-y-3">
            {dropoutData.map((d, i) => (
              <div key={d.stage}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50">{d.stage}</span>
                  <span className={`font-semibold ${d.rate >= 80 ? "text-emerald-400" : d.rate >= 60 ? "text-blue-400" : "text-amber-400"}`}>
                    {d.rate}%
                  </span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.rate}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full ${d.rate >= 80 ? "bg-emerald-500" : d.rate >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <div className="text-xs text-amber-400 font-medium mb-1">⚡ AI Insight</div>
            <p className="text-xs text-white/50">Your Called→Interview conversion (68%) is below industry average (75%). Consider stronger pre-screening calls to improve this stage.</p>
          </div>
        </motion.div>
      </div>

      {/* Candidates added per month */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/8 bg-white/2 p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">New Candidates Added</h3>
          <span className="text-xs text-white/30">Monthly database growth</span>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="candidates" fill="#6366f1" radius={[6, 6, 0, 0]} name="New Candidates" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
