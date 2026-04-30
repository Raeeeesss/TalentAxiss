"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform, animate,
} from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  CheckCircle2, Shield, Users, TrendingUp, Star,
  AlertTriangle, Brain,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";

/* ── Animated counter ─────────────────────────────────────── */
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
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref} className="tabular-nums">{val.toLocaleString("en-IN")}{suffix}</span>;
}

/* ── Compact dashboard mockup ─────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="w-full rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 24px 60px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.08)" }}
    >
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0f1629] border-b border-white/8">
        <div className="w-2 h-2 rounded-full bg-red-400/70" />
        <div className="w-2 h-2 rounded-full bg-amber-400/70" />
        <div className="w-2 h-2 rounded-full bg-emerald-400/70" />
        <div className="flex-1 mx-2 h-4 bg-white/8 rounded text-[8px] text-white/25 flex items-center px-2 font-mono">
          app.talentaxiss.in
        </div>
      </div>

      {/* Body */}
      <div className="bg-[#0a1020] p-3">
        {/* Top row */}
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <div className="text-white text-[10px] font-semibold">Good morning, Arun 👋</div>
            <div className="text-white/35 text-[8px]">Today's overview</div>
          </div>
          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
            ↑ 15% this month
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1.5 mb-2.5">
          {[
            { v: "1,247", l: "Candidates", c: "from-indigo-500 to-purple-600" },
            { v: "34",    l: "Active Jobs", c: "from-cyan-500 to-blue-500"    },
            { v: "7",     l: "Placed",      c: "from-emerald-500 to-teal-500" },
            { v: "12",    l: "Follow-ups",  c: "from-amber-500 to-orange-500" },
          ].map((s) => (
            <div key={s.l} className="bg-white/6 rounded-xl p-1.5 border border-white/6">
              <div className={`text-[11px] font-bold bg-linear-to-r ${s.c} bg-clip-text text-transparent`}>{s.v}</div>
              <div className="text-[7px] text-white/35 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white/4 rounded-xl p-2 border border-white/6">
          <div className="text-[7px] text-white/25 mb-1.5 font-medium">Placements — 6 months</div>
          <div className="flex items-end gap-0.5 h-8">
            {[28,44,34,58,46,72,55,84,66,92,74,98].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: .6 + i * .035, duration: .45, ease: "easeOut" }}
                className="flex-1 rounded-t-sm"
                style={{ background: "linear-gradient(to top,#6366f1,#a78bfa)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Left brand panel ─────────────────────────────────────── */
function BrandPanel() {
  return (
    <div
      className="hidden lg:flex w-[52%] h-full flex-col justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(145deg,#060d1f 0%,#0d1535 45%,#1a1060 100%)" }}
    >
      {/* Blobs — pointer-events none, won't affect layout */}
      <div className="absolute top-1/3 right-1/4  w-72 h-72 bg-indigo-600/18 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/5 w-56 h-56 bg-violet-600/12 blur-[70px] rounded-full pointer-events-none" />

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />

      {/* ── Scrollable inner content ── */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-8 xl:px-10 flex flex-col gap-5">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55 }}
        >
          <Logo size="md" onDark href="/" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, delay: .1 }}
        >
          <h2 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight mb-2">
            AI Recruitment CRM
            <br />
            <span className="gradient-text">for Modern Agencies</span>
          </h2>
          <p className="text-white/45 text-sm leading-relaxed">
            Manage candidates, run AI matching, track your pipeline &mdash; all in one platform.
          </p>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: .75, delay: .2, ease: [.22, 1, .36, 1] }}
          className="relative"
        >
          {/* Floating AI card */}
          <motion.div
            initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: .9 }}
            className="absolute -top-4 -right-3 z-10 bg-white/12 border border-white/18 backdrop-blur-md rounded-xl px-2.5 py-2 shadow-xl animate-float"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                <Brain className="h-2.5 w-2.5 text-white" />
              </div>
              <div>
                <div className="text-[9px] font-bold text-white leading-none">AI Match 96%</div>
                <div className="text-[8px] text-white/45 leading-none mt-0.5">Rajan K. — Best Fit</div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1 shrink-0" />
            </div>
          </motion.div>

          {/* Floating placement card */}
          <motion.div
            initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05 }}
            className="absolute -bottom-4 -left-3 z-10 bg-white/12 border border-white/18 backdrop-blur-md rounded-xl px-2.5 py-2 shadow-xl animate-float-delay"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <TrendingUp className="h-2.5 w-2.5 text-white" />
              </div>
              <div>
                <div className="text-[9px] font-bold text-white leading-none">3 Placed Today</div>
                <div className="text-[8px] text-emerald-400 font-semibold leading-none mt-0.5">+₹42,000 revenue</div>
              </div>
            </div>
          </motion.div>

          <DashboardMockup />
        </motion.div>

        {/* Stats row — horizontal compact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .35 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { icon: Users,      value: 156,   suffix: "+",   label: "Agencies"   },
            { icon: TrendingUp, value: 12847, suffix: "+",   label: "CVs Managed"},
            { icon: Shield,     value: 99,    suffix: ".9%", label: "Uptime"     },
          ].map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="bg-white/6 border border-white/10 rounded-xl p-2.5 text-center">
              <Icon className="h-3.5 w-3.5 text-indigo-400 mx-auto mb-1" />
              <div className="text-sm font-extrabold text-white">
                <Counter to={value} suffix={suffix} />
              </div>
              <div className="text-[8px] text-white/35 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonial — compact */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: .5 }}
          className="bg-white/6 border border-white/10 rounded-xl p-3.5"
        >
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 text-amber-400 fill-current" />)}
          </div>
          <p className="text-white/55 text-xs leading-relaxed mb-2.5 italic">
            &ldquo;Placement rate up 40% in the first month. I find any candidate in 10 seconds now.&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shadow">
              AM
            </div>
            <div>
              <div className="text-[10px] font-semibold text-white">Arun Menon</div>
              <div className="text-[8px] text-white/35">Owner, AM Consultants · Ernakulam</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Floating label input ─────────────────────────────────── */
interface AuthInputProps {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; icon: React.ReactNode;
  rightElement?: React.ReactNode; error?: string;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
function AuthInput({ id, label, type = "text", value, onChange, icon, rightElement, error, autoComplete, onKeyDown }: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
        error   ? "border-red-300 bg-red-50"
        : focused ? "border-indigo-400 bg-white ring-4 ring-indigo-100/60 shadow-sm"
        : "border-gray-200 bg-gray-50 hover:border-gray-300"
      }`}>
        <span className={`absolute left-3.5 transition-colors duration-200 ${error ? "text-red-400" : focused ? "text-indigo-500" : "text-gray-400"}`}>
          {icon}
        </span>
        <input
          id={id} type={type} value={value} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown}
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

/* ── Main LoginForm ───────────────────────────────────────── */
export function LoginForm() {
  const router  = useRouter();
  const params  = useSearchParams();

  const [loading,   setLoading]   = useState(false);
  const [showPw,    setShowPw]    = useState(false);
  const [capsLock,  setCapsLock]  = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [authError, setAuthError] = useState<string | null>(
    params.get("error") ? "Authentication failed. Please check your credentials." : null
  );
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({});

  /* Mouse glow */
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
      glowX.set(e.clientX - r.left); glowY.set(e.clientY - r.top);
    };
    el.addEventListener("mousemove", h, { passive: true });
    return () => el.removeEventListener("mousemove", h);
  }, [glowX, glowY]);

  const handleCaps = useCallback((e: React.KeyboardEvent) => {
    setCapsLock(e.getModifierState?.("CapsLock") ?? false);
  }, []);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim())                    errs.email    = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email    = "Enter a valid email address";
    if (!password)                         errs.password = "Password is required";
    else if (password.length < 8)          errs.password = "Minimum 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true); setAuthError(null);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setAuthError("Invalid email or password. Please try again.");
        toast.error("Invalid credentials");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    handleCaps(e);
    if (e.key === "Enter") handleSubmit();
  }, [email, password]);

  return (
    /* ── Root: full viewport, no scroll ── */
    <div className="flex h-screen overflow-hidden bg-white">

      <BrandPanel />

      {/* ── Right panel ─────────────────────────────────── */}
      <div
        ref={panelRef}
        className="relative flex-1 flex flex-col items-center justify-center bg-[#fafbff] overflow-y-auto"
      >
        {/* Mouse glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useTransform(
              [springX, springY],
              ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px,rgba(99,102,241,.06),transparent 80%)`
            ),
          }}
        />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.025) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: .97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: .65, ease: [.22, 1, .36, 1] }}
          className="relative z-10 w-full max-w-md px-6 py-10"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Logo size="md" onDark={false} href="/" />
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl font-extrabold text-gray-950 mb-1.5">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to manage candidates, jobs, pipeline &amp; AI hiring tools.</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {authError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />{authError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/6 p-7 mb-5">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              <AuthInput id="email" label="Email address" type="email" value={email}
                onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
                icon={<Mail className="h-4 w-4" />} autoComplete="email"
                error={errors.email} onKeyDown={handleKeyDown}
              />

              <div>
                <AuthInput id="password" label="Password" type={showPw ? "text" : "password"} value={password}
                  onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
                  icon={<Lock className="h-4 w-4" />} autoComplete="current-password"
                  error={errors.password} onKeyDown={handleKeyDown}
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

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${remember ? "bg-indigo-600 border-indigo-600" : "border-gray-300 group-hover:border-indigo-400"}`}>
                    {remember && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-600 select-none">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline underline-offset-2 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                whileTap={!loading ? { scale: .97 } : {}}
                className="relative w-full h-12 rounded-xl text-white font-semibold text-sm overflow-hidden btn-shine disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-indigo-500/40"
                style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed,#0ea5e9)" }}
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in…</span>
                  : <span className="flex items-center justify-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
                }
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400 font-medium">or continue with</span>
              </div>
            </div>

            {/* Google */}
            <motion.button type="button" whileHover={{ scale: 1.015, y: -1 }} whileTap={{ scale: .97 }}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-semibold hover:border-gray-300 hover:shadow-md hover:shadow-gray-900/6 transition-all"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            <p className="text-center text-sm text-gray-500 mt-5">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline underline-offset-2 transition-colors">
                Start free trial
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: Shield,       text: "SSL Encrypted"       },
              { icon: CheckCircle2, text: "GDPR Safe"           },
              { icon: Users,        text: "156+ Kerala Agencies" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                <Icon className="h-3 w-3 text-emerald-500" />{text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
