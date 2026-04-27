"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, MapPin, Globe, Briefcase,
  Shield, Clock, FileText, Calendar, Edit, Tag, User, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/candidates/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.candidate) setCandidate(data.candidate);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-foreground/40 mb-4">Candidate not found</p>
        <Link href="/dashboard/candidates">
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        </Link>
      </div>
    );
  }

  const c = candidate;
  const activities: any[] = c.activityHistory || [];

  const activityIconMap: Record<string, React.ElementType> = {
    CREATED: FileText,
    UPDATED: Edit,
    SHORTLISTED: Shield,
    INTERVIEW_SCHEDULED: Calendar,
    OFFER_MADE: Briefcase,
    PLACED: Shield,
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/candidates">
            <button className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-white/8 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{c.name}</h1>
            <p className="text-foreground/40 text-sm">
              {c.currentRole || "Candidate"}
              {c.totalExperience ? ` · ${c.totalExperience}y exp` : ""}
            </p>
          </div>
        </div>
        <Link href={`/dashboard/candidates/${id}/edit`}>
          <Button variant="gradient" size="sm">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-foreground text-2xl font-bold shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h2 className="text-lg font-bold text-foreground">{c.name}</h2>
                  <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>{c.status || "ACTIVE"}</Badge>
                  {c.riskLevel && (
                    <Badge variant={c.riskLevel === "LOW" ? "success" : (c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL") ? "destructive" : "warning"}>
                      {c.riskLevel} RISK
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-foreground/50">
                  {c.phone && <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{c.phone}</div>}
                  {c.email && <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{c.email}</div>}
                  {(c.district || c.city) && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{c.district || c.city}, Kerala</div>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Experience", value: c.totalExperience ? `${c.totalExperience} yrs` : "—" },
                { label: "Current Salary", value: c.currentSalary ? formatCurrency(c.currentSalary) : "—" },
                { label: "Expected", value: c.expectedSalary ? formatCurrency(c.expectedSalary) : "—" },
                { label: "Notice Period", value: c.noticePeriod ? `${c.noticePeriod} days` : "—" },
              ].map((s) => (
                <div key={s.label} className="bg-white/3 border border-white/6 rounded-xl p-3">
                  <div className="text-xs text-foreground/30 mb-0.5">{s.label}</div>
                  <div className="text-sm font-semibold text-foreground">{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills & Languages */}
          {(c.skills?.length > 0 || c.languages?.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <h3 className="font-semibold text-foreground mb-4">Skills & Languages</h3>
              {c.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {c.skills.map((s: string) => (
                    <span key={s} className="text-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              )}
              {c.languages?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {c.languages.map((l: string) => (
                    <span key={l} className="text-xs bg-white/5 text-foreground/50 border border-white/8 px-2.5 py-1 rounded-full">{l}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Applications */}
          {c.applications?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <h3 className="font-semibold text-foreground mb-4">Job Applications</h3>
              <div className="space-y-2">
                {c.applications.map((app: any) => (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/6 bg-white/2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{app.job?.title}</div>
                      <div className="text-xs text-foreground/40">{app.job?.company}</div>
                    </div>
                    <Badge variant="secondary">{app.stage || "Applied"}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notes & tags */}
          {(c.notes || c.tags?.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <h3 className="font-semibold text-foreground mb-3">Notes</h3>
              {c.notes && <p className="text-sm text-foreground/50 leading-relaxed">{c.notes}</p>}
              {c.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {c.tags.map((t: string) => (
                    <span key={t} className="text-xs bg-white/5 text-foreground/40 border border-white/8 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag className="h-3 w-3" />{t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Documents */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <h3 className="font-semibold text-foreground mb-4">Documents</h3>
            <div className="space-y-2">
              {[
                { label: "Passport", value: c.hasPassport ? (c.passportNumber || "Available") : "Not available", ok: c.hasPassport, icon: Shield },
                { label: "Driving License", value: c.hasDrivingLicense ? "Available" : "Not available", ok: c.hasDrivingLicense, icon: User },
                { label: "Gulf Experience", value: c.gulfExperience ? (c.gulfCountries?.join(", ") || "Yes") : "No", ok: c.gulfExperience, icon: Globe },
              ].map((doc) => (
                <div key={doc.label} className={`flex items-center gap-3 p-3 rounded-xl border ${doc.ok ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/6 bg-white/2"}`}>
                  <doc.icon className={`h-4 w-4 ${doc.ok ? "text-emerald-400" : "text-foreground/30"}`} />
                  <div>
                    <div className="text-xs text-foreground/40">{doc.label}</div>
                    <div className="text-xs text-foreground/70 truncate max-w-35">{doc.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <h3 className="font-semibold text-foreground mb-4">Activity Timeline</h3>
            {activities.length > 0 ? (
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/6" />
                <div className="space-y-4">
                  {activities.slice(0, 8).map((t: any, i: number) => {
                    const Icon = activityIconMap[t.action] || Clock;
                    return (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 z-10">
                          <Icon className="h-3 w-3 text-foreground" />
                        </div>
                        <div>
                          <div className="text-sm text-foreground/70">{t.description || t.action}</div>
                          <div className="text-xs text-foreground/30">
                            {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground/30">No activity yet.</p>
            )}
          </motion.div>

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-white/8 bg-white/2 p-5">
            <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="gradient" size="sm" className="w-full">Schedule Interview</Button>
              <Button variant="outline" size="sm" className="w-full">Add to Job Pipeline</Button>
              {c.phone && (
                <a href={`tel:${c.phone}`}>
                  <Button variant="outline" size="sm" className="w-full">Call Candidate</Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
