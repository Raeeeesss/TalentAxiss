"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Mail, Phone, Sparkles } from "lucide-react";
import { useContactModal } from "@/components/providers/contact-modal-provider";

const links = [
  { label: "Product",   href: "#features"     },
  { label: "Pricing",   href: "#pricing"      },
  { label: "Customers", href: "#testimonials" },
  { label: "FAQ",       href: "#faq"          },
];

export function LandingNav() {
  const { openContactModal } = useContactModal();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white border-b border-blue-500/20 py-2 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] sm:text-[13px]">
            <div className="flex items-center flex-wrap justify-center md:justify-start gap-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-wider uppercase border border-amber-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Work in Progress
              </span>
              <span className="font-medium text-slate-200">
                Currently work in progress. <strong className="text-white font-semibold">Bookings are started</strong> — contact admins:
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium">
              <a
                href="mailto:admin@rocduert.in"
                className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>admin@rocduert.in</span>
              </a>
              <span className="text-white/30 hidden sm:inline">|</span>
              <a
                href="tel:8113029782"
                className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>8113029782</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`transition-all duration-300 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-slate-900/5"
              : "bg-white/80 backdrop-blur-md border-b border-slate-100"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[58px]">

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
              <button
                type="button"
                onClick={() => openContactModal("Nav - Contact Admin")}
                className="text-[13px] font-medium px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-blue-500" />
                Contact Admin
              </button>
              <button
                type="button"
                onClick={() => openContactModal("Sign in")}
                className="text-[13px] font-medium px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => openContactModal("Nav - Book Slot")}
                className="text-[13px] font-semibold bg-blue-600 text-white px-4 py-2
                  rounded-lg hover:bg-blue-500 transition-colors shadow-sm shadow-blue-600/30 cursor-pointer"
              >
                Book Slot
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-slate-500 hover:text-slate-900 transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full inset-x-0 bg-white border-b border-slate-200 shadow-xl shadow-slate-900/10"
            >
              <div className="px-6 py-5 flex flex-col">
                <div
                  onClick={() => {
                    setMobileOpen(false);
                    openContactModal("Mobile Notice");
                  }}
                  className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs cursor-pointer"
                >
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Work in Progress · Bookings Started
                  </div>
                  <div className="text-amber-800/90 flex flex-col gap-1 mt-2">
                    <span className="flex items-center gap-1.5 font-semibold text-blue-700">
                      <Mail className="h-3.5 w-3.5" /> admin@rocduert.in
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <Phone className="h-3.5 w-3.5" /> 8113029782
                    </span>
                  </div>
                </div>

                {links.map(l => (
                  <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                    className="text-slate-600 hover:text-slate-900 font-medium py-3 text-[15px]
                      transition-colors border-b border-slate-100 last:border-0">
                    {l.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openContactModal("Mobile - Sign in");
                    }}
                    className="w-full h-11 border border-slate-200 rounded-xl text-sm
                      font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openContactModal("Mobile - Book Early Access");
                    }}
                    className="w-full h-11 bg-blue-600 text-white rounded-xl text-sm
                      font-semibold hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/25"
                  >
                    Book Early Access
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

