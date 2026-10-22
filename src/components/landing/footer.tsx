"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useContactModal } from "@/components/providers/contact-modal-provider";

const cols = [
  { head:"Product", links:[{ label:"Features", href:"#features"},{label:"AI Matching",href:"#features"},{label:"Gulf Mode",href:"#features"},{label:"Pricing",href:"#pricing"}] },
  { head:"Company", links:[{ label:"Customers", href:"#testimonials"},{label:"FAQ",href:"#faq"},{label:"Privacy",href:"#"}] },
  { head:"Get started", links:[{ label:"Create account",href:"/auth/register"},{label:"Sign in",href:"/auth/login"},{label:"Book slot",href:"/auth/register"}] },
];

export function LandingFooter() {
  const { openContactModal } = useContactModal();
  return (
    <footer className="bg-slate-900 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
                <span className="text-[9px] font-black text-white">TA</span>
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight">TalentAxiss</span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-sm mb-4">
              Recruitment CRM built for Kerala&apos;s placement consultancies.
            </p>
            <div className="inline-flex flex-col gap-1 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 max-w-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Work In Progress</span>
              </div>
              <span className="text-[12px] text-slate-300">
                Bookings are open! Contact admins directly:
              </span>
              <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-700/60 text-[12px]">
                <a href="mailto:admin@rocduert.in" className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
                  <Mail className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>admin@rocduert.in</span>
                </a>
                <a href="tel:8113029782" className="flex items-center gap-2 text-slate-200 hover:text-emerald-300 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>8113029782</span>
                </a>
              </div>
            </div>
            <p className="text-[12px] text-slate-600 mt-4">Kochi, Kerala · India</p>
          </div>

          {cols.map(col => (
            <div key={col.head}>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-5">{col.head}</div>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    {l.href.startsWith("/auth/") ? (
                      <button
                        type="button"
                        onClick={() => openContactModal(`Footer - ${l.label}`)}
                        className="text-[13px] text-slate-400 hover:text-white transition-colors font-medium cursor-pointer"
                      >
                        {l.label}
                      </button>
                    ) : (
                      <Link href={l.href} className="text-[13px] text-slate-400 hover:text-white transition-colors font-medium">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-slate-500">
            © {new Date().getFullYear()} TalentAxiss. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:admin@rocduert.in" className="text-[12px] text-slate-400 hover:text-white transition-colors">
              admin@rocduert.in
            </a>
            <span className="text-slate-700">·</span>
            <a href="tel:8113029782" className="text-[12px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              8113029782
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

