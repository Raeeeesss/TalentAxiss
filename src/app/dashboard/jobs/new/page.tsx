"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { JOB_CATEGORIES, KERALA_DISTRICTS } from "@/lib/utils";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
    <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-5">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="text-sm text-foreground/60 mb-1.5 block">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const selectClass = "flex h-10 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const textareaClass = "flex w-full rounded-xl border border-border bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[100px] resize-none";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    title: "", company: "", location: "", district: "", isGulf: false,
    category: "", status: "OPEN",
    minExperience: "", maxExperience: "",
    minSalary: "", maxSalary: "", vacancies: "1",
    skills: [] as string[],
    urgency: "Normal",
    description: "", requirements: "",
    contactPerson: "", contactPhone: "", contactEmail: "",
  });

  const up = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) up("skills", [...form.skills, s]);
    setSkillInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company) { toast.error("Title and company are required"); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        minExperience: form.minExperience ? parseFloat(form.minExperience) : null,
        maxExperience: form.maxExperience ? parseFloat(form.maxExperience) : null,
        minSalary: form.minSalary ? parseFloat(form.minSalary) : null,
        maxSalary: form.maxSalary ? parseFloat(form.maxSalary) : null,
        vacancies: parseInt(form.vacancies) || 1,
      };
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to post job");
      toast.success("Job posted successfully!");
      router.push("/dashboard/jobs");
    } catch {
      toast.error("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/jobs">
            <button type="button" className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-white/8 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Post New Job</h1>
            <p className="text-foreground/40 text-sm">Add a new job opening for AI matching</p>
          </div>
        </div>
        <Button type="submit" variant="gradient" size="sm" loading={loading}>
          <Save className="h-4 w-4" />
          Post Job
        </Button>
      </motion.div>

      {/* Job basics */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Job Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Job Title" required>
              <Input placeholder="e.g. Senior Accountant" value={form.title} onChange={(e) => up("title", e.target.value)} required />
            </Field>
            <Field label="Company / Client Name" required>
              <Input placeholder="e.g. Kerala Tiles Ltd" value={form.company} onChange={(e) => up("company", e.target.value)} required />
            </Field>
            <Field label="Category">
              <select className={selectClass} value={form.category} onChange={(e) => up("category", e.target.value)}>
                <option value="">Select Category</option>
                {JOB_CATEGORIES.map((c) => <option key={c} className="bg-[#0a0a12]">{c}</option>)}
              </select>
            </Field>
            <Field label="Urgency">
              <select className={selectClass} value={form.urgency} onChange={(e) => up("urgency", e.target.value)}>
                <option className="bg-[#0a0a12]">Normal</option>
                <option className="bg-[#0a0a12]">Urgent</option>
                <option className="bg-[#0a0a12]">Low</option>
              </select>
            </Field>
            <Field label="Number of Vacancies">
              <Input type="number" min={1} value={form.vacancies} onChange={(e) => up("vacancies", e.target.value)} />
            </Field>
            <Field label="Status">
              <select className={selectClass} value={form.status} onChange={(e) => up("status", e.target.value)}>
                <option value="OPEN" className="bg-[#0a0a12]">Open</option>
                <option value="HOLD" className="bg-[#0a0a12]">On Hold</option>
              </select>
            </Field>
          </div>
        </Section>
      </motion.div>

      {/* Location */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Section title="Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/2">
              <input type="checkbox" id="gulf" checked={form.isGulf} onChange={(e) => up("isGulf", e.target.checked)} className="w-4 h-4 rounded" />
              <label htmlFor="gulf" className="text-sm text-foreground/70 cursor-pointer">Gulf / Overseas Job 🌏</label>
            </div>
            <Field label="Location / City">
              <Input placeholder={form.isGulf ? "e.g. Dubai, Riyadh" : "e.g. Kochi"} value={form.location} onChange={(e) => up("location", e.target.value)} />
            </Field>
            {!form.isGulf && (
              <Field label="District">
                <select className={selectClass} value={form.district} onChange={(e) => up("district", e.target.value)}>
                  <option value="">Select District</option>
                  {KERALA_DISTRICTS.map((d) => <option key={d} className="bg-[#0a0a12]">{d}</option>)}
                </select>
              </Field>
            )}
          </div>
        </Section>
      </motion.div>

      {/* Experience & Salary */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
        <Section title="Experience & Salary">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Min Experience (yrs)">
              <Input type="number" step="0.5" placeholder="0" value={form.minExperience} onChange={(e) => up("minExperience", e.target.value)} />
            </Field>
            <Field label="Max Experience (yrs)">
              <Input type="number" step="0.5" placeholder="10" value={form.maxExperience} onChange={(e) => up("maxExperience", e.target.value)} />
            </Field>
            <Field label="Min Salary (₹/mo)">
              <Input type="number" placeholder="25000" value={form.minSalary} onChange={(e) => up("minSalary", e.target.value)} />
            </Field>
            <Field label="Max Salary (₹/mo)">
              <Input type="number" placeholder="50000" value={form.maxSalary} onChange={(e) => up("maxSalary", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      {/* Skills */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <Section title="Required Skills">
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Type a required skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 text-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                {s}
                <button type="button" onClick={() => up("skills", form.skills.filter((x) => x !== s))}>
                  <X className="h-3 w-3 hover:text-foreground" />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && <p className="text-xs text-foreground/30">No skills added yet</p>}
          </div>
        </Section>
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
        <Section title="Job Description">
          <div className="space-y-4">
            <Field label="Job Description">
              <textarea className={textareaClass} placeholder="Describe the role, responsibilities, and company..." value={form.description} onChange={(e) => up("description", e.target.value)} />
            </Field>
            <Field label="Requirements / Qualifications">
              <textarea className={textareaClass} placeholder="List must-have qualifications, certifications, etc." value={form.requirements} onChange={(e) => up("requirements", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section title="Client Contact (Internal)">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Contact Person">
              <Input placeholder="HR Manager name" value={form.contactPerson} onChange={(e) => up("contactPerson", e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => up("contactPhone", e.target.value)} />
            </Field>
            <Field label="Email">
              <Input type="email" placeholder="hr@client.com" value={form.contactEmail} onChange={(e) => up("contactEmail", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }} className="flex gap-3 pb-8">
        <Link href="/dashboard/jobs">
          <Button type="button" variant="outline" size="lg">Cancel</Button>
        </Link>
        <Button type="submit" variant="gradient" size="lg" loading={loading} className="flex-1 sm:flex-none">
          <Save className="h-4 w-4" />
          Post Job
        </Button>
      </motion.div>
    </form>
  );
}
