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
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-white/92 backdrop-blur-xl border-b border-slate-200/70 shadow-sm shadow-slate-900/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <span className="text-[11px] font-black text-white tracking-tighter">TA</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-slate-900">
              TalentAxiss
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a key={l.label} href={l.href}
                className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login"
              className="text-[13px] font-medium px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/register"
              className="text-[13px] font-semibold bg-blue-600 text-white px-4 py-2
                rounded-lg hover:bg-blue-500 transition-colors shadow-sm shadow-blue-600/30">
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-500 hover:text-slate-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu — always white bg */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-15 inset-x-0 z-40 bg-white border-b border-slate-200 shadow-xl shadow-slate-900/10"
          >
            <div className="px-6 py-5 flex flex-col">
              {links.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="text-slate-600 hover:text-slate-900 font-medium py-3 text-[15px]
                    transition-colors border-b border-slate-100 last:border-0">
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 border border-slate-200 rounded-xl text-sm
                    font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Sign in
                  </button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 bg-blue-600 text-white rounded-xl text-sm
                    font-semibold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/25">
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
