"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
  subtitle?: string;
}

export function StatCard({ title, value, change, icon, gradient, delay = 0, subtitle }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:shadow-gray-900/8 transition-all cursor-default"
    >
      {/* Subtle gradient tint in top-right corner */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${gradient}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${gradient} shadow-sm`}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
              change >= 0
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-red-50 text-red-600 border border-red-100"
            )}>
              {change >= 0
                ? <TrendingUp   className="h-3 w-3" />
                : <TrendingDown className="h-3 w-3" />
              }
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 mt-1">{title}</div>
          {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
        </div>
      </div>
    </motion.div>
  );
}
