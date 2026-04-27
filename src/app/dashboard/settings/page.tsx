"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Globe, Palette, Save, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
    <div className="flex items-center gap-2 mb-5">
      <Icon className="h-4 w-4 text-indigo-400" />
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div>
      <div className="text-sm text-foreground/80">{label}</div>
      <div className="text-xs text-foreground/30 mt-0.5">{description}</div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-indigo-600" : "bg-white/10"}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  </div>
);

export default function SettingsPage() {
  const { data: session } = useSession();
  const [agencyName, setAgencyName] = useState("My Agency");
  const [agencyEmail, setAgencyEmail] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [notifications, setNotifications] = useState({
    interviews: true,
    followups: true,
    placements: true,
    backoutRisk: true,
    weeklyReport: false,
    emailAlerts: true,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Settings saved!");
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-400" />
          Settings
        </h1>
        <p className="text-foreground/40 text-sm mt-0.5">Manage your agency preferences</p>
      </motion.div>

      {/* Agency Info */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Agency Information" icon={Building2}>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-foreground/60 mb-1.5 block">Agency Name</label>
              <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Your Agency Name" />
            </div>
            <div>
              <label className="text-sm text-foreground/60 mb-1.5 block">Contact Email</label>
              <Input type="email" value={agencyEmail} onChange={(e) => setAgencyEmail(e.target.value)} placeholder="agency@example.com" />
            </div>
            <div>
              <label className="text-sm text-foreground/60 mb-1.5 block">Contact Phone</label>
              <Input value={agencyPhone} onChange={(e) => setAgencyPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Notifications" icon={Bell}>
          <Toggle label="Interview Reminders" description="Get notified before scheduled interviews" checked={notifications.interviews} onChange={(v) => setNotifications({ ...notifications, interviews: v })} />
          <Toggle label="Follow-up Alerts" description="Remind when follow-ups are overdue" checked={notifications.followups} onChange={(v) => setNotifications({ ...notifications, followups: v })} />
          <Toggle label="Placement Confirmations" description="Notify when a placement is confirmed" checked={notifications.placements} onChange={(v) => setNotifications({ ...notifications, placements: v })} />
          <Toggle label="Backout Risk Alerts" description="Alert when a candidate risk score rises" checked={notifications.backoutRisk} onChange={(v) => setNotifications({ ...notifications, backoutRisk: v })} />
          <Toggle label="Weekly Summary Email" description="Receive a weekly performance report" checked={notifications.weeklyReport} onChange={(v) => setNotifications({ ...notifications, weeklyReport: v })} />
          <Toggle label="Email Alerts" description="Send critical alerts to your email" checked={notifications.emailAlerts} onChange={(v) => setNotifications({ ...notifications, emailAlerts: v })} />
        </Section>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Security" icon={Shield}>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-white/8 bg-white/2 flex items-center justify-between">
              <div>
                <div className="text-sm text-foreground/80">Password</div>
                <div className="text-xs text-foreground/30">Last changed: Never</div>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            <div className="p-4 rounded-xl border border-white/8 bg-white/2 flex items-center justify-between">
              <div>
                <div className="text-sm text-foreground/80">Two-Factor Authentication</div>
                <div className="text-xs text-foreground/30">Add an extra layer of security</div>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/3 p-6">
          <h3 className="font-semibold text-red-400 mb-4">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-foreground/70">Delete Agency Account</div>
              <div className="text-xs text-foreground/30">Permanently delete all data. Cannot be undone.</div>
            </div>
            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              Delete Account
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="pb-8">
        <Button variant="gradient" onClick={save} loading={saving}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}
