"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCog, Plus, Mail, Phone, X, Save, Loader2, CheckCircle2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  AGENCY_OWNER: "Owner",
  AGENCY_STAFF: "Recruiter",
};
const ROLE_VARIANT: Record<string, string> = {
  AGENCY_OWNER: "info",
  AGENCY_STAFF: "secondary",
};

export default function TeamPage() {
  const { data: session } = useSession();
  const myId   = (session?.user as any)?.id;
  const myRole = (session?.user as any)?.role;

  const [members, setMembers]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [invite, setInvite]     = useState({ name: "", email: "", designation: "", role: "AGENCY_STAFF" });

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/team");
      const data = await res.json();
      setMembers(data.members || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  const sendInvite = async () => {
    if (!invite.name || !invite.email) { toast.error("Name and email are required"); return; }
    setInviting(true);
    try {
      const res  = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invite),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(`Invitation sent to ${invite.email}`);
      setShowInvite(false);
      setInvite({ name: "", email: "", designation: "", role: "AGENCY_STAFF" });
      fetchTeam();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setInviting(false);
    }
  };

  const deactivate = async (userId: string, name: string) => {
    if (!confirm(`Deactivate ${name}? They will lose access immediately.`)) return;
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${name} deactivated`);
      fetchTeam();
    } catch {
      toast.error("Failed to deactivate");
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCog className="h-6 w-6 text-indigo-400" />
            Team Members
          </h1>
          <p className="text-foreground/40 text-sm mt-0.5">{members.length} member{members.length !== 1 ? "s" : ""} in your agency</p>
        </div>
        {myRole === "AGENCY_OWNER" && (
          <Button variant="gradient" size="sm" onClick={() => setShowInvite(true)}>
            <Plus className="h-4 w-4" />Invite Member
          </Button>
        )}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 text-foreground/30">
          <UserCog className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No team members yet</p>
          {myRole === "AGENCY_OWNER" && (
            <Button variant="gradient" size="sm" className="mt-4" onClick={() => setShowInvite(true)}>
              <Plus className="h-4 w-4" />Invite First Member
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4 shadow-sm ${!m.isActive ? "opacity-50" : ""}`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                {getInitials(m.name || m.email)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-foreground">
                    {m.name || "—"}
                    {m.id === myId && <span className="text-xs text-indigo-400 ml-1">(You)</span>}
                  </span>
                  <Badge variant={ROLE_VARIANT[m.role] as any}>{ROLE_LABEL[m.role] || m.role}</Badge>
                  {!m.isActive && <Badge variant="secondary">Inactive</Badge>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-foreground/40">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</span>
                  {m.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</span>}
                  {m.staffProfile?.designation && <span>{m.staffProfile.designation}</span>}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 shrink-0 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{m.placements ?? 0}</div>
                  <div className="text-xs text-gray-400">Placed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{m.candidateCount ?? 0}</div>
                  <div className="text-xs text-gray-400">Candidates</div>
                </div>
              </div>

              {/* Actions */}
              {myRole === "AGENCY_OWNER" && m.id !== myId && m.isActive && (
                <Button
                  variant="outline" size="sm"
                  className="shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/5 border-red-500/20"
                  onClick={() => deactivate(m.id, m.name)}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowInvite(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-900/10 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Invite Team Member</h3>
                  <button onClick={() => setShowInvite(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Full Name *</label>
                    <Input placeholder="Recruiter name" value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email Address *</label>
                    <Input type="email" placeholder="recruiter@email.com" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Designation</label>
                    <Input placeholder="e.g. Senior Recruiter" value={invite.designation} onChange={(e) => setInvite({ ...invite, designation: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1.5 block">Role</label>
                    <select
                      className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      value={invite.role}
                      onChange={(e) => setInvite({ ...invite, role: e.target.value })}
                    >
                      <option value="AGENCY_STAFF">Recruiter</option>
                      <option value="AGENCY_OWNER">Owner / Admin</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-400">
                    An invitation email with a temporary password will be sent. They can change it after first login.
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowInvite(false)}>Cancel</Button>
                  <Button variant="gradient" className="flex-1" loading={inviting} onClick={sendInvite}>
                    <Mail className="h-4 w-4" />Send Invite
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
