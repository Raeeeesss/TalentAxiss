"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { Menu, X, Zap, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Features",     href: "#features"     },
  { label: "Solution",     href: "#solution"     },
  { label: "Pricing",      href: "#pricing"      },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ",          href: "#faq"          },
];

export function LandingNav() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      {/* Scroll progress bar — sits above everything */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%", background: "linear-gradient(90deg,#4f46e5,#7c3aed,#0ea5e9)", boxShadow: "0 0 8px rgba(99,102,241,.5)" }}
        className="fixed top-0 left-0 right-0 h-0.5 z-9999 pointer-events-none"
      />

      {/* Nav */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .65, ease: [.22, 1, .36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/88 backdrop-blur-2xl border-b border-gray-100 shadow-sm shadow-gray-900/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: .2 }}
                className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              >
                <Zap className="h-4 w-4 text-white" />
              </motion.div>
              <span className="text-xl font-extrabold gradient-text">TalentAxiss</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors relative group py-1"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-linear-to-r from-indigo-600 to-purple-600 transition-all duration-200 group-hover:w-full rounded-full" />
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link href="/auth/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: .97 }}
                  className="h-9 px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/auth/register">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: .96 }}
                  className="group h-9 px-5 bg-gray-950 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-gray-900/20 btn-shine overflow-hidden inline-flex items-center gap-1.5 transition-colors"
                >
                  Start Free Trial
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: .92 }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 bg-white/80 backdrop-blur"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: .28 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/97 backdrop-blur-2xl border-b border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * .06 }}
                  className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 font-medium py-3 px-3 rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-gray-100">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 bg-gray-950 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                    Start Free Trial
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
