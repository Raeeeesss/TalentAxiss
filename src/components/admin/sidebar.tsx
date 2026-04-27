"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Building2, Users, CreditCard, Settings,
  BarChart3, Bell, Shield, FileText, HelpCircle, LogOut,
  Brain, DollarSign, Activity, Zap
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { group: "Overview", items: [
    { href: "/admin", icon: LayoutDashboard, label: "Command Center" },
    { href: "/admin/analytics", icon: BarChart3, label: "Platform Analytics" },
    { href: "/admin/activity", icon: Activity, label: "Activity Logs" },
  ]},
  { group: "Agencies", items: [
    { href: "/admin/agencies", icon: Building2, label: "All Agencies" },
    { href: "/admin/users", icon: Users, label: "All Users" },
  ]},
  { group: "Revenue", items: [
    { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { href: "/admin/revenue", icon: DollarSign, label: "Revenue" },
    { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  ]},
  { group: "Platform", items: [
    { href: "/admin/ai-usage", icon: Brain, label: "AI Usage" },
    { href: "/admin/notifications", icon: Bell, label: "Broadcast" },
    { href: "/admin/support", icon: HelpCircle, label: "Support" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]},
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#030305] border-r border-amber-500/10 flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-amber-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Shield className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">Super Admin</div>
            <div className="text-xs text-amber-500/60">TalentAxiss Control</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navItems.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-1.5">
              <span className="text-[10px] font-semibold text-foreground/20 uppercase tracking-widest">{group.group}</span>
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
                        active
                          ? "bg-amber-500/15 text-amber-400 border-r-2 border-amber-500"
                          : "text-foreground/40 hover:text-foreground hover:bg-white/4"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-amber-400" : "")} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-amber-500/10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground/30 hover:text-foreground hover:bg-white/4 transition-all mb-1">
          <Zap className="h-4 w-4 shrink-0" />
          Agency Dashboard
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
