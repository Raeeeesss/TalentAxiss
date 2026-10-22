"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X, Mail, Phone, Copy, Check,
  Sparkles, ShieldCheck, ArrowRight, MessageCircle
} from "lucide-react";

interface ContactModalContextType {
  isOpen: boolean;
  actionSource: string;
  openContactModal: (source?: string) => void;
  closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}

const ADMIN_EMAIL = "admin@rocduert.in";
const ADMIN_PHONE = "8113029782";
const ADMIN_PHONE_DISPLAY = "+91 8113029782";

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionSource, setActionSource] = useState("General Inquiry");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const openContactModal = useCallback((source: string = "Early Booking") => {
    setActionSource(source);
    setIsOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeContactModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeContactModal]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/918113029782?text=${encodeURIComponent(
    `Hello TalentAxis Team, I am reaching out regarding early agency access (${actionSource}). Please share onboarding details.`
  )}`;

  const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(
    `TalentAxis Early Access Request - ${actionSource}`
  )}&body=${encodeURIComponent(
    `Hello Admin,\n\nI want to reserve early access for our recruitment agency.\n\nAgency Name:\nContact Person:\nPhone Number:\nLocation / District:\n\nThank you!`
  )}`;

  return (
    <ContactModalContext.Provider
      value={{
        isOpen,
        actionSource,
        openContactModal,
        closeContactModal,
      }}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            {/* Dark Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeContactModal}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 18 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="relative w-full max-w-[850px] bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl border border-white/80 overflow-hidden z-10 flex flex-col md:flex-row my-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closeContactModal}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f1f3f5] hover:bg-[#e2e8f0] text-slate-700 flex items-center justify-center transition-all z-30 shadow-xs cursor-pointer group"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
              </button>

              {/* ── Left Column (Content & Contact Cards) ── */}
              <div className="flex-1 p-6 sm:p-8 md:p-9 flex flex-col justify-between">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center gap-2.5 flex-wrap mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9E6] border border-[#FDE68A] text-[#B45309] text-[11px] font-bold tracking-wider uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      WORK IN PROGRESS
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[11px] font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                      Bookings Started
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-[32px] sm:text-[38px] font-black text-[#0F172A] tracking-tight leading-[1.08] mb-3">
                    Contact<br />
                    Admin for{" "}
                    <span className="bg-gradient-to-r from-[#059669] via-[#047857] to-[#0f766e] bg-clip-text text-transparent">
                      Access
                    </span>
                  </h2>

                  {/* Subtext */}
                  <p className="text-[13px] sm:text-[13.5px] text-[#64748B] leading-relaxed mb-5 max-w-[440px]">
                    TalentAxis is currently under active development. Public registrations and direct logins are invite-only while early agency onboardings are underway.
                  </p>

                  {/* Sub-header */}
                  <div className="mb-3">
                    <div className="text-[13.5px] font-bold text-[#0F172A]">
                      Get in touch with our admin team
                    </div>
                    <div className="text-[12px] text-[#94A3B8]">
                      Reserve your agency slot or request access.
                    </div>
                  </div>

                  {/* Card 1: Phone / WhatsApp */}
                  <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 mb-3 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#00A859] flex items-center justify-center text-white shadow-sm shadow-[#00A859]/25 shrink-0">
                          <Phone className="w-5 h-5 fill-white text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                            PHONE / WHATSAPP
                          </div>
                          <div className="text-[16px] sm:text-[17px] font-extrabold text-[#0F172A] tracking-tight">
                            {ADMIN_PHONE_DISPLAY}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(ADMIN_PHONE, "phone")}
                        className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:bg-slate-50 text-[12px] font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        title="Copy phone number"
                      >
                        {copiedPhone ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <a
                        href={`tel:${ADMIN_PHONE}`}
                        className="h-10 rounded-xl bg-[#0f4c3a] hover:bg-[#0c3d2e] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shadow-[#0f4c3a]/25"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white text-white" />
                        <span>Call Now</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </a>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 rounded-xl bg-[#00C853] hover:bg-[#00b54b] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shadow-[#00C853]/25"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-white" />
                        <span>WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    </div>
                  </div>

                  {/* Card 2: Official Email */}
                  <div className="rounded-2xl border border-[#DBEAFE] bg-[#F0F7FF]/50 p-3.5 sm:p-4 mb-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shadow-sm shadow-blue-500/25 shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                            OFFICIAL EMAIL
                          </div>
                          <div className="text-[15px] sm:text-[16px] font-extrabold text-[#0F172A] tracking-tight break-all">
                            {ADMIN_EMAIL}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(ADMIN_EMAIL, "email")}
                        className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:bg-slate-50 text-[12px] font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        title="Copy email address"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <a
                      href={mailtoUrl}
                      className="w-full h-10 rounded-xl bg-[#0066FF] hover:bg-[#0055d6] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Email to Admin</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Bottom Note */}
                <div className="flex items-center gap-2 text-[12px] text-[#64748B] pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Priority onboarding for Kerala agencies</span>
                </div>
              </div>

              {/* ── Right Column (3D Artwork Panel) ── */}
              <div className="relative hidden md:block w-[300px] lg:w-[325px] shrink-0 bg-[#E8E4DF] overflow-hidden">
                <Image
                  src="/early-access-banner-clean.png"
                  alt="TalentAxis Early Access Program"
                  width={317}
                  height={718}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  priority
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ContactModalContext.Provider>
  );
}
