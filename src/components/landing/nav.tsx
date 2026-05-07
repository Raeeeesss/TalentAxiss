"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Product",   href: "#features"     },
  { label: "Pricing",   href: "#pricing"      },
  { label: "Customers", href: "#testimonials" },
  { label: "FAQ",       href: "#faq"          },
];

export function LandingNav() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-slate-900/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[60px]">

          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-[11px] font-black text-white tracking-tighter">TA</span>
            </div>
            <span className="text-slate-900 font-semibold text-[15px] tracking-tight">TalentAxiss</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a key={l.label} href={l.href}
                className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login"
              className="text-[13px] text-slate-500 hover:text-slate-800 font-medium px-3 py-2 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/register"
              className="text-[13px] font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/25">
              Get started
            </Link>
          </div>

          <button className="md:hidden text-slate-500 hover:text-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[60px] inset-x-0 z-40 bg-white border-b border-slate-200 shadow-lg">
            <div className="px-6 py-5 flex flex-col">
              {links.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="text-slate-600 hover:text-slate-900 font-medium py-3 text-[15px] transition-colors border-b border-slate-100 last:border-0">
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Sign in
                  </button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                    Get started free
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
