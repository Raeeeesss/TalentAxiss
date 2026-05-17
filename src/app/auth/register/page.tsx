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

/* Field shows only a red border on error — no per-field text, keeping height fixed */
function Field({
  label, id, type = "text", value, onChange, placeholder, error, rightEl, autoComplete,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string;
  rightEl?: React.ReactNode; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold text-white/40 mb-1 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input id={id} type={type} value={value} autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`auth-input w-full h-10 px-3.5 rounded-xl text-[13px] outline-none transition-all border ${
            error ? "border-red-500/60" : "border-white/10 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15"
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
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{label}</label>
        {note && <span className="text-[11px] text-emerald-400 font-semibold">{note}</span>}
      </div>
      <div className="relative">
        <input type="text" inputMode="numeric" value={value} maxLength={6}
          onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="• • • • • •"
          className={`auth-input w-full h-10 text-center text-base font-bold tracking-[0.4em] rounded-xl outline-none transition-all border ${
            value.length === 6
              ? "border-emerald-400/60 text-emerald-300!"
              : "border-white/10 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 placeholder:tracking-widest placeholder:font-normal"
          }`}
        />
        {value.length === 6 && <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />}
      </div>
    </div>
  );
}

/* Single compact error banner — shows first error only, keeping layout height stable */
function ErrorBanner({ errors }: { errors: Record<string, string> }) {
  const keys = Object.keys(errors);
  if (!keys.length) return null;
  return (
    <div className="flex items-center gap-2 bg-red-500/12 border border-red-500/25 rounded-xl px-3 py-2 mb-3">
      <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
      <span className="text-[11px] text-red-300 flex-1 leading-tight">{errors[keys[0]]}</span>
      {keys.length > 1 && <span className="text-[10px] text-red-400/50 shrink-0">+{keys.length - 1} more</span>}
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
    <div className="h-screen overflow-hidden bg-[#050810] flex flex-col items-center justify-center px-5 gap-4">
      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-150 h-150 bg-blue-600/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-48 w-125 h-125 bg-indigo-600/20 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 right-1/4 w-112.5 h-112.5 bg-violet-600/15 rounded-full blur-[130px]" />
      </div>

      {/* Logo + step indicator */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
            <span className="text-[11px] font-black text-white">TA</span>
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">TalentAxiss</span>
        </Link>
        <div className="flex items-center">
          {STEPS.map((label, i) => {
            const s = i + 1, done = s < step, cur = s === step;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    done ? "bg-emerald-500 text-white" : cur ? "bg-blue-600 text-white ring-4 ring-blue-500/20" : "bg-white/10 text-white/30"
                  }`}>{done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}</div>
                  <span className={`text-[12px] font-medium ${cur ? "text-white" : done ? "text-emerald-400" : "text-white/30"}`}>{label}</span>
                </div>
                {s < STEPS.length && (
                  <div className="flex-1 h-px mx-3 bg-white/10 rounded-full overflow-hidden">
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

      {/* Glass card */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06 }}
        className="w-full max-w-md backdrop-blur-2xl bg-white/7 border border-white/10 rounded-2xl px-7 py-5 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
      >
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="mb-4">
            {step === 1 && <p className="text-[20px] font-black text-white tracking-tight">Create your account</p>}
            {step === 2 && <p className="text-[20px] font-black text-white tracking-tight">Verify your identity</p>}
            {step === 3 && <p className="text-[20px] font-black text-white tracking-tight">Set up your agency</p>}
          </motion.div>
        </AnimatePresence>

        {regError && (
          <div className="flex items-center gap-2 bg-red-500/12 border border-red-500/25 rounded-xl px-3 py-2 mb-3">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span className="text-[11px] text-red-300">{regError}</span>
          </div>
        )}

        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.form key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}
              onSubmit={handleStep1} noValidate className="space-y-2.5"
            >
              <ErrorBanner errors={errors} />
              <Field id="name" label="Full Name" value={form.name} onChange={v => up("name", v)} placeholder="Your full name" autoComplete="name" error={errors.name} />
              <Field id="email" label="Email Address" type="email" value={form.email} onChange={v => up("email", v)} placeholder="you@company.com" autoComplete="email" error={errors.email} />
              <Field id="phone" label="Mobile Number" type="tel" value={form.phone} onChange={v => up("phone", v)} placeholder="+91 98765 43210" autoComplete="tel" error={errors.phone} />
              <div className="grid grid-cols-2 gap-2.5">
                <Field id="password" label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={v => up("password", v)}
                  placeholder="Min 8 chars" autoComplete="new-password" error={errors.password}
                  rightEl={<button type="button" onClick={() => setShowPw(!showPw)} className="text-white/30 hover:text-white/60 transition-colors">{showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>}
                />
                <Field id="confirmPassword" label="Confirm Password" type={showConfirmPw ? "text" : "password"} value={form.confirmPassword} onChange={v => up("confirmPassword", v)}
                  placeholder="Re-enter" autoComplete="new-password" error={errors.confirmPassword}
                  rightEl={<button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="text-white/30 hover:text-white/60 transition-colors">{showConfirmPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>}
                />
              </div>
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.012 } : {}} whileTap={!loading ? { scale: 0.985 } : {}}
                className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[13px] rounded-xl shadow-lg shadow-blue-600/30 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-4!">
                {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending OTPs…</> : <>Continue <ArrowRight className="h-3.5 w-3.5" /></>}
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="space-y-3">
              <ErrorBanner errors={errors} />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/15 border border-blue-500/25">
                  <Mail className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="text-[11px] text-blue-300 font-medium truncate">{form.email}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25">
                  <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-emerald-300 font-medium truncate">{form.phone}</span>
                </div>
              </div>
              <OtpField label="Email OTP" value={emailOtp} onChange={setEmailOtp} note="Auto-filled" />
              <OtpField label="Mobile OTP" value={phoneOtp} onChange={setPhoneOtp} note="Auto-filled" />
              <motion.button type="button" disabled={loading}
                whileHover={!loading ? { scale: 1.012 } : {}} whileTap={!loading ? { scale: 0.985 } : {}}
                onClick={handleStep2}
                className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[13px] rounded-xl shadow-lg shadow-blue-600/30 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Verifying…</> : <>Verify Both OTPs <ArrowRight className="h-3.5 w-3.5" /></>}
              </motion.button>
              <div className="flex items-center justify-between">
                <button onClick={resendBoth} disabled={timer > 0 || loading}
                  className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-blue-400 disabled:opacity-40 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" />{timer > 0 ? `Resend in ${timer}s` : "Resend OTPs"}
                </button>
                <button onClick={() => setStep(1)} className="text-[12px] text-white/30 hover:text-white/60 transition-colors">← Back</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="space-y-3">
              <ErrorBanner errors={errors} />
              <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/25 rounded-xl px-3 py-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-[12px] text-emerald-300 font-medium">Email &amp; mobile verified</span>
              </div>
              <Field id="agencyName" label="Agency / Consultancy Name" value={form.agencyName}
                onChange={v => up("agencyName", v)} placeholder="e.g. Kerala Manpower Services"
                error={errors.agencyName} rightEl={<Building2 className="h-4 w-4 text-white/30" />}
              />
              <div>
                <label className="block text-[11px] font-bold text-white/40 mb-1 uppercase tracking-widest">District</label>
                <div className="relative">
                  <select value={form.district} onChange={e => up("district", e.target.value)}
                    className="auth-input w-full h-10 pl-3.5 pr-9 rounded-xl text-[13px] outline-none transition-all appearance-none cursor-pointer border border-white/10 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 [&>option]:bg-[#0d1525] [&>option]:text-white">
                    <option value="">Select your district</option>
                    {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <motion.button type="button" disabled={loading}
                whileHover={!loading ? { scale: 1.012 } : {}} whileTap={!loading ? { scale: 0.985 } : {}}
                onClick={handleStep3}
                className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[13px] rounded-xl shadow-lg shadow-blue-600/30 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account…</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Create Free Account</>}
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* Below card */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-[12px] text-white/30">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in</Link>
      </motion.p>
    </div>
  );
}
