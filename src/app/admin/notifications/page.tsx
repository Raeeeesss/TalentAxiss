"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const sentHistory = [
  { id: "1", title: "🚀 New AI Matching Feature Released!", target: "All Agencies", sent: "Apr 20, 2025", reach: 156 },
  { id: "2", title: "Pro Plan price update — effective May 1", target: "FREE Plan Users", sent: "Apr 15, 2025", reach: 67 },
  { id: "3", title: "Scheduled maintenance: Apr 14, 2AM–4AM", target: "All Agencies", sent: "Apr 13, 2025", reach: 156 },
  { id: "4", title: "Gulf Recruitment Mode now available!", target: "All Agencies", sent: "Apr 10, 2025", reach: 156 },
];

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ title: "", message: "", target: "ALL", type: "GENERAL" });
  const [loading, setLoading] = useState(false);

  const sendBroadcast = async () => {
    if (!form.title || !form.message) {
      toast.error("Title and message are required");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`Broadcast sent to ${form.target === "ALL" ? "all 156 agencies" : "selected agencies"}!`);
    setForm({ title: "", message: "", target: "ALL", type: "GENERAL" });
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6 text-amber-400" />
          Broadcast Notifications
        </h1>
        <p className="text-foreground/30 text-sm mt-0.5">Send announcements to all or selected agencies</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-amber-500/15 bg-white/2 p-5">
          <h3 className="font-semibold text-foreground mb-4">New Broadcast</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-foreground/50 mb-1.5 block">Target Audience</label>
              <select
                className="flex h-10 w-full rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
              >
                <option value="ALL" className="bg-[#0a0a12]">🌐 All Agencies (156)</option>
                <option value="FREE" className="bg-[#0a0a12]">Free Plan Users</option>
                <option value="PRO" className="bg-[#0a0a12]">Pro Plan Users</option>
                <option value="MAX" className="bg-[#0a0a12]">Max Plan Users</option>
                <option value="EXPIRING" className="bg-[#0a0a12]">Expiring Subscriptions</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground/50 mb-1.5 block">Notification Type</label>
              <select
                className="flex h-10 w-full rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="GENERAL" className="bg-[#0a0a12]">📢 General Announcement</option>
                <option value="FEATURE" className="bg-[#0a0a12]">🚀 New Feature</option>
                <option value="MAINTENANCE" className="bg-[#0a0a12]">🔧 Maintenance Alert</option>
                <option value="BILLING" className="bg-[#0a0a12]">💳 Billing Update</option>
                <option value="URGENT" className="bg-[#0a0a12]">🚨 Urgent Alert</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground/50 mb-1.5 block">Title</label>
              <Input
                placeholder="e.g. New Feature: AI Matching 2.0"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-foreground/50 mb-1.5 block">Message</label>
              <textarea
                className="flex w-full rounded-xl border border-border bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[100px] resize-none"
                placeholder="Write your broadcast message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            {/* Preview */}
            {form.title && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                <div className="text-xs text-foreground/30 mb-2">Preview</div>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{form.title}</div>
                    <div className="text-xs text-foreground/40 mt-0.5">{form.message || "Your message here..."}</div>
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="gradient-gold"
              className="w-full"
              onClick={sendBroadcast}
              loading={loading}
            >
              <Send className="h-4 w-4" />
              Send Broadcast
            </Button>
          </div>
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-amber-500/15 bg-white/2 p-5">
          <h3 className="font-semibold text-foreground mb-4">Sent History</h3>
          <div className="space-y-3">
            {sentHistory.map((n) => (
              <div key={n.id} className="p-3 rounded-xl border border-white/6 hover:border-white/12 transition-colors">
                <div className="text-sm font-medium text-foreground mb-1">{n.title}</div>
                <div className="flex items-center gap-3 text-xs text-foreground/30">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{n.target}</span>
                  <span>{n.sent}</span>
                  <span className="ml-auto text-emerald-400">{n.reach} reached</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
