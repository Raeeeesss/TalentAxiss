"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Brain, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { KERALA_DISTRICTS, GULF_COUNTRIES, JOB_CATEGORIES } from "@/lib/utils";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/8 bg-white/2 p-6">
    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="text-sm text-white/60 mb-1.5 block">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const selectClass = "flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const textareaClass = "flex w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px] resize-none";

export default function NewCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", altPhone: "", email: "",
    gender: "", dateOfBirth: "", maritalStatus: "", nationality: "Indian",
    address: "", city: "", district: "", state: "Kerala", pincode: "",
    currentRole: "", currentCompany: "", totalExperience: "",
    currentSalary: "", expectedSalary: "", noticePeriod: "",
    skills: [] as string[], languages: [] as string[],
    hasPassport: false, passportNumber: "", passportExpiry: "",
    hasDrivingLicense: false, drivingLicenseNo: "",
    gulfExperience: false, gulfCountries: [] as string[],
    category: "", source: "", notes: "", tags: "",
  });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
    }
    setSkillInput("");
  };

  const addLanguage = () => {
    const l = langInput.trim();
    if (l && !form.languages.includes(l)) {
      setForm({ ...form, languages: [...form.languages, l] });
    }
    setLangInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Candidate added successfully!");
      router.push("/dashboard/candidates");
    } catch {
      toast.error("Failed to save candidate");
    } finally {
      setLoading(false);
    }
  };

  const up = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/candidates">
            <button type="button" className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Add New Candidate</h1>
            <p className="text-white/40 text-sm">Fill in details or upload CV for AI extraction</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4" />
            Upload CV
          </Button>
          <Button type="submit" variant="gradient" size="sm" loading={loading}>
            <Save className="h-4 w-4" />
            Save Candidate
          </Button>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Personal Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Full Name" required>
              <Input placeholder="John Doe" value={form.name} onChange={(e) => up("name", e.target.value)} required />
            </Field>
            <Field label="Phone Number" required>
              <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => up("phone", e.target.value)} required />
            </Field>
            <Field label="Alt. Phone">
              <Input placeholder="+91 98765 43211" value={form.altPhone} onChange={(e) => up("altPhone", e.target.value)} />
            </Field>
            <Field label="Email">
              <Input type="email" placeholder="candidate@email.com" value={form.email} onChange={(e) => up("email", e.target.value)} />
            </Field>
            <Field label="Gender">
              <select className={selectClass} value={form.gender} onChange={(e) => up("gender", e.target.value)}>
                <option value="">Select Gender</option>
                <option className="bg-[#0a0a12]">Male</option>
                <option className="bg-[#0a0a12]">Female</option>
                <option className="bg-[#0a0a12]">Other</option>
              </select>
            </Field>
            <Field label="Date of Birth">
              <Input type="date" value={form.dateOfBirth} onChange={(e) => up("dateOfBirth", e.target.value)} />
            </Field>
            <Field label="Marital Status">
              <select className={selectClass} value={form.maritalStatus} onChange={(e) => up("maritalStatus", e.target.value)}>
                <option value="">Select</option>
                <option className="bg-[#0a0a12]">Single</option>
                <option className="bg-[#0a0a12]">Married</option>
                <option className="bg-[#0a0a12]">Divorced</option>
              </select>
            </Field>
            <Field label="Nationality">
              <Input value={form.nationality} onChange={(e) => up("nationality", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      {/* Location */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Section title="Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Address">
                <Input placeholder="House No, Street, Area" value={form.address} onChange={(e) => up("address", e.target.value)} />
              </Field>
            </div>
            <Field label="City">
              <Input placeholder="Kochi" value={form.city} onChange={(e) => up("city", e.target.value)} />
            </Field>
            <Field label="District">
              <select className={selectClass} value={form.district} onChange={(e) => up("district", e.target.value)}>
                <option value="">Select District</option>
                {KERALA_DISTRICTS.map((d) => <option key={d} className="bg-[#0a0a12]">{d}</option>)}
              </select>
            </Field>
            <Field label="Pincode">
              <Input placeholder="682001" value={form.pincode} onChange={(e) => up("pincode", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      {/* Professional */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
        <Section title="Professional Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Current Role">
              <Input placeholder="Senior Accountant" value={form.currentRole} onChange={(e) => up("currentRole", e.target.value)} />
            </Field>
            <Field label="Current Company">
              <Input placeholder="ABC Pvt Ltd" value={form.currentCompany} onChange={(e) => up("currentCompany", e.target.value)} />
            </Field>
            <Field label="Job Category">
              <select className={selectClass} value={form.category} onChange={(e) => up("category", e.target.value)}>
                <option value="">Select Category</option>
                {JOB_CATEGORIES.map((c) => <option key={c} className="bg-[#0a0a12]">{c}</option>)}
              </select>
            </Field>
            <Field label="Total Experience (years)">
              <Input type="number" step="0.5" placeholder="3.5" value={form.totalExperience} onChange={(e) => up("totalExperience", e.target.value)} />
            </Field>
            <Field label="Current Salary (₹/month)">
              <Input type="number" placeholder="35000" value={form.currentSalary} onChange={(e) => up("currentSalary", e.target.value)} />
            </Field>
            <Field label="Expected Salary (₹/month)">
              <Input type="number" placeholder="45000" value={form.expectedSalary} onChange={(e) => up("expectedSalary", e.target.value)} />
            </Field>
            <Field label="Notice Period (days)">
              <Input type="number" placeholder="30" value={form.noticePeriod} onChange={(e) => up("noticePeriod", e.target.value)} />
            </Field>
            <Field label="Source">
              <select className={selectClass} value={form.source} onChange={(e) => up("source", e.target.value)}>
                <option value="">How did they reach us?</option>
                {["WhatsApp", "Email", "Walk-in", "Referral", "LinkedIn", "Naukri", "Website", "Phone Call"].map((s) => (
                  <option key={s} className="bg-[#0a0a12]">{s}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <label className="text-sm text-white/60 mb-1.5 block">Skills</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 text-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                  {s}
                  <button type="button" onClick={() => setForm({ ...form, skills: form.skills.filter((x) => x !== s) })}>
                    <X className="h-3 w-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mt-4">
            <label className="text-sm text-white/60 mb-1.5 block">Languages Known</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="e.g. Malayalam, English, Hindi"
                value={langInput}
                onChange={(e) => setLangInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.languages.map((l) => (
                <span key={l} className="inline-flex items-center gap-1.5 text-xs bg-white/5 text-white/50 border border-white/8 px-2.5 py-1 rounded-full">
                  {l}
                  <button type="button" onClick={() => setForm({ ...form, languages: form.languages.filter((x) => x !== l) })}>
                    <X className="h-3 w-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Documents */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <Section title="Documents & Gulf">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/2">
              <input type="checkbox" id="passport" checked={form.hasPassport} onChange={(e) => up("hasPassport", e.target.checked)} className="w-4 h-4 rounded" />
              <label htmlFor="passport" className="text-sm text-white/70 cursor-pointer">Has Valid Passport</label>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/2">
              <input type="checkbox" id="license" checked={form.hasDrivingLicense} onChange={(e) => up("hasDrivingLicense", e.target.checked)} className="w-4 h-4 rounded" />
              <label htmlFor="license" className="text-sm text-white/70 cursor-pointer">Has Driving License</label>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/2">
              <input type="checkbox" id="gulf" checked={form.gulfExperience} onChange={(e) => up("gulfExperience", e.target.checked)} className="w-4 h-4 rounded" />
              <label htmlFor="gulf" className="text-sm text-white/70 cursor-pointer">Gulf Work Experience</label>
            </div>
          </div>

          {form.hasPassport && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Field label="Passport Number">
                <Input placeholder="M1234567" value={form.passportNumber} onChange={(e) => up("passportNumber", e.target.value)} />
              </Field>
              <Field label="Passport Expiry">
                <Input type="date" value={form.passportExpiry} onChange={(e) => up("passportExpiry", e.target.value)} />
              </Field>
            </div>
          )}

          {form.gulfExperience && (
            <div className="mt-4">
              <label className="text-sm text-white/60 mb-2 block">Gulf Countries Worked In</label>
              <div className="flex flex-wrap gap-2">
                {GULF_COUNTRIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const has = form.gulfCountries.includes(c);
                      up("gulfCountries", has ? form.gulfCountries.filter((x) => x !== c) : [...form.gulfCountries, c]);
                    }}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all ${form.gulfCountries.includes(c) ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-white/3 text-white/40 border-white/10 hover:border-white/20"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>
      </motion.div>

      {/* Notes */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
        <Section title="Notes & Tags">
          <div className="grid gap-4">
            <Field label="Recruiter Notes">
              <textarea
                className={textareaClass}
                placeholder="Add any important notes about this candidate..."
                value={form.notes}
                onChange={(e) => up("notes", e.target.value)}
              />
            </Field>
            <Field label="Tags (comma separated)">
              <Input placeholder="e.g. Finance, Tax, Ernakulam, Urgent" value={form.tags} onChange={(e) => up("tags", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 pb-8">
        <Link href="/dashboard/candidates">
          <Button type="button" variant="outline" size="lg">Cancel</Button>
        </Link>
        <Button type="submit" variant="gradient" size="lg" loading={loading} className="flex-1 sm:flex-none">
          <Save className="h-4 w-4" />
          Save Candidate
        </Button>
      </motion.div>
    </form>
  );
}
