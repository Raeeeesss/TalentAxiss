"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus, Search, Filter, Briefcase, MapPin, Users,
  Clock, Zap, AlertCircle, CheckCircle2, Pause, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, JOB_CATEGORIES, KERALA_DISTRICTS } from "@/lib/utils";

const mockJobs = [
  {
    id: "1", title: "Senior Accountant", company: "Kerala Tiles Ltd", location: "Ernakulam",
    skills: ["Tally", "GST", "Excel"], minSalary: 35000, maxSalary: 45000,
    minExperience: 3, maxExperience: 5, vacancies: 2, status: "OPEN",
    urgency: "Urgent", category: "Accounting / Finance", isGulf: false,
    applicants: 8, matched: 23, createdAt: "2024-12-15",
  },
  {
    id: "2", title: "Civil Engineer – Site", company: "Buildex Construction", location: "Thrissur",
    skills: ["AutoCAD", "Site Management", "QS"], minSalary: 40000, maxSalary: 60000,
    minExperience: 4, maxExperience: 8, vacancies: 1, status: "INTERVIEWING",
    urgency: "Normal", category: "Engineering", isGulf: false,
    applicants: 5, matched: 12, createdAt: "2024-12-10",
  },
  {
    id: "3", title: "Heavy Truck Driver – UAE", company: "Gulf Transport LLC", location: "Dubai",
    skills: ["HMV License", "Gulf Driving", "Arabic Basic"], minSalary: 90000, maxSalary: 120000,
    minExperience: 5, maxExperience: 15, vacancies: 3, status: "OPEN",
    urgency: "Urgent", category: "Gulf / Middle East", isGulf: true,
    applicants: 12, matched: 45, createdAt: "2024-12-12",
  },
  {
    id: "4", title: "Sales Executive", company: "Reliance Retail", location: "Kozhikode",
    skills: ["Sales", "CRM", "Communication"], minSalary: 20000, maxSalary: 30000,
    minExperience: 1, maxExperience: 3, vacancies: 4, status: "OPEN",
    urgency: "Low", category: "Sales / Marketing", isGulf: false,
    applicants: 15, matched: 67, createdAt: "2024-12-08",
  },
  {
    id: "5", title: "Staff Nurse – ICU", company: "Lakeshore Hospital", location: "Ernakulam",
    skills: ["ICU", "Ventilator", "Patient Care"], minSalary: 35000, maxSalary: 50000,
    minExperience: 2, maxExperience: 6, vacancies: 2, status: "HOLD",
    urgency: "Normal", category: "Healthcare / Medical", isGulf: false,
    applicants: 3, matched: 9, createdAt: "2024-12-05",
  },
];

const statusConfig = {
  OPEN: { label: "Open", variant: "success", icon: CheckCircle2 },
  INTERVIEWING: { label: "Interviewing", variant: "info", icon: Users },
  CLOSED: { label: "Closed", variant: "secondary", icon: CheckCircle2 },
  HOLD: { label: "On Hold", variant: "warning", icon: Pause },
  FILLED: { label: "Filled", variant: "purple", icon: CheckCircle2 },
};

const urgencyConfig = {
  Urgent: "text-red-400 bg-red-500/10 border-red-500/20",
  Normal: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Low: "text-white/40 bg-white/5 border-white/10",
};

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Job Openings</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage and track all recruitment requirements</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button variant="gradient">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Open Positions", value: 34, color: "text-emerald-400" },
          { label: "Interviewing", value: 8, color: "text-blue-400" },
          { label: "On Hold", value: 3, color: "text-amber-400" },
          { label: "Filled This Month", value: 12, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 bg-white/2 px-4 py-3">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <Input
          placeholder="Search jobs, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </motion.div>

      {/* Job cards */}
      <div className="grid gap-4">
        {mockJobs.map((job, i) => {
          const status = statusConfig[job.status as keyof typeof statusConfig];
          const urgencyClass = urgencyConfig[job.urgency as keyof typeof urgencyConfig];
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="rounded-2xl border border-white/8 bg-white/2 p-5 hover:border-white/15 hover:bg-white/3 transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${job.isGulf ? "bg-amber-500/15 border border-amber-500/30" : "bg-indigo-500/15 border border-indigo-500/30"}`}>
                    {job.isGulf ? <span className="text-lg">🌏</span> : <Briefcase className="h-5 w-5 text-indigo-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <Badge variant={status.variant as any} className="text-xs">{status.label}</Badge>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${urgencyClass}`}>{job.urgency}</span>
                      {job.isGulf && <Badge variant="warning" className="text-xs">Gulf 🌙</Badge>}
                    </div>
                    <div className="text-sm text-white/50 mb-2">{job.company}</div>
                    <div className="flex flex-wrap gap-3 text-xs text-white/40">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.minExperience}–{job.maxExperience} years
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.vacancies} vacancies
                      </div>
                      {(job.minSalary || job.maxSalary) && (
                        <div>{formatCurrency(job.minSalary)} – {formatCurrency(job.maxSalary)}</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.skills.map((s) => (
                        <span key={s} className="text-xs bg-white/5 text-white/40 border border-white/8 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-white/30">{job.applicants} in pipeline</div>
                    <div className="text-xs text-indigo-400">{job.matched} AI matches</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/matching?jobId=${job.id}`}>
                      <Button variant="outline" size="sm">
                        <Zap className="h-3.5 w-3.5" />
                        AI Match
                      </Button>
                    </Link>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
