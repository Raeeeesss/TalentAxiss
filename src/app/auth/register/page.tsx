"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform, animate,
} from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap, Eye, EyeOff, Mail, Lock, User, Building2, Phone,
  ArrowRight, CheckCircle2, RefreshCw, Shield, AlertTriangle,
  Brain, GitBranch, Bell, BarChart3, Globe, Star, Users,
  TrendingUp, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { KERALA_DISTRICTS } from "@/lib/utils";

const STEPS = ["Your Info", "Verify OTPs", "Agency Info"] as const;

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref     = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const ctrl = animate(0, to, {
          duration: 2, ease: [.22, 1, .36, 1],
          onUpdate: (v) => setVal(Math.round(v)),
        });
        return () => ctrl.stop();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString("en-IN")}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────
   FLOATING LABEL INPUT
───────────────────────────────────────────────────────────── */
interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
function AuthInput({ id, label, type = "text", value, onChange, icon, rightElement, error, autoComplete, onKeyDown }: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div className="relative">
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
        error
          ? "border-red-300 bg-red-50"
          : focused
          ? "border-indigo-400 bg-white ring-4 ring-indigo-100/60 shadow-sm"
          : "border-gray-200 bg-gray-50 hover:border-gray-300"
      }`}>
        <span className={`absolute left-3.5 transition-colors duration-200 ${
          error ? "text-red-400" : focused ? "text-indigo-500" : "text-gray-400"
        }`}>
          {icon}
        </span>
        <input
          id={id} type={type} value={value} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="peer w-full h-14 pl-10 pr-10 bg-transparent text-gray-900 text-sm outline-none placeholder-transparent"
          placeholder={label}
        />
        <label htmlFor={id} className={`absolute left-10 pointer-events-none font-medium transition-all duration-200 ${
          lifted ? "top-2 text-[10px] text-indigo-600" : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
        }`}>
          {label}
        </label>
        {rightElement && (
          <span className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors">{rightElement}</span>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500 mt-1.5 ml-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LEFT BRAND PANEL
───────────────────────────────────────────────────────────── */
const features = [
  { icon: Brain,    text: "AI CV Parsing — auto-fills 20+ fields"        },
  { icon: Zap,      text: "Smart Matching — rank 1,000s in seconds"       },
  { icon: GitBranch,text: "Kanban Pipeline — 7-stage drag-drop board"     },
  { icon: Bell,     text: "Follow-up Automation — zero missed interviews" },
  { icon: Globe,    text: "Gulf Recruitment Mode — passport tracking"     },
  { icon: BarChart3,text: "Real-time Analytics — revenue & placements"    },
];

function BrandPanel({ step }: { step: number }) {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col items-center justify-center px-10 xl:px-14 py-12 overflow-hidden min-h-screen"
      style={{ background: "linear-gradient(145deg, #060d1f 0%, #0d1535 45%, #1a1060 100%)" }}
    >
      {/* Animated blobs */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 blur-[90px] rounded-full pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-violet-600/15 blur-[80px] rounded-full pointer-events-none animate-float" />
      <div className="absolute top-2/3 right-1/3 w-48 h-48 bg-cyan-600/10 blur-[70px] rounded-full pointer-events-none animate-float-slow" />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold gradient-text">TalentAxiss</span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .15 }}
          className="mb-8"
        >
          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-3">
            Join Kerala&apos;s #1
            <br />
            <span className="gradient-text">AI Recruitment CRM</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            7-day free trial. No credit card required.
            Cancel anytime. Start placing candidates faster in minutes.
          </p>
        </motion.div>

        {/* Step progress tracker */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
          className="bg-white/6 border border-white/10 rounded-2xl p-4 mb-7"
        >
          <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mb-3">Setup progress</div>
          <div className="space-y-2.5">
            {STEPS.map((label, i) => {
              const s = i + 1;
              const done = s < step;
              const current = s === step;
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    done    ? "bg-emerald-500"
                    : current ? "bg-indigo-600 ring-4 ring-indigo-500/25"
                    : "bg-white/10"
                  }`}>
                    {done
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      : <span className="text-[10px] font-bold text-white">{s}</span>
                    }
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium transition-colors ${
                      current ? "text-white" : done ? "text-emerald-400" : "text-white/30"
                    }`}>
                      {label}
                    </div>
                  </div>
                  {current && (
                    <motion.div
                      layoutId="step-indicator"
                      className="text-[9px] text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold"
                    >
                      In Progress
                    </motion.div>
                  )}
                  {done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Feature list */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}
          className="space-y-2.5 mb-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .4 + i * .07 }}
              className="flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                <f.icon className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-sm text-white/60">{f.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55 }}
          className="grid grid-cols-3 gap-2.5 mb-6"
        >
          {[
            { icon: Users,      value: 156,   suffix: "+",   label: "Agencies"   },
            { icon: Upload,     value: 12847, suffix: "+",   label: "CVs Parsed" },
            { icon: TrendingUp, value: 94,    suffix: "%",   label: "Success Rate"},
          ].map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="bg-white/6 border border-white/10 rounded-2xl p-3 text-center">
              <Icon className="h-3.5 w-3.5 text-indigo-400 mx-auto mb-1.5" />
              <div className="text-base font-extrabold text-white tabular-nums">
                <Counter to={value} suffix={suffix} />
              </div>
              <div className="text-[9px] text-white/40 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonial */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}
          className="bg-white/6 border border-white/10 rounded-2xl p-4"
        >
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />)}
          </div>
          <p className="text-white/60 text-xs leading-relaxed italic mb-3">
            &ldquo;TalentAxiss transformed our agency. We placed 40% more candidates in the first month
            and AI matching saved us hours every day.&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow">SK</div>
            <div>
              <div className="text-[10px] font-semibold text-white">Suresh Kumar</div>
              <div className="text-[9px] text-white/40">MD, Cochin Job Services · Kochi</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP INDICATOR (right panel top)
───────────────────────────────────────────────────────────── */
function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((label, i) => {
        const s = i + 1;
        const done = s < step;
        const cur  = s === step;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                done ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                : cur  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-4 ring-indigo-100"
                : "bg-gray-100 text-gray-400"
              }`}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              <span className={`text-xs font-semibold hidden sm:block whitespace-nowrap transition-colors ${
                cur ? "text-gray-900" : done ? "text-emerald-600" : "text-gray-300"
              }`}>
                {label}
              </span>
            </div>
            {s < STEPS.length && (
              <div className="flex-1 h-px mx-3 transition-all duration-500 rounded-full overflow-hidden bg-gray-100">
                <motion.div
                  className="h-full bg-emerald-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: .4 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   OTP INPUT — large centered code box
───────────────────────────────────────────────────────────── */
function OtpBox({
  label, value, onChange, icon, iconColor, note,
}: {
  label: string; value: string; onChange: (v: string) => void;
  icon: React.ReactNode; iconColor: string; note?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={iconColor}>{icon}</span>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {note && <span className="ml-auto text-[10px] text-gray-400">{note}</span>}
      </div>
      <div className={`relative rounded-xl border-2 transition-all duration-200 ${
        focused
          ? "border-indigo-400 ring-4 ring-indigo-100/60"
          : value.length === 6
          ? "border-emerald-400 bg-emerald-50/30"
          : "border-gray-200 bg-gray-50 hover:border-gray-300"
      }`}>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={6}
          placeholder="• • • • • •"
          className="w-full h-14 text-center text-2xl font-bold tracking-[0.5em] bg-transparent text-gray-900 outline-none placeholder:text-gray-300 placeholder:tracking-[0.35em] placeholder:text-base placeholder:font-normal"
        />
        {value.length === 6 && (
          <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN REGISTER PAGE
───────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [timer, setTimer]       = useState(0);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [regError, setRegError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    agencyName: "", district: "",
  });
  const up = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  /* Mouse-follow glow */
  const panelRef = useRef<HTMLDivElement>(null);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(glowX, { stiffness: 120, damping: 30 });
  const springY = useSpring(glowY, { stiffness: 120, damping: 30 });
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const h = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      glowX.set(e.clientX - r.left);
      glowY.set(e.clientY - r.top);
    };
    el.addEventListener("mousemove", h, { passive: true });
    return () => el.removeEventListener("mousemove", h);
  }, [glowX, glowY]);

  const handleCaps = useCallback((e: React.KeyboardEvent) => {
    setCapsLock(e.getModifierState?.("CapsLock") ?? false);
  }, []);

  /* Timer */
  const startTimer = () => {
    setTimer(60);
    const iv = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; });
    }, 1000);
  };

  /* OTP helpers */
  const sendOtp = async (type: "email" | "phone"): Promise<string> => {
    const identifier = type === "email" ? form.email : form.phone;
    const res  = await fetch("/api/otp/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, type }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Failed to send ${type} OTP`);
    return data.otp;
  };
  const verifyOtp = async (type: "email" | "phone", otp: string) => {
    const identifier = type === "email" ? form.email : form.phone;
    const res  = await fetch("/api/otp/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, type, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Invalid ${type} OTP`);
  };

  /* Step 1 validation */
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())         errs.name     = "Full name is required";
    if (!form.email.trim())        errs.email    = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim())        errs.phone    = "Mobile number is required";
    else if (form.phone.replace(/\D/g,"").length < 10) errs.phone = "Enter a valid 10-digit number";
    if (!form.password)            errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Handlers */
  const handleStep1 = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateStep1()) return;
    setLoading(true);
    setRegError(null);
    try {
      const [eCode, pCode] = await Promise.all([sendOtp("email"), sendOtp("phone")]);
      setEmailOtp(eCode);
      setPhoneOtp(pCode);
      toast.success("OTPs generated!", { description: "Both fields auto-filled below." });
      setStep(2);
      startTimer();
    } catch (err: any) {
      setRegError(err?.message || "Failed to send OTPs. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (emailOtp.length !== 6) { setErrors({ emailOtp: "Enter the 6-digit email OTP" }); return; }
    if (phoneOtp.length !== 6) { setErrors({ phoneOtp: "Enter the 6-digit mobile OTP" }); return; }
    setLoading(true);
    setRegError(null);
    try {
      await Promise.all([verifyOtp("email", emailOtp), verifyOtp("phone", phoneOtp)]);
      toast.success("Email & mobile verified!");
      setStep(3);
    } catch (err: any) {
      setRegError(err?.message || "Verification failed. Check your OTPs.");
    } finally {
      setLoading(false);
    }
  };

  const resendBoth = async () => {
    if (timer > 0 || loading) return;
    setLoading(true);
    try {
      const [eCode, pCode] = await Promise.all([sendOtp("email"), sendOtp("phone")]);
      setEmailOtp(eCode); setPhoneOtp(pCode);
      startTimer();
      toast.success("New OTPs generated and auto-filled!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    if (!form.agencyName.trim()) { setErrors({ agencyName: "Agency name is required" }); return; }
    setLoading(true);
    setRegError(null);
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    } catch (err: any) {
      setRegError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen h-screen overflow-hidden bg-white">

      {/* ── Left brand panel ─────────────────────────────── */}
      <BrandPanel step={step} />

      {/* ── Right form panel ─────────────────────────────── */}
      <div
        ref={panelRef}
        className="relative flex-1 flex flex-col items-center justify-center bg-[#fafbff] px-4 sm:px-8 py-10 overflow-auto"
      >
        {/* Mouse glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useTransform(
              [springX, springY],
              ([x, y]) => `radial-gradient(700px circle at ${x}px ${y}px, rgba(99,102,241,.06), transparent 80%)`
            ),
          }}
        />

        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.025) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32, scale: .97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: .7, ease: [.22, 1, .36, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-7 justify-center">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text">TalentAxiss</span>
          </Link>

          {/* Heading (changes per step) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: .25 }}
              className="mb-7"
            >
              {step === 1 && <>
                <h1 className="text-3xl font-extrabold text-gray-950 mb-1.5">Create your account</h1>
                <p className="text-gray-500 text-sm">Start your 7-day free trial. No credit card required.</p>
              </>}
              {step === 2 && <>
                <h1 className="text-3xl font-extrabold text-gray-950 mb-1.5">Verify your identity</h1>
                <p className="text-gray-500 text-sm">We&apos;ve auto-generated OTPs for your email and mobile.</p>
              </>}
              {step === 3 && <>
                <h1 className="text-3xl font-extrabold text-gray-950 mb-1.5">Set up your agency</h1>
                <p className="text-gray-500 text-sm">Almost there — tell us about your consultancy.</p>
              </>}
            </motion.div>
          </AnimatePresence>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/6 p-7">

            {/* Step bar */}
            <StepBar step={step} />

            {/* Error alert */}
            <AnimatePresence>
              {regError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />{regError}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">

              {/* ── Step 1 ── */}
              {step === 1 && (
                <motion.form
                  key="s1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: .28, ease: [.22, 1, .36, 1] }}
                  onSubmit={handleStep1}
                  className="space-y-4"
                  noValidate
                >
                  <AuthInput id="name" label="Full Name" value={form.name} onChange={(v) => up("name", v)}
                    icon={<User className="h-4 w-4" />} autoComplete="name" error={errors.name}
                  />
                  <AuthInput id="email" label="Email Address" type="email" value={form.email} onChange={(v) => up("email", v)}
                    icon={<Mail className="h-4 w-4" />} autoComplete="email" error={errors.email}
                  />
                  <AuthInput id="phone" label="Mobile Number (+91)" type="tel" value={form.phone} onChange={(v) => up("phone", v)}
                    icon={<Phone className="h-4 w-4" />} autoComplete="tel" error={errors.phone}
                  />
                  <div>
                    <AuthInput
                      id="password" label="Password (min 8 characters)" type={showPw ? "text" : "password"}
                      value={form.password} onChange={(v) => up("password", v)}
                      icon={<Lock className="h-4 w-4" />} autoComplete="new-password" error={errors.password}
                      onKeyDown={handleCaps}
                      rightElement={
                        <button type="button" onClick={() => setShowPw(!showPw)} className="p-0.5">
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                    <AnimatePresence>
                      {capsLock && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 mt-1.5">
                          <AlertTriangle className="h-3 w-3 shrink-0" />Caps Lock is on
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    type="submit" disabled={loading}
                    whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                    whileTap={!loading ? { scale: .97 } : {}}
                    className="relative w-full h-12 rounded-xl text-white font-semibold text-sm overflow-hidden btn-shine disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-indigo-500/40"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed, #0ea5e9)" }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending OTPs…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Continue <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: .28 }}
                  className="space-y-5"
                >
                  {/* Destination chips */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-100">
                      <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="text-xs text-indigo-700 font-medium truncate">{form.email}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
                      <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs text-emerald-700 font-medium truncate">{form.phone}</span>
                    </div>
                  </div>

                  <OtpBox
                    label="Email OTP" value={emailOtp} onChange={setEmailOtp}
                    icon={<Mail className="h-4 w-4" />} iconColor="text-indigo-500"
                    note="Auto-filled"
                  />

                  <OtpBox
                    label="Mobile OTP" value={phoneOtp} onChange={setPhoneOtp}
                    icon={<Phone className="h-4 w-4" />} iconColor="text-emerald-500"
                    note="Auto-filled"
                  />

                  <motion.button
                    type="button" disabled={loading}
                    whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                    whileTap={!loading ? { scale: .97 } : {}}
                    onClick={handleStep2}
                    className="relative w-full h-12 rounded-xl text-white font-semibold text-sm overflow-hidden btn-shine disabled:opacity-60 shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-indigo-500/40"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed, #0ea5e9)" }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Verifying…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" /> Verify Both OTPs
                      </span>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={resendBoth}
                      disabled={timer > 0 || loading}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {timer > 0 ? `Regenerate in ${timer}s` : "Regenerate OTPs"}
                    </button>
                    <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                      ← Back
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: .28 }}
                  className="space-y-4"
                >
                  {/* Verified badge */}
                  <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-emerald-700 font-medium">Email & mobile verified — one last step!</span>
                  </div>

                  <AuthInput
                    id="agencyName" label="Agency / Consultancy Name"
                    value={form.agencyName} onChange={(v) => up("agencyName", v)}
                    icon={<Building2 className="h-4 w-4" />} error={errors.agencyName}
                  />

                  {/* District select — styled to match inputs */}
                  <div className="relative">
                    <select
                      value={form.district}
                      onChange={(e) => up("district", e.target.value)}
                      className={`w-full h-14 pl-4 pr-10 rounded-xl border text-sm font-medium outline-none transition-all duration-200 appearance-none cursor-pointer ${
                        form.district
                          ? "border-indigo-400 bg-white ring-4 ring-indigo-100/60 text-gray-900"
                          : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      <option value="">Select your district</option>
                      {KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <motion.button
                    type="button" disabled={loading}
                    whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                    whileTap={!loading ? { scale: .97 } : {}}
                    onClick={handleStep3}
                    className="relative w-full h-12 rounded-xl text-white font-semibold text-sm overflow-hidden btn-shine disabled:opacity-60 shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-indigo-500/40"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed, #0ea5e9)" }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account…
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Create Free Account
                      </span>
                    )}
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline underline-offset-2 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-5"
          >
            {[
              { icon: Shield,       text: "SSL Encrypted"     },
              { icon: CheckCircle2, text: "GDPR Safe"         },
              { icon: Users,        text: "156+ Kerala Agencies"},
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                <Icon className="h-3 w-3 text-emerald-500" />{text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
