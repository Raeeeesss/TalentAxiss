"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router  = useRouter();
  const params  = useSearchParams();
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(
    params.get("error") ? "Authentication failed. Please check your credentials." : null
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Minimum 8 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true); setAuthError(null);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) { setAuthError("Invalid email or password."); toast.error("Invalid credentials"); }
      else { toast.success("Welcome back!"); router.push("/dashboard"); }
    } catch { setAuthError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  };

  const onKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  }, [email, password]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-50 flex items-center justify-center">
      {/* Subtle background decoration matching landing page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-105 px-5 flex flex-col gap-6">

        {/* Logo + heading */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/25">
              <span className="text-[12px] font-black text-white">TA</span>
            </div>
            <span className="font-bold text-slate-900 text-[16px] tracking-tight">TalentAxiss</span>
          </Link>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 text-[13px] mt-1">Sign in to your TalentAxiss account.</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="bg-white border border-slate-100 rounded-2xl px-8 py-7 shadow-sm">

          <AnimatePresence>
            {authError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-[12px] rounded-xl px-3.5 py-2.5 mb-5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />{authError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Email address</label>
              <input type="email" value={email} autoComplete="email" onKeyDown={onKey}
                onChange={e => { setEmail(e.target.value); setErrors(er => ({ ...er, email: undefined })); }}
                placeholder="you@company.com"
                className={`w-full h-11 px-4 rounded-xl border text-slate-900 text-[14px] outline-none transition-all placeholder:text-slate-300 ${
                  errors.email
                    ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                }`}
              />
              {errors.email && <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5"><AlertTriangle className="h-3 w-3 shrink-0" />{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-slate-600">Password</label>
                <Link href="/auth/forgot-password" className="text-[12px] text-blue-600 hover:text-blue-700 font-medium transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} autoComplete="current-password" onKeyDown={onKey}
                  onChange={e => { setPassword(e.target.value); setErrors(er => ({ ...er, password: undefined })); }}
                  placeholder="••••••••"
                  className={`w-full h-11 pl-4 pr-11 rounded-xl border text-slate-900 text-[14px] outline-none transition-all placeholder:text-slate-300 ${
                    errors.password
                      ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5"><AlertTriangle className="h-3 w-3 shrink-0" />{errors.password}</p>}
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.012 } : {}} whileTap={!loading ? { scale: 0.985 } : {}}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] rounded-xl shadow-md shadow-blue-600/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in…</>
                : <>Sign In <ArrowRight className="h-4 w-4" /></>
              }
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[12px] text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full h-11 flex items-center justify-center gap-3 border border-slate-200 rounded-xl text-slate-700 text-[14px] font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </motion.div>

        {/* Below card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex flex-col items-center gap-3">
          <p className="text-[13px] text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Start free trial →</Link>
          </p>
          <div className="flex items-center gap-5">
            {["SSL Encrypted", "GDPR Safe", "156+ Agencies"].map(t => (
              <span key={t} className="text-[11px] text-slate-400">{t}</span>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
