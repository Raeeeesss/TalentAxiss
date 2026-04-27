"use client";

import { motion } from "framer-motion";
import { CreditCard, Zap, CheckCircle2, ArrowUpRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    price: 999,
    period: "month",
    features: ["Up to 100 candidates", "2 team members", "Basic AI matching", "Follow-up reminders", "Email support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: 2499,
    period: "month",
    features: ["Unlimited candidates", "10 team members", "Advanced AI matching", "Backout risk scoring", "CV parsing (AI)", "Priority support", "Analytics dashboard"],
    highlight: true,
    badge: "Current Plan",
  },
  {
    name: "Agency+",
    price: 4999,
    period: "month",
    features: ["Everything in Pro", "Unlimited team members", "White-label branding", "API access", "Dedicated account manager", "Custom integrations"],
    highlight: false,
  },
];

const invoices = [
  { date: "01 Apr 2025", amount: 2499, status: "Paid", plan: "Pro" },
  { date: "01 Mar 2025", amount: 2499, status: "Paid", plan: "Pro" },
  { date: "01 Feb 2025", amount: 2499, status: "Paid", plan: "Pro" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-indigo-400" />
          Billing & Plans
        </h1>
        <p className="text-foreground/40 text-sm mt-0.5">Manage your subscription and payment history</p>
      </motion.div>

      {/* Current plan summary */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">Pro Plan</div>
              <div className="text-sm text-foreground/50">₹2,499/month · Renews on 1 May 2025</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Manage payment methods coming soon")}>
              Manage Payment
            </Button>
            <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/5 border-red-500/20" onClick={() => toast.info("Contact support to cancel")}>
              Cancel Plan
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Plans */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-5 flex flex-col ${plan.highlight ? "border-indigo-500/40 bg-indigo-500/5" : "border-white/8 bg-white/2"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-foreground">{plan.name}</span>
                {plan.badge && <Badge variant="info">{plan.badge}</Badge>}
              </div>
              <div className="mb-5">
                <span className="text-3xl font-bold text-foreground">₹{plan.price.toLocaleString()}</span>
                <span className="text-foreground/40 text-sm">/{plan.period}</span>
              </div>
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "outline" : "gradient"}
                size="sm"
                className="w-full"
                onClick={() => toast.info("Upgrade flow coming soon")}
                disabled={!!plan.badge}
              >
                {plan.badge ? "Current Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Invoice history */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
          <div className="flex items-center gap-2 mb-5">
            <Receipt className="h-4 w-4 text-indigo-400" />
            <h3 className="font-semibold text-foreground">Invoice History</h3>
          </div>
          <div className="space-y-2">
            {invoices.map((inv, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/6 hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground">{inv.plan} Plan — {inv.date}</div>
                    <div className="text-xs text-foreground/40">₹{inv.amount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{inv.status}</Badge>
                  <button className="text-foreground/30 hover:text-indigo-400 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
