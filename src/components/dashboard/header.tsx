"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Bell, Search, Plus, ChevronDown, Sun, Moon, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

export function DashboardHeader() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const initials = getInitials(userName);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-white/6 bg-[#050508]/90 backdrop-blur-xl">
      <div className="flex items-center h-full gap-3 px-4 sm:px-6">

        {/* Search — grows to fill available space */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Search candidates, jobs, skills..."
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9 max-w-md"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Date chip — hidden on small screens */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-white/30 bg-white/4 border border-white/6 rounded-lg px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {today}
          </div>

          {/* Add Candidate — hidden on mobile */}
          <Link href="/dashboard/candidates/new" className="hidden sm:block">
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </Link>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            {mounted
              ? theme === "dark"
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              : <Sun className="h-4 w-4" />
            }
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-xl border border-white/8 bg-white/3 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#050508]" />
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d0d1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-3 z-50">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">Mark all read</span>
                  </div>
                  {[
                    { text: "Interview tomorrow: Rajan K. at 10am", time: "1h ago", color: "bg-blue-400" },
                    { text: "Offer pending: Priya M. — 3 days to decide", time: "2h ago", color: "bg-amber-400" },
                    { text: "New AI match: 96% fit for Accountant role", time: "4h ago", color: "bg-indigo-400" },
                    { text: "Follow-up overdue: Mohammed R. — 2 days", time: "6h ago", color: "bg-red-400" },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-white/4 cursor-pointer transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/70 leading-snug">{n.text}</div>
                        <div className="text-xs text-white/25 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-white/6 mt-2 pt-2">
                    <Link
                      href="/dashboard/notifications"
                      className="block text-center text-xs text-indigo-400 hover:text-indigo-300 py-1 transition-colors"
                      onClick={() => setNotifOpen(false)}
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-all"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-white/10">
                {initials}
              </div>
              {/* Name + role — hidden on small screens */}
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-white leading-tight truncate max-w-30">
                  {userName}
                </div>
                <div className="text-xs text-white/35 leading-tight">Agency Admin</div>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-white/30 hidden md:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0d0d1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-2 z-50">
                  {/* Profile info */}
                  <div className="px-3 py-2.5 border-b border-white/6 mb-1">
                    <div className="text-sm font-semibold text-white">{userName}</div>
                    <div className="text-xs text-white/35 truncate">{userEmail}</div>
                  </div>
                  {[
                    { label: "My Profile", href: "/dashboard/settings" },
                    { label: "Team Settings", href: "/dashboard/team" },
                    { label: "Billing", href: "/dashboard/billing" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/6 mt-1 pt-1">
                    <Link
                      href="/api/auth/signout"
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                    >
                      Sign Out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
