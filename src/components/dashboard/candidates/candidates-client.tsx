"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Plus, Upload, Filter, Download, Users,
  ChevronLeft, ChevronRight, AlertTriangle, Zap,
  Globe, MapPin, Star, MoreHorizontal, Eye, Edit, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, KERALA_DISTRICTS, RISK_COLORS } from "@/lib/utils";
import { UploadCVModal } from "./upload-cv-modal";

interface CandidatesClientProps {
  initialCandidates: any[];
  total: number;
  page: number;
  pageSize: number;
}

const mockCandidates = [
  { id: "1", name: "Rajan Krishnan", phone: "9876543210", email: "rajan@gmail.com", currentRole: "Senior Accountant", district: "Ernakulam", totalExperience: 4, expectedSalary: 45000, skills: ["Tally", "GST", "Excel", "SAP"], status: "ACTIVE", riskLevel: "LOW", aiScore: 92, gulfExperience: false, tags: ["Finance", "Tax"] },
  { id: "2", name: "Priya Menon", phone: "9876543211", email: "priya@gmail.com", currentRole: "HR Executive", district: "Thrissur", totalExperience: 3, expectedSalary: 35000, skills: ["Recruitment", "HRMS", "Payroll"], status: "ACTIVE", riskLevel: "LOW", aiScore: 85, gulfExperience: false, tags: ["HR"] },
  { id: "3", name: "Mohammed Rashid", phone: "9876543212", email: "rashid@gmail.com", currentRole: "Civil Engineer", district: "Malappuram", totalExperience: 6, expectedSalary: 55000, skills: ["AutoCAD", "Site Management", "QS"], status: "ACTIVE", riskLevel: "MEDIUM", aiScore: 78, gulfExperience: true, tags: ["Gulf", "Construction"] },
  { id: "4", name: "Anjali Nair", phone: "9876543213", email: "anjali@gmail.com", currentRole: "Sales Executive", district: "Kozhikode", totalExperience: 2, expectedSalary: 28000, skills: ["Sales", "CRM", "Lead Gen"], status: "PLACED", riskLevel: "LOW", aiScore: 70, gulfExperience: false, tags: ["Sales"] },
  { id: "5", name: "Suresh Pillai", phone: "9876543214", email: "suresh@gmail.com", currentRole: "Truck Driver", district: "Thiruvananthapuram", totalExperience: 8, expectedSalary: 32000, skills: ["HMV License", "LMV", "Gulf Driving"], status: "ACTIVE", riskLevel: "HIGH", aiScore: 65, gulfExperience: true, tags: ["Driver", "Gulf"] },
  { id: "6", name: "Nisha Radhakrishnan", phone: "9876543215", email: "nisha@gmail.com", currentRole: "Staff Nurse", district: "Kottayam", totalExperience: 5, expectedSalary: 42000, skills: ["ICU", "OT", "Patient Care", "NCLEX"], status: "ACTIVE", riskLevel: "LOW", aiScore: 88, gulfExperience: false, tags: ["Medical", "Nursing"] },
];

export function CandidatesClient({ initialCandidates, total, page, pageSize }: CandidatesClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const candidates = initialCandidates.length > 0 ? initialCandidates : mockCandidates;
  const displayTotal = total || mockCandidates.length;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (district) params.set("district", district);
    if (statusFilter) params.set("status", statusFilter);
    router.push(`/dashboard/candidates?${params.toString()}`);
  };

  const riskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "LOW": return "success";
      case "MEDIUM": return "warning";
      case "HIGH": return "orange";
      case "CRITICAL": return "destructive";
      default: return "secondary";
    }
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "PLACED": return "success";
      case "INACTIVE": return "secondary";
      case "BLACKLISTED": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {showUpload && <UploadCVModal onClose={() => setShowUpload(false)} />}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidates</h1>
          <p className="text-foreground/40 text-sm mt-0.5">{displayTotal.toLocaleString()} total in database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Link href="/dashboard/candidates/new">
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Active", value: Math.floor(displayTotal * 0.75), color: "text-emerald-400" },
          { label: "Placed", value: Math.floor(displayTotal * 0.12), color: "text-blue-400" },
          { label: "High Risk", value: 4, color: "text-red-400" },
          { label: "Gulf Ready", value: Math.floor(displayTotal * 0.22), color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 bg-white/2 px-4 py-3">
            <div className={`text-lg font-bold ${s.color}`}>{s.value.toLocaleString()}</div>
            <div className="text-xs text-foreground/40">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <div className="flex gap-2">
          <Input
            placeholder="Search by name, phone, skill, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            leftIcon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="default">Search</Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-3 p-4 rounded-xl border border-white/8 bg-white/2"
          >
            <select
              className="flex h-9 rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d} className="bg-[#0a0a12]">{d}</option>
              ))}
            </select>
            <select
              className="flex h-9 rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE" className="bg-[#0a0a12]">Active</option>
              <option value="PLACED" className="bg-[#0a0a12]">Placed</option>
              <option value="INACTIVE" className="bg-[#0a0a12]">Inactive</option>
              <option value="BLACKLISTED" className="bg-[#0a0a12]">Blacklisted</option>
            </select>
            <select className="flex h-9 rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="">Experience</option>
              <option className="bg-[#0a0a12]">0-2 years</option>
              <option className="bg-[#0a0a12]">2-5 years</option>
              <option className="bg-[#0a0a12]">5-10 years</option>
              <option className="bg-[#0a0a12]">10+ years</option>
            </select>
            <select className="flex h-9 rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="">Gulf Experience</option>
              <option className="bg-[#0a0a12]">Gulf Ready</option>
              <option className="bg-[#0a0a12]">No Gulf Exp</option>
            </select>
            <select className="flex h-9 rounded-xl border border-border bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="">Risk Level</option>
              <option className="bg-[#0a0a12]">Low Risk</option>
              <option className="bg-[#0a0a12]">Medium Risk</option>
              <option className="bg-[#0a0a12]">High Risk</option>
            </select>
            <Button variant="ghost" size="sm" className="text-foreground/40" onClick={() => { setDistrict(""); setStatusFilter(""); }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6 bg-white/2">
                <th className="text-left px-4 py-3">
                  <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Candidate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Skills</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Exp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Salary</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">AI Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Risk</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {candidates.map((c: any, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="hover:bg-white/2 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/candidates/${c.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-xs font-bold shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground group-hover:text-indigo-400 transition-colors">{c.name}</div>
                        <div className="text-xs text-foreground/30">{c.phone}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {(c.skills || []).slice(0, 2).map((skill: string) => (
                        <span key={skill} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {(c.skills || []).length > 2 && (
                        <span className="text-xs text-foreground/30">+{(c.skills || []).length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-foreground/60">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {c.district || "—"}
                    </div>
                    {c.gulfExperience && (
                      <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                        <Globe className="h-3 w-3" />
                        Gulf exp.
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground/60">
                    {c.totalExperience ? `${c.totalExperience}y` : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground/60">
                    {c.expectedSalary ? formatCurrency(c.expectedSalary) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {c.aiScore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.aiScore >= 80 ? "bg-emerald-500" : c.aiScore >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
                            style={{ width: `${c.aiScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-foreground/60">{c.aiScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-foreground/20">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={riskBadgeVariant(c.riskLevel) as any}>{c.riskLevel}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(c.status) as any}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/candidates/${c.id}`}>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                      <Link href={`/dashboard/candidates/${c.id}/edit`}>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/6">
          <p className="text-xs text-foreground/30">
            Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, displayTotal)} of {displayTotal}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-foreground/40">Page {page}</span>
            <Button variant="outline" size="sm" disabled={page * pageSize >= displayTotal}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
