"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Briefcase, DollarSign, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const Tooltip_ = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl px-3 py-2 text-xs">
      <div className="text-foreground/50 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  ) : null;

const PERIODS = ["7d", "30d", "90d", "1y"] as const;

export default function ReportsPage() {
  const [stats, setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<typeof PERIODS[number]>("30d");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/stats?period=${period}`);
      const data = await res.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const s = stats || {};
  const months     = s.months     || [];
  const categoryData = s.categoryData || [];
  const funnel     = s.funnel     || [];
  const staffData  = s.staffData  || [];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            Analytics & Reports
          </h1>
          <p className="text-foreground/40 text-sm mt-0.5">Real-time performance insights for your agency</p>
        </div>
        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? "bg-indigo-600 text-white" : "bg-white/5 text-foreground/50 hover:bg-white/10"}`}
            >
              {p}
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={fetchStats}><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Placements",  value: s.totalPlacements ?? 0,                                    icon: TrendingUp,  color: "text-emerald-400", sub: `${s.periodPlacements ?? 0} this period` },
          { label: "Total Candidates",  value: (s.totalCandidates ?? 0).toLocaleString(),                 icon: Users,       color: "text-indigo-400",  sub: `${s.periodCandidates ?? 0} added this period` },
          { label: "Total Revenue",     value: s.totalRevenue ? `₹${(s.totalRevenue/100000).toFixed(1)}L` : "₹0", icon: DollarSign, color: "text-amber-400",   sub: `₹${((s.periodRevenue ?? 0)/100000).toFixed(1)}L this period` },
          { label: "Success Rate",      value: `${s.successRate ?? 0}%`,                                  icon: Briefcase,   color: "text-purple-400",  sub: "Applications → Joined" },
        ].map((card, i) => (
          <div key={card.label} className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-foreground/40">{card.label}</span>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-xs text-foreground/30 mt-1">{card.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Placement trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 rounded-2xl border border-white/8 bg-white/2 p-5">
          <h3 className="font-semibold text-foreground mb-1">Placement Trend</h3>
          <p className="text-xs text-foreground/30 mb-4">Last 6 months</p>
          {months.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={months}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tooltip_ />} />
                <Area type="monotone" dataKey="placements" name="Placements" stroke="#6366f1" strokeWidth={2} fill="url(#pg)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-44 text-foreground/30 text-sm">No placement data yet</div>
          )}
        </motion.div>

        {/* Category breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <h3 className="font-semibold text-foreground mb-4">By Category</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} strokeWidth={0}>
                    {categoryData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<Tooltip_ />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {categoryData.slice(0, 5).map((d: any, i: number) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-foreground/60 truncate max-w-24">{d.name}</span>
                    </div>
                    <span className="text-foreground font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-44 text-foreground/30 text-sm">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Pipeline funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <h3 className="font-semibold text-foreground mb-4">Pipeline Funnel</h3>
          {funnel.some((f: any) => f.count > 0) ? (
            <div className="space-y-3">
              {funnel.map((f: any, i: number) => {
                const max = Math.max(...funnel.map((x: any) => x.count), 1);
                return (
                  <div key={f.stage}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground/50">{f.stage.charAt(0) + f.stage.slice(1).toLowerCase()}</span>
                      <span className="text-foreground font-medium">{f.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(f.count / max) * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-36 text-foreground/30 text-sm">No applications yet</div>
          )}
        </motion.div>

        {/* Staff performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <h3 className="font-semibold text-foreground mb-4">Recruiter Performance</h3>
          {staffData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={staffData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<Tooltip_ />} />
                <Bar dataKey="placements" name="Placements" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-36 text-foreground/30 text-sm">No placement data yet</div>
          )}
        </motion.div>
      </div>

      {/* Candidates added trend */}
      {months.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <h3 className="font-semibold text-foreground mb-1">New Candidates Added</h3>
          <p className="text-xs text-foreground/30 mb-4">Last 6 months</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tooltip_ />} />
              <Bar dataKey="candidates" name="Candidates" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
