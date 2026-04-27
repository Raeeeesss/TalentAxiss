"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";
  const initials = getInitials(userName);

  const [form, setForm] = useState({ name: userName, phone: "", bio: "" });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Profile updated!");
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-indigo-400" />
          My Profile
        </h1>
        <p className="text-foreground/40 text-sm mt-0.5">Manage your personal information</p>
      </motion.div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-3xl font-bold">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 border-2 border-[#050508] flex items-center justify-center hover:bg-indigo-500 transition-colors">
                <Camera className="h-3 w-3 text-foreground" />
              </button>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{userName || "User"}</div>
              <div className="text-sm text-foreground/40">{userEmail}</div>
              <div className="text-xs text-indigo-400 mt-1">Agency Admin</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={save} className="rounded-2xl border border-white/8 bg-white/2 p-6 space-y-4">
          <h3 className="font-semibold text-foreground mb-4">Personal Details</h3>

          <div>
            <label className="text-sm text-foreground/60 mb-1.5 block">Full Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              leftIcon={<User className="h-4 w-4" />}
            />
          </div>

          <div>
            <label className="text-sm text-foreground/60 mb-1.5 block">Email Address</label>
            <Input
              value={userEmail}
              disabled
              leftIcon={<Mail className="h-4 w-4" />}
              className="opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-foreground/25 mt-1">Email cannot be changed here. Contact support.</p>
          </div>

          <div>
            <label className="text-sm text-foreground/60 mb-1.5 block">Phone Number</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="h-4 w-4" />}
            />
          </div>

          <div>
            <label className="text-sm text-foreground/60 mb-1.5 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Brief description about yourself..."
              rows={3}
              className="flex w-full rounded-xl border border-border bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="gradient" loading={saving}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
