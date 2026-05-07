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
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-[#0B0B0F]/95 backdrop-blur-xl border-b border-white/[0.07]" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[60px]">

          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-amber-400 flex items-center justify-center">
              <span className="text-[10px] font-black text-black tracking-tighter leading-none">TA</span>
            </div>
            <span className="text-white font-semibold text-[15px] tracking-[-0.01em]">TalentAxiss</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="text-[13px] text-white/40 hover:text-white/80 transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login"
              className="text-[13px] text-white/40 hover:text-white/70 font-medium px-3 py-2 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/register"
              className="text-[13px] font-semibold bg-white text-[#0B0B0F] px-4 py-[7px] rounded-[8px] hover:bg-white/90 transition-colors">
              Get started
            </Link>
          </div>

          <button className="md:hidden text-white/50 hover:text-white transition-colors"
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
            className="fixed top-[60px] inset-x-0 z-40 bg-[#0B0B0F] border-b border-white/[0.07]">
            <div className="px-6 py-5 flex flex-col gap-0.5">
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="text-white/50 hover:text-white font-medium py-3 text-[15px] transition-colors">
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 border border-white/10 rounded-[8px] text-sm font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors">
                    Sign in
                  </button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 bg-white text-black rounded-[8px] text-sm font-semibold hover:bg-white/90 transition-colors">
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
