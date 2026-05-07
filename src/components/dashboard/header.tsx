"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Search, Plus, ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

export function DashboardHeader() {
  const { data: session }              = useSession();
  const [notifOpen, setNotifOpen]      = useState(false);
  const [profileOpen, setProfileOpen]  = useState(false);

  const userName  = session?.user?.name  || "User";
  const userEmail = session?.user?.email || "";
  const initials  = getInitials(userName);
  const today     = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-gray-100 bg-white/90 backdrop-blur-xl shadow-sm shadow-gray-900/3">
      <div className="flex items-center h-full gap-3 pl-14 pr-4 sm:px-6 lg:pl-6">

        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Search candidates, jobs, skills..."
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9 max-w-md bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Date chip */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {today}
          </div>

          {/* Add candidate */}
          <Link href="/dashboard/candidates/new" className="hidden sm:block">
            <Button size="sm" className="bg-gray-950 hover:bg-gray-800 text-white shadow-sm">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-900/10 p-3 z-50">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-sm font-semibold text-gray-900">Notifications</span>
                    <span className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-500">Mark all read</span>
                  </div>
                  {[
                    { text: "Interview tomorrow: Rajan K. at 10am",        time: "1h ago", color: "bg-blue-500"   },
                    { text: "Offer pending: Priya M. — 3 days to decide",  time: "2h ago", color: "bg-amber-500"  },
                    { text: "New AI match: 96% fit for Accountant role",   time: "4h ago", color: "bg-indigo-500" },
                    { text: "Follow-up overdue: Mohammed R. — 2 days",     time: "6h ago", color: "bg-red-500"    },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-700 leading-snug">{n.text}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      href="/dashboard/notifications"
                      className="block text-center text-xs text-indigo-600 hover:text-indigo-500 py-1 transition-colors"
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
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-gray-100">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-gray-900 leading-tight truncate max-w-30">
                  {userName}
                </div>
                <div className="text-xs text-gray-400 leading-tight">Agency Admin</div>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-gray-400 hidden md:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-900/10 p-2 z-50">
                  <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                    <div className="text-sm font-semibold text-gray-900">{userName}</div>
                    <div className="text-xs text-gray-400 truncate">{userEmail}</div>
                  </div>
                  {[
                    { label: "My Profile",    href: "/dashboard/profile" },
                    { label: "Team Settings", href: "/dashboard/team"    },
                    { label: "Billing",       href: "/dashboard/billing" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/api/auth/signout"
                      className="flex items-center px-3 py-2 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
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
