"use client";

import { Shield, Bell, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-amber-500/10 bg-[#030305]/80 backdrop-blur-xl flex items-center gap-4 px-6">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-semibold text-foreground/60">Super Admin Panel</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-foreground/20">Last sync: just now</span>
        <Button variant="ghost" size="icon">
          <RefreshCcw className="h-4 w-4 text-foreground/40" />
        </Button>
        <button className="relative w-9 h-9 rounded-xl border border-amber-500/15 bg-amber-500/5 flex items-center justify-center text-amber-400/60 hover:text-amber-400 transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-foreground text-xs font-bold">
          SA
        </div>
      </div>
    </header>
  );
}
