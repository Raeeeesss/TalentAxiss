"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Eye, EyeOff, Mail, Lock, User, Building2, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const perks = [
  "7-day free trial, no credit card",
  "AI CV parsing included",
  "Import your existing database",
  "Cancel anytime",
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    agencyName: "",
    phone: "",
    district: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/15 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full" />
        <div className="grid-pattern absolute inset-0 opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">TalentAxiss</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-3">
            Start your free trial
          </h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            Join 156+ Kerala recruitment agencies already using TalentAxiss to place candidates faster with AI.
          </p>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-white/60">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right side — form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-8 backdrop-blur-sm">
            {/* Steps */}
            <div className="flex items-center gap-3 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s <= step ? "bg-indigo-600 text-white" : "bg-white/10 text-white/40"}`}>
                    {s}
                  </div>
                  <span className={`text-xs transition-colors ${s === step ? "text-white" : "text-white/30"}`}>
                    {s === 1 ? "Your Info" : "Agency Info"}
                  </span>
                  {s === 1 && <div className="h-px w-8 bg-white/10" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">Full Name</label>
                    <Input placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} leftIcon={<User className="h-4 w-4" />} required />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">Email</label>
                    <Input type="email" placeholder="you@agency.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} leftIcon={<Mail className="h-4 w-4" />} required />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">Password</label>
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      leftIcon={<Lock className="h-4 w-4" />}
                      rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                      required
                      minLength={8}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">Agency Name</label>
                    <Input placeholder="Your Agency Name" value={form.agencyName} onChange={(e) => setForm({ ...form, agencyName: e.target.value })} leftIcon={<Building2 className="h-4 w-4" />} required />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">Phone Number</label>
                    <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} leftIcon={<Phone className="h-4 w-4" />} />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">District</label>
                    <select
                      className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                    >
                      <option value="">Select District</option>
                      {["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"].map(d => (
                        <option key={d} value={d} className="bg-[#0a0a12]">{d}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" loading={loading}>
                {step === 1 ? "Continue" : "Create Free Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {step === 2 && (
              <button onClick={() => setStep(1)} className="w-full text-center text-sm text-white/40 hover:text-white mt-3 transition-colors">
                ← Back
              </button>
            )}

            <p className="text-center text-sm text-white/40 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
            </p>

            <p className="text-center text-xs text-white/20 mt-4">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
