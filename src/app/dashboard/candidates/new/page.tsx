"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X, Upload, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { KERALA_DISTRICTS, GULF_COUNTRIES, JOB_CATEGORIES } from "@/lib/utils";

/* ── Light-theme surface helpers ─────────────────────────── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="text-sm font-medium text-gray-600 mb-1.5 block">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const SC = "flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-colors";
const TA = "flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 min-h-[80px] resize-none transition-colors";

const LICENSE_COUNTRIES = [
  "UAE", "Saudi Arabia", "Kuwait", "Qatar", "Bahrain", "Oman",
  "USA", "UK", "Canada", "Australia", "Germany", "Singapore", "Malaysia",
];
const LICENSE_CATEGORIES = ["LMV", "HMV", "Transport Vehicle", "Motorcycle", "PSV", "Other"];

function calcAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

export default function NewCandidatePage() {
  const router = useRouter();
  const [loading,    setLoading]    = useState(false);
  const [cvParsing,  setCvParsing]  = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [langInput,  setLangInput]  = useState("");
  const [customCat,  setCustomCat]  = useState("");   // Bug 9: "Other" category input

  const [form, setForm] = useState({
    name: "", phone: "", altPhone: "", email: "",
    gender: "", dateOfBirth: "", maritalStatus: "", nationality: "Indian",
    address: "", city: "", district: "", state: "Kerala", pincode: "",
    currentRole: "", currentCompany: "", totalExperience: "",
    currentSalary: "", expectedSalary: "", noticePeriod: "",
    skills: [] as string[], languages: [] as string[],
    // Passport
    hasPassport: false, passportNumber: "", passportExpiry: "",
    // Driving license (Bug 2)
    hasDrivingLicense: false,
    licenseType: "Indian" as "Indian" | "International",
    licenseCountry: "",
    licenseCategory: "",
    drivingLicenseNo: "",
    // Gulf (Bug 3 — added gulfYears)
    gulfExperience: false, gulfCountries: [] as string[], gulfYears: "",
    // Misc
    category: "", source: "", notes: "", tags: "",
  });

  const up = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  // Bug 5: age auto-calculated
  const age = calcAge(form.dateOfBirth);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) up("skills", [...form.skills, s]);
    setSkillInput("");
  };
  const addLanguage = () => {
    const l = langInput.trim();
    if (l && !form.languages.includes(l)) up("languages", [...form.languages, l]);
    setLangInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      category: form.category === "Other" && customCat ? customCat : form.category,
    };
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // Bug 4: CV upload (already works, make it more prominent)
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/candidates/parse-cv", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Parse failed");
      const { parsed } = await res.json();
      setForm((f) => ({
        ...f,
        name:            parsed.name            || f.name,
        phone:           parsed.phone           || f.phone,
        email:           parsed.email           || f.email,
        gender:          parsed.gender          || f.gender,
        dateOfBirth:     parsed.dateOfBirth?.slice(0, 10) || f.dateOfBirth,
        address:         parsed.address         || f.address,
        city:            parsed.city            || f.city,
        district:        parsed.district        || f.district,
        currentRole:     parsed.currentRole     || f.currentRole,
        currentCompany:  parsed.currentCompany  || f.currentCompany,
        totalExperience: parsed.totalExperience?.toString() || f.totalExperience,
        currentSalary:   parsed.currentSalary?.toString()   || f.currentSalary,
        expectedSalary:  parsed.expectedSalary?.toString()  || f.expectedSalary,
        noticePeriod:    parsed.noticePeriod?.toString()    || f.noticePeriod,
        skills:          parsed.skills?.length ? parsed.skills : f.skills,
        languages:       parsed.languages?.length ? parsed.languages : f.languages,
        hasPassport:     parsed.hasPassport     ?? f.hasPassport,
        passportNumber:  parsed.passportNumber  || f.passportNumber,
        hasDrivingLicense: parsed.hasDrivingLicense ?? f.hasDrivingLicense,
        gulfExperience:  parsed.gulfExperience  ?? f.gulfExperience,
        gulfCountries:   parsed.gulfCountries?.length ? parsed.gulfCountries : f.gulfCountries,
        notes:           parsed.summary         || f.notes,
      }));
      toast.success("CV parsed! Fields auto-filled — please review and save.");
    } catch {
      toast.error("Could not parse CV. Please fill in manually.");
    } finally {
      setCvParsing(false);
      e.target.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/candidates">
            <button type="button" className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Candidate</h1>
            <p className="text-gray-400 text-sm">Upload CV for AI extraction or fill in manually</p>
          </div>
        </div>
        <Button type="submit" size="sm" loading={loading} className="bg-gray-950 hover:bg-gray-800 text-white">
          <Save className="h-4 w-4" />Save Candidate
        </Button>
      </motion.div>

      {/* Bug 4: Prominent CV Upload section */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
        <label className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all ${cvParsing ? "border-indigo-300 bg-indigo-50/50" : "border-gray-200 bg-gray-50/60 hover:border-indigo-300 hover:bg-indigo-50/40"}`}>
          {cvParsing ? (
            <>
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-indigo-700">Parsing CV with AI…</p>
                <p className="text-xs text-gray-400 mt-0.5">Extracting all candidate details automatically</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">Upload CV for AI Auto-Fill</p>
                <p className="text-xs text-gray-400 mt-0.5">PDF, DOCX or TXT — AI extracts all 20+ fields instantly</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/25">
                <Upload className="h-3.5 w-3.5" />
                Choose File
              </div>
            </>
          )}
          <input type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleCVUpload} disabled={cvParsing} />
        </label>
      </motion.div>

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
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

            {/* Bug 1: select options use proper light bg */}
            <Field label="Gender">
              <select className={SC} value={form.gender} onChange={(e) => up("gender", e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            {/* Bug 5: Date of Birth with auto-age */}
            <Field label="Date of Birth">
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => up("dateOfBirth", e.target.value)}
                  className="flex-1"
                />
                {age !== null && (
                  <span className="shrink-0 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl whitespace-nowrap">
                    {age} yrs
                  </span>
                )}
              </div>
            </Field>

            <Field label="Marital Status">
              <select className={SC} value={form.maritalStatus} onChange={(e) => up("maritalStatus", e.target.value)}>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </Field>
            <Field label="Nationality">
              <Input value={form.nationality} onChange={(e) => up("nationality", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      {/* Location */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>
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
              <select className={SC} value={form.district} onChange={(e) => up("district", e.target.value)}>
                <option value="">Select District</option>
                {KERALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Pincode">
              <Input placeholder="682001" value={form.pincode} onChange={(e) => up("pincode", e.target.value)} />
            </Field>
          </div>
        </Section>
      </motion.div>

      {/* Professional */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Section title="Professional Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Current Role">
              <Input placeholder="Senior Accountant" value={form.currentRole} onChange={(e) => up("currentRole", e.target.value)} />
            </Field>
            <Field label="Current Company">
              <Input placeholder="ABC Pvt Ltd" value={form.currentCompany} onChange={(e) => up("currentCompany", e.target.value)} />
            </Field>

            {/* Bug 9: Job Category with "Other" custom input */}
            <Field label="Job Category">
              <select className={SC} value={form.category} onChange={(e) => up("category", e.target.value)}>
                <option value="">Select Category</option>
                {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {form.category === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Type your category…"
                  value={customCat}
                  onChange={(e) => setCustomCat(e.target.value)}
                />
              )}
            </Field>

            <Field label="Total Experience (years)">
              <Input type="number" step="0.5" min="0" placeholder="3.5" value={form.totalExperience} onChange={(e) => up("totalExperience", e.target.value)} />
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
              <select className={SC} value={form.source} onChange={(e) => up("source", e.target.value)}>
                <option value="">How did they reach us?</option>
                {["WhatsApp", "Email", "Walk-in", "Referral", "LinkedIn", "Naukri", "Website", "Phone Call"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Skills */}
          <div className="mt-5">
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Skills</label>
            <div className="flex gap-2 mb-2.5">
              <Input
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full font-medium">
                    {s}
                    <button type="button" onClick={() => up("skills", form.skills.filter((x) => x !== s))}>
                      <X className="h-3 w-3 hover:text-indigo-900" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Languages Known</label>
            <div className="flex gap-2 mb-2.5">
              <Input
                placeholder="e.g. Malayalam, English, Hindi"
                value={langInput}
                onChange={(e) => setLangInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLanguage(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addLanguage}><Plus className="h-4 w-4" /></Button>
            </div>
            {form.languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.languages.map((l) => (
                  <span key={l} className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                    {l}
                    <button type="button" onClick={() => up("languages", form.languages.filter((x) => x !== l))}>
                      <X className="h-3 w-3 hover:text-gray-900" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Section>
      </motion.div>

      {/* Documents & Gulf */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Documents & Gulf Experience">
          {/* Checkbox row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { id: "passport", label: "Has Valid Passport",      key: "hasPassport"       },
              { id: "license",  label: "Has Driving License",     key: "hasDrivingLicense" },
              { id: "gulf",     label: "Gulf Work Experience",    key: "gulfExperience"    },
            ].map((cb) => (
              <label key={cb.id} htmlFor={cb.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox" id={cb.id}
                  checked={!!form[cb.key as keyof typeof form]}
                  onChange={(e) => up(cb.key, e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <span className="text-sm font-medium text-gray-700">{cb.label}</span>
              </label>
            ))}
          </div>

          {/* Passport fields */}
          {form.hasPassport && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <Field label="Passport Number">
                <Input placeholder="M1234567" value={form.passportNumber} onChange={(e) => up("passportNumber", e.target.value)} />
              </Field>
              <Field label="Passport Expiry">
                <Input type="date" value={form.passportExpiry} onChange={(e) => up("passportExpiry", e.target.value)} />
              </Field>
            </div>
          )}

          {/* Bug 2: Driving license with Indian/International + country */}
          {form.hasDrivingLicense && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-3">
              <div className="flex gap-3">
                {(["Indian", "International"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => up("licenseType", type)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      form.licenseType === type
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {type} License
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="License Number">
                  <Input placeholder="DL-1420110012345" value={form.drivingLicenseNo} onChange={(e) => up("drivingLicenseNo", e.target.value)} />
                </Field>
                <Field label="License Category">
                  <select className={SC} value={form.licenseCategory} onChange={(e) => up("licenseCategory", e.target.value)}>
                    <option value="">Select Category</option>
                    {LICENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              {form.licenseType === "International" && (
                <Field label="Issuing Country">
                  <select className={SC} value={form.licenseCountry} onChange={(e) => up("licenseCountry", e.target.value)}>
                    <option value="">Select Country</option>
                    {LICENSE_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              )}
            </div>
          )}

          {/* Bug 3: Gulf experience with years + countries */}
          {form.gulfExperience && (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <Field label="Years of Gulf Experience">
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g. 3.5"
                    value={form.gulfYears}
                    onChange={(e) => up("gulfYears", e.target.value)}
                    className="max-w-40"
                  />
                  {form.gulfYears && (
                    <span className="text-sm text-emerald-700 font-medium">
                      {parseFloat(form.gulfYears)} year{parseFloat(form.gulfYears) !== 1 ? "s" : ""} in Gulf
                    </span>
                  )}
                </div>
              </Field>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Countries Worked In</label>
                <div className="flex flex-wrap gap-2">
                  {GULF_COUNTRIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        const has = form.gulfCountries.includes(c);
                        up("gulfCountries", has ? form.gulfCountries.filter((x) => x !== c) : [...form.gulfCountries, c]);
                      }}
                      className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${
                        form.gulfCountries.includes(c)
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Section>
      </motion.div>

      {/* Notes */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <Section title="Notes & Tags">
          <div className="grid gap-4">
            <Field label="Recruiter Notes">
              <textarea
                className={TA}
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
        <Button type="submit" size="lg" loading={loading} className="flex-1 sm:flex-none bg-gray-950 hover:bg-gray-800 text-white">
          <Save className="h-4 w-4" />Save Candidate
        </Button>
      </motion.div>
    </form>
  );
}
