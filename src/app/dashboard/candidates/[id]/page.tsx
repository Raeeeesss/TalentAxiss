"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, MapPin, Globe, Briefcase,
  GraduationCap, Shield, AlertTriangle, Star, Clock,
  FileText, Calendar, Edit, Download, Tag, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, RISK_COLORS } from "@/lib/utils";

const mockCandidate = {
  id: "1",
  name: "Rajan Krishnan",
  phone: "9876543210",
  altPhone: "9876543211",
  email: "rajan@gmail.com",
  gender: "Male",
  dateOfBirth: "1990-05-15",
  nationality: "Indian",
  address: "MG Road, Kochi",
  city: "Kochi",
  district: "Ernakulam",
  state: "Kerala",
  currentRole: "Senior Accountant",
  currentCompany: "ABC Pvt Ltd",
  totalExperience: 4,
  currentSalary: 38000,
  expectedSalary: 45000,
  noticePeriod: 30,
  skills: ["Tally Prime", "GST Filing", "Excel", "SAP FI", "MIS Reports", "Accounts Payable", "Accounts Receivable"],
  languages: ["Malayalam", "English", "Hindi"],
  education: [
    { degree: "B.Com", institution: "MG University, Kottayam", year: "2012" },
    { degree: "CA Inter", institution: "ICAI", year: "2015" },
  ],
  workHistory: [
    { company: "ABC Pvt Ltd", role: "Senior Accountant", duration: "2021 – Present" },
    { company: "XYZ Trading", role: "Accountant", duration: "2018 – 2021" },
    { company: "Kerala Finance", role: "Junior Accountant", duration: "2015 – 2018" },
  ],
  certifications: ["Tally Certified", "GST Practitioner"],
  hasPassport: true,
  passportNumber: "M1234567",
  passportExpiry: "2030-04-15",
  hasDrivingLicense: true,
  gulfExperience: false,
  status: "ACTIVE",
  riskLevel: "LOW",
  aiScore: 92,
  fakeProfileScore: 8,
  tags: ["Finance", "Tax", "Ernakulam"],
  notes: "Strong candidate, immediate joiner. Very responsive over phone. Attended 2 interviews in the past 3 months.",
  source: "WhatsApp",
  createdAt: "2024-12-10",
};

const timeline = [
  { action: "CV Uploaded", date: "10 Dec 2024", icon: FileText, color: "bg-blue-500" },
  { action: "AI Parsed", date: "10 Dec 2024", icon: Star, color: "bg-purple-500" },
  { action: "Shortlisted for Accountant role", date: "15 Dec 2024", icon: Briefcase, color: "bg-cyan-500" },
  { action: "Interview scheduled @ 2PM", date: "20 Dec 2024", icon: Calendar, color: "bg-amber-500" },
  { action: "Interview: PASS", date: "20 Dec 2024", icon: Shield, color: "bg-emerald-500" },
  { action: "Offer made: ₹45,000", date: "22 Dec 2024", icon: Star, color: "bg-indigo-500" },
];

export default function CandidateDetailPage() {
  const { id } = useParams();
  const c = mockCandidate;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/candidates">
            <button className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{c.name}</h1>
            <p className="text-white/40 text-sm">{c.currentRole} · {c.totalExperience}y exp</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            PDF Profile
          </Button>
          <Link href={`/dashboard/candidates/${id}/edit`}>
            <Button variant="gradient" size="sm">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — profile */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h2 className="text-lg font-bold text-white">{c.name}</h2>
                  <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>{c.status}</Badge>
                  <Badge variant={c.riskLevel === "LOW" ? "success" : c.riskLevel === "HIGH" ? "destructive" : "warning"}>
                    {c.riskLevel} RISK
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-white/50">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {c.phone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {c.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {c.district}, Kerala
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Experience", value: `${c.totalExperience} years` },
                { label: "Current Salary", value: formatCurrency(c.currentSalary) },
                { label: "Expected", value: formatCurrency(c.expectedSalary) },
                { label: "Notice Period", value: `${c.noticePeriod} days` },
              ].map((s) => (
                <div key={s.label} className="bg-white/3 border border-white/6 rounded-xl p-3">
                  <div className="text-xs text-white/30 mb-0.5">{s.label}</div>
                  <div className="text-sm font-semibold text-white">{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-4">Skills & Languages</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {c.skills.map((s) => (
                <span key={s} className="text-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {c.languages.map((l) => (
                <span key={l} className="text-xs bg-white/5 text-white/50 border border-white/8 px-2.5 py-1 rounded-full">
                  {l}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Work History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-4">Work History</h3>
            <div className="space-y-3">
              {c.workHistory.map((w, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{w.role}</div>
                    <div className="text-xs text-white/50">{w.company}</div>
                    <div className="text-xs text-white/30 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {w.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-4">Education</h3>
            <div className="space-y-3">
              {c.education.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{e.degree}</div>
                    <div className="text-xs text-white/50">{e.institution}</div>
                    <div className="text-xs text-white/30">{e.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-3">Notes</h3>
            <p className="text-sm text-white/50 leading-relaxed">{c.notes}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {c.tags.map((t) => (
                <span key={t} className="text-xs bg-white/5 text-white/40 border border-white/8 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* AI Scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-4">AI Analysis</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50">Profile Score</span>
                  <span className="text-emerald-400 font-medium">{c.aiScore}%</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.aiScore}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-linear-to-r from-emerald-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/50">Fake Profile Risk</span>
                  <span className={c.fakeProfileScore > 50 ? "text-red-400 font-medium" : "text-emerald-400 font-medium"}>
                    {c.fakeProfileScore}%
                  </span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.fakeProfileScore}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className={`h-full rounded-full ${c.fakeProfileScore > 50 ? "bg-red-500" : "bg-emerald-500"}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-4">Documents</h3>
            <div className="space-y-2">
              {[
                { label: "Passport", value: c.hasPassport ? `${c.passportNumber} (Exp: ${c.passportExpiry})` : "Not available", icon: Shield, ok: c.hasPassport },
                { label: "Driving License", value: c.hasDrivingLicense ? "Available" : "Not available", icon: User, ok: c.hasDrivingLicense },
                { label: "Gulf Experience", value: c.gulfExperience ? "Yes" : "No", icon: Globe, ok: c.gulfExperience },
              ].map((doc) => (
                <div key={doc.label} className={`flex items-center gap-3 p-3 rounded-xl border ${doc.ok ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/6 bg-white/2"}`}>
                  <doc.icon className={`h-4 w-4 ${doc.ok ? "text-emerald-400" : "text-white/30"}`} />
                  <div>
                    <div className="text-xs text-white/40">{doc.label}</div>
                    <div className="text-xs text-white/70">{doc.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-4">Activity Timeline</h3>
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/6" />
              <div className="space-y-4">
                {timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className={`w-7 h-7 rounded-full ${t.color} flex items-center justify-center shrink-0 z-10`}>
                      <t.icon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-white/70">{t.action}</div>
                      <div className="text-xs text-white/30">{t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/8 bg-white/2 p-5"
          >
            <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="gradient" size="sm" className="w-full">Schedule Interview</Button>
              <Button variant="outline" size="sm" className="w-full">Add to Job Pipeline</Button>
              <Button variant="outline" size="sm" className="w-full">Send WhatsApp</Button>
              <Button variant="outline" size="sm" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/5">Flag as Risk</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
