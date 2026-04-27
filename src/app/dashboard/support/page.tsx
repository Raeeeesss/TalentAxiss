"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Book, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const faqs = [
  { q: "How do I add a new candidate?", a: "Go to Candidates → Add Candidate, or click the 'Add Candidate' button in the top header. You can fill in the form manually or upload a CV for AI auto-fill." },
  { q: "How does the AI matching work?", a: "The AI Matching engine compares candidate skills, experience, salary expectations, and location against your job requirements. It scores candidates 0–100 and groups them into Best Fit, Good Fit, and Trainable Fit tiers." },
  { q: "What is Backout Risk?", a: "The Backout Risk score predicts the likelihood of a candidate not joining after accepting an offer. Factors include response delay, multiple offers in hand, salary gap, and notice period length." },
  { q: "How do I post a job opening?", a: "Go to Job Openings → Post New Job. Fill in the job title, company, skills required, salary range, and experience. The system will immediately start matching candidates." },
  { q: "Can I add my team members?", a: "Yes. Go to Team from the sidebar. You can invite recruiters and set their role (Owner, Manager, or Recruiter). Each recruiter can manage their own candidates." },
  { q: "How do I export candidate profiles?", a: "Open any candidate profile and click 'Edit' to access download options. Bulk export is available in the Analytics → Reports section." },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) { toast.error("Please fill in all fields"); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setForm({ subject: "", message: "" });
    toast.success("Message sent! We'll reply within 24 hours.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-indigo-400" />
          Help & Support
        </h1>
        <p className="text-foreground/40 text-sm mt-0.5">Find answers or contact our team</p>
      </motion.div>

      {/* Quick links */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-3">
        {[
          { icon: Book, label: "Documentation", desc: "Guides and how-to articles", color: "text-indigo-400" },
          { icon: MessageCircle, label: "Live Chat", desc: "Chat with support (9am–6pm IST)", color: "text-emerald-400" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/8 bg-white/2 p-5 cursor-pointer hover:border-white/15 hover:bg-white/3 transition-all">
            <item.icon className={`h-6 w-6 ${item.color} mb-3`} />
            <div className="font-semibold text-foreground text-sm">{item.label}</div>
            <div className="text-xs text-foreground/40 mt-0.5">{item.desc}</div>
          </div>
        ))}
      </motion.div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
          <h3 className="font-semibold text-foreground mb-5">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-foreground/80">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-foreground/40 shrink-0" /> : <ChevronDown className="h-4 w-4 text-foreground/40 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-foreground/50 leading-relaxed border-t border-white/6 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact form */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <form onSubmit={send} className="rounded-2xl border border-white/8 bg-white/2 p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Contact Support</h3>
          <p className="text-xs text-foreground/40">We typically respond within 24 hours on business days.</p>

          <div>
            <label className="text-sm text-foreground/60 mb-1.5 block">Subject</label>
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Describe your issue briefly" />
          </div>
          <div>
            <label className="text-sm text-foreground/60 mb-1.5 block">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe the issue in detail..."
              rows={5}
              className="flex w-full rounded-xl border border-border bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>
          <Button type="submit" variant="gradient" loading={sending}>
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
