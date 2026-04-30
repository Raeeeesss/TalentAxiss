"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardHome } from "@/components/dashboard/home";
import DashboardLoading from "./loading";

const EMPTY = {
  totalCandidates:   0,
  activeJobs:        0,
  todayInterviews:   0,
  monthPlacements:   0,
  pendingFollowups:  0,
  highRiskCandidates:0,
  recentCandidates:  [],
  recentApplications:[],
  monthlyChart:      [],
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats,   setStats]   = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLoading />;

  return (
    <DashboardHome
      stats={stats}
      userName={session?.user?.name || "there"}
    />
  );
}
