"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Zap, Building2, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KERALA_DISTRICTS } from "@/lib/utils";
import { toast } from "sonner";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    agencyName: "",
    phone: "",
    district: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agencyName.trim()) {
      toast.error("Agency name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup-agency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed");
      toast.success("Agency created! Logging you in...");
      // Force session refresh by signing out and back in
      setTimeout(() => {
        window.location.href = "/api/auth/signout?callbackUrl=/auth/login";
      }, 1500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-600/8 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">TalentAxiss</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Set up your agency</h1>
          <p className="text-white/40 text-sm mt-2">
            Your account was created but the agency profile is missing.<br />
            Complete setup to access your dashboard.
          </p>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">
                Agency Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. Kerala Job Consultants"
                value={form.agencyName}
                onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                leftIcon={<Building2 className="h-4 w-4" />}
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Phone Number</label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="text-sm text-white/60 mb-1.5 block">District</label>
              <select
                className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              >
                <option value="">Select District</option>
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-[#0a0a12]">{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Office Address</label>
              <Input
                placeholder="Street, Area"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                leftIcon={<MapPin className="h-4 w-4" />}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-2"
              loading={loading}
            >
              Create Agency & Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
