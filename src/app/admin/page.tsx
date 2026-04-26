"use client";

import { motion } from "framer-motion";
import {
  Building2, Users, CreditCard, Brain, TrendingUp, AlertTriangle,
  CheckCircle2, DollarSign, Zap, Activity, ArrowRight,
  ShieldAlert, BarChart3
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const revenueData = [
  { month: "Nov", mrr: 156000, agencies: 112 },
  { month: "Dec", mrr: 189000, agencies: 124 },
  { month: "Jan", mrr: 210000, agencies: 131 },
  { month: "Feb", mrr: 258000, agencies: 140 },
  { month: "Mar", mrr: 294000, agencies: 149 },
  { month: "Apr", mrr: 327000, agencies: 156 },
];

const recentAgencies = [
  { id: "1", name: "Kochi Job Services", owner: "Anoop Menon", plan: "PRO", status: "ACTIVE", candidates: 342, district: "Ernakulam", joined: "Apr 22" },
  { id: "2", name: "Gulf Connect Kerala", owner: "Fathima R.", plan: "MAX", status: "ACTIVE", candidates: 891, district: "Malappuram", joined: "Apr 21" },
  { id: "3", name: "Thrissur Placements", owner: "Biju K.", plan: "FREE", status: "ACTIVE", candidates: 45, district: "Thrissur", joined: "Apr 20" },
  { id: "4", name: "AM Consultants", owner: "Arun Menon", plan: "PRO", status: "ACTIVE", candidates: 567, district: "Kochi", joined: "Apr 19" },
  { id: "5", name: "Career Bridge", owner: "Sneha P.", plan: "FREE", status: "SUSPENDED", candidates: 12, district: "Kannur", joined: "Apr 15" },
];

const planColors = {
  FREE: "secondary",
  PRO: "default",
  MAX: "warning",
} as const;

const statusColors = {
  ACTIVE: "success",
  SUSPENDED: "destructive",
  EXPIRED: "orange",
} as const;

const kpis = [
  { label: "Total Agencies", value: "156", change: "+8 this month", icon: Building2, color: "from-indigo-500 to-purple-600" },
  { label: "Monthly Revenue", value: "₹3.27L", change: "+11.2% MoM", icon: DollarSign, color: "from-emerald-500 to-teal-600" },
  { label: "Active Users", value: "423", change: "+27 this week", icon: Users, color: "from-cyan-500 to-blue-600" },
  { label: "AI Parses Today", value: "847", change: "1,247 total CVs", icon: Brain, color: "from-purple-500 to-pink-600" },
  { label: "Pro Subscribers", value: "89", change: "57% conversion", icon: CreditCard, color: "from-amber-500 to-orange-600" },
  { label: "Suspensions", value: "3", change: "Needs review", icon: ShieldAlert, color: "from-red-500 to-rose-600" },
];

export default function AdminPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-white/30 text-sm mt-0.5">Real-time platform overview · {new Date().toLocaleString("en-IN")}</p>
      </motion.div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-amber-500/10 bg-white/2 p-5 relative overflow-hidden"
          >
            <div className={`absolute inset-0 opacity-5 bg-linear-to-br ${kpi.color}`} />
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${kpi.color} flex items-center justify-center mb-3`}>
                <kpi.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="text-sm text-white/40 mt-0.5">{kpi.label}</div>
              <div className="text-xs text-white/25 mt-1">{kpi.change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-amber-500/10 bg-white/2 p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-white">MRR Growth</h3>
            <p className="text-xs text-white/30 mt-0.5">Monthly Recurring Revenue</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-emerald-400">+11.2% MoM</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, color: "#fff", fontSize: 12 }}
              formatter={(value: any, name: string) => [name === "mrr" ? formatCurrency(value) : value, name === "mrr" ? "MRR" : "Agencies"]}
            />
            <Area type="monotone" dataKey="mrr" stroke="#f59e0b" strokeWidth={2} fill="url(#mrrGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent agencies + quick actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Agencies table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-2xl border border-amber-500/10 bg-white/2 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Recent Agencies</h3>
            <Link href="/admin/agencies">
              <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-white/4">
            {recentAgencies.map((agency) => (
              <div key={agency.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors">
                <div>
                  <div className="text-sm font-medium text-white">{agency.name}</div>
                  <div className="text-xs text-white/30">{agency.owner} · {agency.district}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={planColors[agency.plan as keyof typeof planColors]}>{agency.plan}</Badge>
                  <Badge variant={statusColors[agency.status as keyof typeof statusColors]}>{agency.status}</Badge>
                  <span className="text-xs text-white/20 w-12 text-right">{agency.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="rounded-2xl border border-amber-500/10 bg-white/2 p-5">
            <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Broadcast Notification", href: "/admin/notifications", color: "text-amber-400" },
                { label: "Review Support Tickets", href: "/admin/support", color: "text-blue-400" },
                { label: "Approve Manual Payments", href: "/admin/payments", color: "text-emerald-400" },
                { label: "Review Suspended Agencies", href: "/admin/agencies?filter=suspended", color: "text-red-400" },
                { label: "Export Platform Report", href: "#", color: "text-purple-400" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className={`flex items-center justify-between p-3 rounded-xl border border-white/6 hover:border-white/12 hover:bg-white/2 transition-all cursor-pointer`}>
                    <span className={`text-sm ${action.color}`}>{action.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/20" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/15 bg-red-500/3 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Needs Attention</span>
            </div>
            <div className="space-y-2 text-xs text-white/50">
              <div>• 3 agencies with expiring subscriptions</div>
              <div>• 2 support tickets unresolved ({">"} 24h)</div>
              <div>• 1 agency flagged for suspicious activity</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
