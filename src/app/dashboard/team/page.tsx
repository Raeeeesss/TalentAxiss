"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCog, Plus, Shield, Users, Mail, Phone,
  MoreHorizontal, Edit, Trash2, X, CheckCircle2,
  Crown, Star, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

const mockStaff = [
  {
    id: "1", name: "Rajan Krishnan (You)", email: "rajan@agency.com", phone: "9876543210",
    role: "AGENCY_OWNER", designation: "Managing Director", isActive: true,
    placements: 12, candidates: 28, joinedAt: "2024-01-01",
    permissions: { candidates: true, jobs: true, reports: true, billing: true, team: true },
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "2", name: "Priya Menon", email: "priya@agency.com", phone: "9876543211",
    role: "AGENCY_STAFF", designation: "Senior Recruiter", isActive: true,
    placements: 8, candidates: 22, joinedAt: "2024-03-15",
    permissions: { candidates: true, jobs: true, reports: true, billing: false, team: false },
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "3", name: "Anoop Suresh", email: "anoop@agency.com", phone: "9876543212",
    role: "AGENCY_STAFF", designation: "Recruiter", isActive: true,
    placements: 5, candidates: 15, joinedAt: "2024-06-01",
    permissions: { candidates: true, jobs: true, reports: false, billing: false, team: false },
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "4", name: "Sneha Raj", email: "sneha@agency.com", phone: "9876543213",
    role: "AGENCY_STAFF", designation: "Jr. Recruiter", isActive: false,
    placements: 3, candidates: 7, joinedAt: "2024-09-01",
    permissions: { candidates: true, jobs: false, reports: false, billing: false, team: false },
    color: "from-amber-500 to-orange-600",
  },
];

const permissionLabels: Record<string, string> = {
  candidates: "Manage Candidates",
  jobs: "Manage Jobs",
  reports: "View Reports",
  billing: "Billing Access",
  team: "Manage Team",
};

function InviteModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", designation: "", role: "AGENCY_STAFF" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success(`Invitation sent to ${form.email}`);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-[#0a0a12] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Invite Team Member</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Full Name</label>
            <Input placeholder="Team member name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Email Address</label>
            <Input type="email" placeholder="staff@agency.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Designation</label>
            <Input placeholder="e.g. Senior Recruiter" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-white/60 mb-1.5 block">Role</label>
            <select
              className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="AGENCY_STAFF" className="bg-[#0a0a12]">Staff — Limited access</option>
              <option value="AGENCY_OWNER" className="bg-[#0a0a12]">Admin — Full access</option>
            </select>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/20 text-xs text-indigo-300">
            An invitation email will be sent. They&apos;ll set their own password.
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={loading}>
            Send Invitation
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [editingPerms, setEditingPerms] = useState<string | null>(null);

  const roleConfig = {
    AGENCY_OWNER: { label: "Admin", icon: Crown, color: "text-amber-400", variant: "warning" as const },
    AGENCY_STAFF: { label: "Staff", icon: User, color: "text-blue-400", variant: "info" as const },
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCog className="h-6 w-6 text-blue-400" />
            Team Management
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{mockStaff.filter((s) => s.isActive).length} active members · Pro plan allows up to 5</p>
        </div>
        <Button variant="gradient" onClick={() => setShowInvite(true)}>
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </motion.div>

      {/* Plan usage */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex items-center justify-between"
      >
        <div>
          <div className="text-sm text-white font-medium">Team Slots</div>
          <div className="text-xs text-white/40 mt-0.5">Pro plan · 4/5 seats used</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
          <span className="text-sm text-white/60">4/5</span>
        </div>
      </motion.div>

      {/* Staff cards */}
      <div className="grid gap-4">
        {mockStaff.map((member, i) => {
          const roleConf = roleConfig[member.role as keyof typeof roleConfig];
          const isEditingPerms = editingPerms === member.id;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className={`rounded-2xl border ${member.isActive ? "border-white/8 bg-white/2" : "border-white/4 bg-white/1 opacity-60"} overflow-hidden`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-white">{member.name}</span>
                        <Badge variant={roleConf.variant}>{roleConf.label}</Badge>
                        {!member.isActive && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                      <div className="text-sm text-white/50">{member.designation}</div>
                      <div className="flex items-center gap-3 text-xs text-white/30 mt-1">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{member.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{member.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{member.placements}</div>
                      <div className="text-xs text-white/30">Placements</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{member.candidates}</div>
                      <div className="text-xs text-white/30">Candidates</div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-white/30 uppercase tracking-wider">Permissions</div>
                    {member.role !== "AGENCY_OWNER" && (
                      <button
                        onClick={() => setEditingPerms(isEditingPerms ? null : member.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {isEditingPerms ? "Done" : "Edit"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(member.permissions).map(([key, val]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${val ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-white/3 text-white/20 border-white/8"} ${isEditingPerms && member.role !== "AGENCY_OWNER" ? "cursor-pointer hover:opacity-80" : ""}`}
                      >
                        {val ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {permissionLabels[key]}
                      </div>
                    ))}
                  </div>
                </div>

                {member.role !== "AGENCY_OWNER" && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 hover:border-red-500/30">
                      {member.isActive ? "Deactivate" : "Reactivate"}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
