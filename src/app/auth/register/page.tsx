"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, Mail, Phone, Building2,
  ArrowRight, CheckCircle2, RefreshCw, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { KERALA_DISTRICTS } from "@/lib/utils";

const STEPS = ["Your Info", "Verify OTPs", "Agency Info"] as const;

function Field({
  label, id, type = "text", value, onChange, placeholder, error, rightEl, autoComplete,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string;
  rightEl?: React.ReactNode; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <input id={id} type={type} value={value} autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full h-10 px-3.5 rounded-xl border text-slate-900 text-[13px] outline-none transition-all placeholder:text-slate-300 ${
            error
              ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-4 focus:ring-red-50"
              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          } ${rightEl ? "pr-10" : ""}`}
        />
        {rightEl && <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</span>}
      </div>
    </div>
  );
}

function OtpField({ label, value, onChange, note }: {
  label: string; value: string; onChange: (v: string) => void; note?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[12px] font-semibold text-slate-600">{label}</label>
        {note && <span className="text-[11px] text-emerald-600 font-semibold">{note}</span>}
      </div>
      <div className="relative">
        <input type="text" inputMode="numeric" value={value} maxLength={6}
          onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="• • • • • •"
          className={`w-full h-11 text-center text-lg font-bold tracking-[0.4em] rounded-xl border outline-none transition-all ${
            value.length === 6
              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
              : "border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 placeholder:text-slate-200 placeholder:text-sm placeholder:tracking-widest placeholder:font-normal"
          }`}
        />
        {value.length === 6 && <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />}
      </div>
    </div>
  );
}

function ErrorBanner({ errors }: { errors: Record<string, string> }) {
  const keys = Object.keys(errors);
  if (!keys.length) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[12px] rounded-xl px-3.5 py-2.5 mb-3">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1">{errors[keys[0]]}</span>
      {keys.length > 1 && <span className="text-[11px] text-red-400 shrink-0">+{keys.length - 1} more</span>}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]                   = useState(1);
  const [loading, setLoading]             = useState(false);
  const [showPw, setShowPw]               = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [emailOtp, setEmailOtp]           = useState("");
  const [phoneOtp, setPhoneOtp]           = useState("");
  const [timer, setTimer]                 = useState(0);
  const [errors, setErrors]               = useState<Record<string, string>>({});
  const [regError, setRegError]           = useState<string | null>(null);
  const [form, setForm]                   = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", agencyName: "", district: "",
  });

  const up = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const startTimer = () => {
    setTimer(60);
    const iv = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  };

  const sendOtp = async (type: "email" | "phone") => {
    const id = type === "email" ? form.email : form.phone;
    const res = await fetch("/api/otp/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: id, type }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to send ${type} OTP`);
    return data.otp;
  };

  const verifyOtp = async (type: "email" | "phone", otp: string) => {
    const id = type === "email" ? form.email : form.phone;
    const res = await fetch("/api/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: id, type, otp }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Invalid ${type} OTP`);
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Mobile number is required";
    else if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid 10-digit number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleStep1 = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!validateStep1()) return;
    setLoading(true); setRegError(null);
    try {
      const [ec, pc] = await Promise.all([sendOtp("email"), sendOtp("phone")]);
      setEmailOtp(ec); setPhoneOtp(pc);
      toast.success("OTPs auto-filled!"); setStep(2); startTimer();
    } catch (err: unknown) { setRegError(err instanceof Error ? err.message : "Failed to send OTPs."); }
    finally { setLoading(false); }
  };

  const handleStep2 = async () => {
    const e: Record<string, string> = {};
    if (emailOtp.length !== 6) e.emailOtp = "Enter the 6-digit email OTP";
    if (phoneOtp.length !== 6) e.phoneOtp = "Enter the 6-digit mobile OTP";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setRegError(null);
    try {
      await Promise.all([verifyOtp("email", emailOtp), verifyOtp("phone", phoneOtp)]);
      toast.success("Verified!"); setStep(3);
    } catch (err: unknown) { setRegError(err instanceof Error ? err.message : "Verification failed."); }
    finally { setLoading(false); }
  };

  const resendBoth = async () => {
    if (timer > 0 || loading) return;
    setLoading(true);
    try {
      const [ec, pc] = await Promise.all([sendOtp("email"), sendOtp("phone")]);
      setEmailOtp(ec); setPhoneOtp(pc); startTimer(); toast.success("New OTPs generated!");
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed to resend"); }
    finally { setLoading(false); }
  };

  const handleStep3 = async () => {
    if (!form.agencyName.trim()) { setErrors({ agencyName: "Agency name is required" }); return; }
    setLoading(true); setRegError(null);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } catch (err: unknown) { setRegError(err instanceof Error ? err.message : "Registration failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-50 flex flex-col items-center justify-center px-5 gap-4">
      {/* Subtle decoration matching landing page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-[100px]" />
      </div>

      {/* Logo + step indicator */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/25">
            <span className="text-[11px] font-black text-white">TA</span>
          </div>
          <span className="font-bold text-slate-900 text-[15px] tracking-tight">TalentAxiss</span>
        </Link>

        <div className="flex items-center">
          {STEPS.map((label, i) => {
            const s = i + 1, done = s < step, cur = s === step;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    done ? "bg-emerald-500 text-white" : cur ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"
                  }`}>{done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}</div>
                  <span className={`text-[12px] font-medium ${cur ? "text-slate-900" : done ? "text-emerald-600" : "text-slate-400"}`}>{label}</span>
                </div>
                {s < STEPS.length && (
                  <div className="flex-1 h-px mx-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-400 rounded-full"
                      initial={{ width: "0%" }} animate={{ width: done ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Card */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06 }}
        className="relative z-10 w-full max-w-md bg-white border border-slate-100 rounded-2xl px-7 py-5 shadow-sm">

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="mb-4">
            {step === 1 && <><h1 className="text-[20px] font-black text-slate-900 tracking-tight">Create your account</h1><p className="text-slate-400 text-[12px] mt-0.5">7-day free trial · No credit card required.</p></>}
            {step === 2 && <><h1 className="text-[20px] font-black text-slate-900 tracking-tight">Verify your identity</h1><p className="text-slate-400 text-[12px] mt-0.5">OTPs sent — enter them below to continue.</p></>}
            {step === 3 && <><h1 className="text-[20px] font-black text-slate-900 tracking-tight">Set up your agency</h1><p className="text-slate-400 text-[12px] mt-0.5">Almost done — one final step.</p></>}
          </motion.div>
        </AnimatePresence>

        {regError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[12px] rounded-xl px-3.5 py-2.5 mb-3">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />{regError}
          </div>
        )}

        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.form key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}
              onSubmit={handleStep1} noValidate className="space-y-2.5">
              <ErrorBanner errors={errors} />
              <Field id="name" label="Full Name" value={form.name} onChange={v => up("name", v)} placeholder="Your full name" autoComplete="name" error={errors.name} />
              <Field id="email" label="Email Address" type="email" value={form.email} onChange={v => up("email", v)} placeholder="you@company.com" autoComplete="email" error={errors.email} />
              <Field id="phone" label="Mobile Number" type="tel" value={form.phone} onChange={v => up("phone", v)} placeholder="+91 98765 43210" autoComplete="tel" error={errors.phone} />
              <div className="grid grid-cols-2 gap-2.5">
                <Field id="password" label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={v => up("password", v)}
                  placeholder="Min 8 chars" autoComplete="new-password" error={errors.password}
                  rightEl={<button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600 transition-colors">{showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>}
                />
                <Field id="confirmPassword" label="Confirm Password" type={showConfirmPw ? "text" : "password"} value={form.confirmPassword} onChange={v => up("confirmPassword", v)}
                  placeholder="Re-enter" autoComplete="new-password" error={errors.confirmPassword}
                  rightEl={<button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="text-slate-400 hover:text-slate-600 transition-colors">{showConfirmPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>}
                />
              </div>
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.012 } : {}} whileTap={!loading ? { scale: 0.985 } : {}}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] rounded-xl shadow-md shadow-blue-600/20 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
                {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending OTPs…</> : <>Continue <ArrowRight className="h-3.5 w-3.5" /></>}
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="space-y-3">
              <ErrorBanner errors={errors} />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
                  <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="text-[11px] text-blue-700 font-medium truncate">{form.email}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
                  <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[11px] text-emerald-700 font-medium truncate">{form.phone}</span>
                </div>
              </div>
              <OtpField label="Email OTP" value={emailOtp} onChange={setEmailOtp} note="Auto-filled" />
              <OtpField label="Mobile OTP" value={phoneOtp} onChange={setPhoneOtp} note="Auto-filled" />
              <motion.button type="button" disabled={loading}
                whileHover={!loading ? { scale: 1.012 } : {}} whileTap={!loading ? { scale: 0.985 } : {}}
                onClick={handleStep2}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] rounded-xl shadow-md shadow-blue-600/20 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Verifying…</> : <>Verify Both OTPs <ArrowRight className="h-3.5 w-3.5" /></>}
              </motion.button>
              <div className="flex items-center justify-between">
                <button onClick={resendBoth} disabled={timer > 0 || loading}
                  className="flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-blue-600 disabled:opacity-40 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" />{timer > 0 ? `Resend in ${timer}s` : "Resend OTPs"}
                </button>
                <button onClick={() => setStep(1)} className="text-[12px] text-slate-400 hover:text-slate-700 transition-colors">← Back</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="space-y-3">
              <ErrorBanner errors={errors} />
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-[12px] text-emerald-700 font-medium">Email &amp; mobile verified</span>
              </div>
              <Field id="agencyName" label="Agency / Consultancy Name" value={form.agencyName}
                onChange={v => up("agencyName", v)} placeholder="e.g. Kerala Manpower Services"
                error={errors.agencyName} rightEl={<Building2 className="h-4 w-4 text-slate-400" />}
              />
              <div>
                <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">District</label>
                <div className="relative">
                  <select value={form.district} onChange={e => up("district", e.target.value)}
                    className="w-full h-10 pl-3.5 pr-9 rounded-xl border border-slate-200 text-[13px] text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer bg-white">
                    <option value="">Select your district</option>
                    {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <motion.button type="button" disabled={loading}
                whileHover={!loading ? { scale: 1.012 } : {}} whileTap={!loading ? { scale: 0.985 } : {}}
                onClick={handleStep3}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] rounded-xl shadow-md shadow-blue-600/20 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Create Free Account</>}
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* Below card */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="relative z-10 text-[13px] text-slate-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Sign in</Link>
      </motion.p>
    </div>
  );
}
