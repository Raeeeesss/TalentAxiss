"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does the 7-day free trial work?",       a: "Sign up, no credit card needed. You get full access to all Free plan features for 7 days. After the trial, you can upgrade to Pro or Max, or continue with the free tier (limited features)." },
  { q: "Can I import my existing candidate database?", a: "Yes! TalentAxiss supports CSV import for Excel/Google Sheets databases. Our system automatically maps columns and detects duplicates. Most agencies import their entire database in under 30 minutes." },
  { q: "How accurate is the AI CV parsing?",         a: "Our AI achieves 95%+ accuracy on standard CVs. It supports PDF, DOCX, and scanned images (via OCR). It can extract Gulf-specific fields like passport details, visa status, and Gulf experience." },
  { q: "Is my data secure?",                         a: "Absolutely. All data is encrypted at rest and in transit. We use enterprise-grade security with role-based access control, audit logs, and regular security audits. Your data is hosted on isolated infrastructure." },
  { q: "Can multiple staff members use TalentAxiss?", a: "Pro plan supports up to 5 team members. Max plan is unlimited. You can set granular permissions for each staff member — what they can view, edit, or delete." },
  { q: "Does it work for Gulf recruitment?",         a: "Yes! TalentAxiss has a dedicated Gulf Recruitment Mode that tracks passport numbers, expiry dates, visa status, Gulf experience by country, and medical fitness. Perfect for Kerala-to-Gulf placement agencies." },
  { q: "What payment methods are accepted?",         a: "We accept all major credit/debit cards, UPI (PhonePe, GPay, Paytm), net banking, and EMI options through Razorpay. GST invoice provided for all payments." },
  { q: "Can I cancel anytime?",                      a: "Yes, cancel anytime with no questions asked. Your data remains accessible for 30 days after cancellation for export. We offer a 7-day money-back guarantee on all paid plans." },
];

export function FAQSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="py-28 px-4 relative bg-gray-50/60">
      <div className="absolute top-0 inset-x-0 h-px mesh-divider" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-4">
            Frequently Asked
            <br />
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-500 text-lg">Everything you need to know before signing up.</p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, ease: [.22, 1, .36, 1] }}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-indigo-600" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
