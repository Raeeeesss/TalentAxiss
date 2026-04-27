"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap, Eye, EyeOff, Mail, Lock, User, Building2,
  Phone, ArrowRight, CheckCircle2, RefreshCw, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { KERALA_DISTRICTS } from "@/lib/utils";

const STEPS = ["Your Info", "Verify OTPs", "Agency Info"];

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [timer, setTimer]       = useState(0);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    agencyName: "", district: "",
  });

  const up = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const startTimer = () => {
    setTimer(60);
    const iv = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; });
    }, 1000);
  };

  /* ── Send OTP via server (auto-generates code) ── */
  const sendOtp = async (type: "email" | "phone"): Promise<string> => {
    const identifier = type === "email" ? form.email : form.phone;
    const res  = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, type }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to send ${type} OTP`);
    return data.otp; // always returned
  };

  /* ── Verify OTP via server ── */
  const verifyOtp = async (type: "email" | "phone", otp: string) => {
    const identifier = type === "email" ? form.email : form.phone;
    const res  = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, type, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Invalid ${type} OTP`);
  };

  /* ── Step 1: generate & auto-fill both OTPs ── */
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim())        { toast.error("Name is required"); return; }
    if (!form.email.trim())       { toast.error("Email is required"); return; }
    if (!form.phone.trim())       { toast.error("Mobile number is required"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }

    setLoading(true);
    try {
      const [eCode, pCode] = await Promise.all([sendOtp("email"), sendOtp("phone")]);
      setEmailOtp(eCode);
      setPhoneOtp(pCode);
      toast.success("OTPs generated!", { description: "Both fields are auto-filled below." });
      setStep(2);
      startTimer();
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate OTPs");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: verify both ── */
  const handleStep2 = async () => {
    if (emailOtp.length !== 6) { toast.error("Enter the 6-digit email OTP"); return; }
    if (phoneOtp.length !== 6) { toast.error("Enter the 6-digit mobile OTP"); return; }

    setLoading(true);
    try {
      await Promise.all([verifyOtp("email", emailOtp), verifyOtp("phone", phoneOtp)]);
      toast.success("Email & mobile verified!");
      setStep(3);
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend ── */
  const resendBoth = async () => {
    if (timer > 0 || loading) return;
    setLoading(true);
    try {
      const [eCode, pCode] = await Promise.all([sendOtp("email"), sendOtp("phone")]);
      setEmailOtp(eCode);
      setPhoneOtp(pCode);
      startTimer();
      toast.success("New OTPs generated and auto-filled!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: create account ── */
  const handleStep3 = async () => {
    if (!form.agencyName.trim()) { toast.error("Agency name is required"); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
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
      </div>

      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">TalentAxiss</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-3">Start your free trial</h1>
          <p className="text-foreground/50 mb-8 leading-relaxed">
            Join Kerala recruitment agencies using TalentAxiss to place candidates faster with AI.
          </p>
          <ul className="space-y-3">
            {["7-day free trial, no credit card", "AI CV parsing included", "Email + mobile OTP verified", "Cancel anytime"].map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-foreground/60">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />{p}
              </li>
            ))}
          </ul>

          {/* Verification status */}
          <div className="mt-8 p-4 rounded-2xl border border-white/8 bg-white/2 space-y-2.5">
            <p className="text-xs text-foreground/40 font-medium mb-3">Verification status</p>
            {[
              { label: "Email address", icon: Mail,  done: step > 2, color: "text-indigo-400" },
              { label: "Mobile number", icon: Phone, done: step > 2, color: "text-emerald-400" },
            ].map((v) => (
              <div key={v.label} className="flex items-center gap-2.5 text-sm">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${v.done ? "bg-emerald-500" : "bg-white/8"}`}>
                  {v.done ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <v.icon className={`h-3 w-3 ${v.color}`} />}
                </div>
                <span className={v.done ? "text-emerald-400" : "text-foreground/40"}>{v.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-8 backdrop-blur-sm">

            {/* Step indicator */}
            <div className="flex items-center justify-between mb-6">
              {STEPS.map((label, i) => {
                const s = i + 1; const done = s < step; const cur = s === step;
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? "bg-emerald-500 text-white" : cur ? "bg-indigo-600 text-white" : "bg-white/10 text-foreground/40"}`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : s}
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap ${cur ? "text-foreground" : "text-foreground/30"}`}>{label}</span>
                    </div>
                    {s < STEPS.length && <div className={`flex-1 h-px mx-3 transition-colors ${done ? "bg-emerald-500/50" : "bg-white/10"}`} />}
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">

              {/* Step 1 */}
              {step === 1 && (
                <motion.form key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">Full Name</label>
                    <Input placeholder="Your full name" value={form.name} onChange={(e) => up("name", e.target.value)} leftIcon={<User className="h-4 w-4" />} required />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">Email Address</label>
                    <Input type="email" placeholder="you@agency.com" value={form.email} onChange={(e) => up("email", e.target.value)} leftIcon={<Mail className="h-4 w-4" />} required />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">Mobile Number</label>
                    <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => up("phone", e.target.value)} leftIcon={<Phone className="h-4 w-4" />} required />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">Password</label>
                    <Input
                      type={showPw ? "text" : "password"} placeholder="Min 8 characters"
                      value={form.password} onChange={(e) => up("password", e.target.value)}
                      leftIcon={<Lock className="h-4 w-4" />}
                      rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                      required minLength={8}
                    />
                  </div>
                  <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" loading={loading}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
                      <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="text-xs text-foreground/60 truncate">{form.email}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                      <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs text-foreground/60 truncate">{form.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-indigo-400" /> Email OTP
                    </label>
                    <Input placeholder="000000" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} className="text-center text-xl tracking-[0.4em] font-bold" maxLength={6} />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-emerald-400" /> Mobile OTP
                    </label>
                    <Input placeholder="000000" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} className="text-center text-xl tracking-[0.4em] font-bold" maxLength={6} />
                  </div>
                  <Button variant="gradient" size="lg" className="w-full" loading={loading} onClick={handleStep2}>
                    Verify Both <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <button onClick={resendBoth} disabled={timer > 0 || loading} className="w-full text-center text-sm text-foreground/40 hover:text-indigo-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" />
                    {timer > 0 ? `Regenerate in ${timer}s` : "Regenerate OTPs"}
                  </button>
                  <button onClick={() => setStep(1)} className="w-full text-center text-xs text-foreground/30 hover:text-foreground transition-colors">← Go back</button>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-emerald-400">Email & mobile verified — one last step!</span>
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">Agency / Consultancy Name <span className="text-red-400">*</span></label>
                    <Input placeholder="Your Agency Name" value={form.agencyName} onChange={(e) => up("agencyName", e.target.value)} leftIcon={<Building2 className="h-4 w-4" />} />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/60 mb-1.5 block">District</label>
                    <select className="flex h-10 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={form.district} onChange={(e) => up("district", e.target.value)}>
                      <option value="">Select District</option>
                      {KERALA_DISTRICTS.map((d) => <option key={d} value={d} className="bg-[#0a0a12]">{d}</option>)}
                    </select>
                  </div>
                  <Button variant="gradient" size="lg" className="w-full mt-2" loading={loading} onClick={handleStep3}>
                    Create Free Account <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>

            <p className="text-center text-sm text-foreground/40 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
