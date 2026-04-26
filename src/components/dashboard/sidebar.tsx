"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Briefcase, GitBranch, Bell,
  AlertTriangle, BarChart3, UserCog, Settings, Zap,
  ChevronLeft, ChevronRight, LogOut, Shield, HelpCircle,
  Globe, FileText, CreditCard
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/dashboard/candidates", icon: Users, label: "Candidates" },
      { href: "/dashboard/jobs", icon: Briefcase, label: "Job Openings" },
      { href: "/dashboard/pipeline", icon: GitBranch, label: "Pipeline" },
    ],
  },
  {
    group: "Tools",
    items: [
      { href: "/dashboard/matching", icon: Zap, label: "AI Matching", badge: "AI" },
      { href: "/dashboard/followups", icon: Bell, label: "Follow-ups" },
      { href: "/dashboard/backout-risk", icon: AlertTriangle, label: "Backout Risk" },
      { href: "/dashboard/reports", icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    group: "Settings",
    items: [
      { href: "/dashboard/team", icon: UserCog, label: "Team" },
      { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[#080810] border-r border-white/6",
          "transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-lg font-bold gradient-text overflow-hidden whitespace-nowrap"
                >
                  TalentAxiss
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            className="ml-auto hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/8 text-white/40 hover:text-white transition-colors shrink-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {navItems.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <div className="px-3 mb-2">
                  <span className="text-[10px] font-semibold text-white/20 uppercase tracking-widest">
                    {group.group}
                  </span>
                </div>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150 group relative",
                          active
                            ? "bg-indigo-500/15 text-white border-r-2 border-indigo-500"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        <item.icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-indigo-400" : "")} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex-1 whitespace-nowrap overflow-hidden"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!collapsed && (item as any).badge && (
                          <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                            {(item as any).badge}
                          </span>
                        )}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-[#0f0f1a] border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/6 shrink-0 space-y-0.5">
          <Link href="/dashboard/support" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <HelpCircle className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Support</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
