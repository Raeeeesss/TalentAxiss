"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Briefcase, GitBranch, Bell,
  AlertTriangle, BarChart3, UserCog, Settings,
  ChevronLeft, ChevronRight, LogOut, HelpCircle, CreditCard,
} from "lucide-react";
import { Logo, LogoIcon } from "@/components/ui/logo";
import { signOut } from "next-auth/react";

const navItems = [
  {
    group: "Main",
    items: [
      { href: "/dashboard",            icon: LayoutDashboard, label: "Dashboard"   },
      { href: "/dashboard/candidates", icon: Users,            label: "Candidates"  },
      { href: "/dashboard/jobs",       icon: Briefcase,        label: "Job Openings"},
      { href: "/dashboard/pipeline",   icon: GitBranch,        label: "Pipeline"    },
    ],
  },
  {
    group: "Tools",
    items: [
      { href: "/dashboard/matching",     icon: Zap,           label: "AI Matching", badge: "AI" },
      { href: "/dashboard/followups",    icon: Bell,          label: "Follow-ups"               },
      { href: "/dashboard/backout-risk", icon: AlertTriangle, label: "Backout Risk"              },
      { href: "/dashboard/reports",      icon: BarChart3,     label: "Analytics"                 },
    ],
  },
  {
    group: "Settings",
    items: [
      { href: "/dashboard/team",     icon: UserCog,  label: "Team"      },
      { href: "/dashboard/billing",  icon: CreditCard, label: "Billing" },
      { href: "/dashboard/settings", icon: Settings, label: "Settings"  },
      { href: "/dashboard/profile",  icon: UserCog,  label: "My Profile"},
    ],
  },
];

export function DashboardSidebar() {
  const pathname   = usePathname();
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
            className="fixed inset-0 z-30 bg-gray-900/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white border-r border-gray-100 shadow-sm",
          "transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0 overflow-hidden">
            {/* Mark — height 26 → width ≈34, fits collapsed sidebar */}
            <LogoIcon size={26} />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="font-bold tracking-tight leading-none" style={{ fontSize: "1.05rem", letterSpacing: "-0.03em" }}>
                    <span style={{ color: "#0f2440" }}>Talent</span>
                    <span style={{ color: "#c9a84c" }}>Axiss</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          <button
            className="ml-auto hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft  className="h-4 w-4" />
            }
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
          {navItems.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <div className="px-3 mb-1.5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    {group.group}
                  </span>
                </div>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                          active
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4.5 w-4.5 shrink-0",
                            active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                          )}
                        />
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
                          <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                            {(item as any).badge}
                          </span>
                        )}
                        {/* Collapsed tooltip */}
                        {collapsed && (
                          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
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
        <div className="p-2 border-t border-gray-100 shrink-0 space-y-0.5">
          <Link
            href="/dashboard/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            <HelpCircle className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Support</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
