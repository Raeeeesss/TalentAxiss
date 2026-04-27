"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Search, Filter, Users, Database,
  CheckCircle2, XCircle, AlertTriangle, MoreHorizontal,
  Eye, Ban, RefreshCcw, ChevronLeft, ChevronRight, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const mockAgencies = [
  { id: "1", name: "Kochi Job Services", slug: "kochi-job-services", owner: "Anoop Menon", email: "anoop@kjs.in", phone: "9876543210", district: "Ernakulam", plan: "PRO", status: "ACTIVE", candidates: 342, placements: 28, isVerified: true, createdAt: "2024-01-15", lastActive: "2025-04-26" },
  { id: "2", name: "Gulf Connect Kerala", slug: "gulf-connect", owner: "Fathima Rashid", email: "fathima@gck.in", phone: "9876543211", district: "Malappuram", plan: "MAX", status: "ACTIVE", candidates: 891, placements: 76, isVerified: true, createdAt: "2024-02-20", lastActive: "2025-04-26" },
  { id: "3", name: "Thrissur Placements", slug: "thrissur-placements", owner: "Biju Kumar", email: "biju@tp.in", phone: "9876543212", district: "Thrissur", plan: "FREE", status: "ACTIVE", candidates: 45, placements: 3, isVerified: false, createdAt: "2025-04-20", lastActive: "2025-04-25" },
  { id: "4", name: "AM Consultants", slug: "am-consultants", owner: "Arun Menon", email: "arun@am.in", phone: "9876543213", district: "Ernakulam", plan: "PRO", status: "ACTIVE", candidates: 567, placements: 44, isVerified: true, createdAt: "2023-11-10", lastActive: "2025-04-26" },
  { id: "5", name: "Career Bridge", slug: "career-bridge", owner: "Sneha Pillai", email: "sneha@cb.in", phone: "9876543214", district: "Kannur", plan: "FREE", status: "SUSPENDED", candidates: 12, placements: 1, isVerified: false, createdAt: "2025-04-15", lastActive: "2025-04-16" },
  { id: "6", name: "Thomas Placements", slug: "thomas-placements", owner: "Biju Thomas", email: "biju@thomas.in", phone: "9876543215", district: "Kozhikode", plan: "PRO", status: "ACTIVE", candidates: 234, placements: 19, isVerified: true, createdAt: "2024-05-01", lastActive: "2025-04-25" },
];

const planColors = { FREE: "secondary", PRO: "default", MAX: "warning" } as const;
const statusColors = { ACTIVE: "success", SUSPENDED: "destructive", EXPIRED: "orange" } as const;

export default function AdminAgenciesPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = mockAgencies.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.owner.toLowerCase().includes(search.toLowerCase());
    const matchPlan = !planFilter || a.plan === planFilter;
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const suspendAgency = (id: string, name: string) => {
    toast.success(`${name} has been suspended`);
  };

  return (
    <div className="space-y-5 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Agencies</h1>
          <p className="text-foreground/30 text-sm mt-0.5">{mockAgencies.length} registered agencies</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: mockAgencies.length, color: "text-foreground" },
          { label: "Pro/Max", value: mockAgencies.filter((a) => a.plan !== "FREE").length, color: "text-indigo-400" },
          { label: "Active", value: mockAgencies.filter((a) => a.status === "ACTIVE").length, color: "text-emerald-400" },
          { label: "Suspended", value: mockAgencies.filter((a) => a.status === "SUSPENDED").length, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-amber-500/10 bg-white/2 px-4 py-3">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-foreground/30">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search & filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 flex-wrap">
        <Input placeholder="Search agency or owner..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="flex-1 min-w-48" />
        <select className="flex h-10 rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
          <option value="">All Plans</option>
          {["FREE", "PRO", "MAX"].map((p) => <option key={p} value={p} className="bg-[#0a0a12]">{p}</option>)}
        </select>
        <select className="flex h-10 rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {["ACTIVE", "SUSPENDED", "EXPIRED"].map((s) => <option key={s} value={s} className="bg-[#0a0a12]">{s}</option>)}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-amber-500/10 bg-white/2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">Agency</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">Candidates</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">Placements</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map((agency, i) => (
                <motion.tr
                  key={agency.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="hover:bg-white/2 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-foreground text-xs font-bold shrink-0">
                        {agency.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                          {agency.name}
                          {agency.isVerified && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                        </div>
                        <div className="text-xs text-foreground/30">{agency.district}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground/70">{agency.owner}</div>
                    <div className="text-xs text-foreground/30">{agency.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={planColors[agency.plan as keyof typeof planColors]}>{agency.plan}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColors[agency.status as keyof typeof statusColors]}>{agency.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground/60">{agency.candidates.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-foreground/60">{agency.placements}</td>
                  <td className="px-4 py-3 text-xs text-foreground/30">{formatDate(agency.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors" title="View Details">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors" title="Email Owner">
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                      {agency.status === "ACTIVE" ? (
                        <button
                          onClick={() => suspendAgency(agency.id, agency.name)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-foreground/30 hover:text-red-400 transition-colors"
                          title="Suspend"
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-foreground/30 hover:text-emerald-400 transition-colors" title="Reactivate">
                          <RefreshCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <p className="text-xs text-foreground/20">Showing {filtered.length} of {mockAgencies.length} agencies</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-xs text-foreground/30">Page 1</span>
            <Button variant="outline" size="sm"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
