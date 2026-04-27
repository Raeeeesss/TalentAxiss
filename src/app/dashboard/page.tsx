import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHome } from "@/components/dashboard/home";

async function getDashboardStats(agencyId: string) {
  const [
    totalCandidates,
    activeJobs,
    todayInterviews,
    monthPlacements,
    pendingFollowups,
    highRiskCandidates,
    recentCandidates,
    recentApplications,
  ] = await Promise.all([
    prisma.candidate.count({ where: { agencyId } }),
    prisma.job.count({ where: { agencyId, status: "OPEN" } }),
    prisma.interview.count({
      where: {
        agencyId,
        scheduledAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: "SCHEDULED",
      },
    }),
    prisma.placement.count({
      where: {
        agencyId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        status: { in: ["CONFIRMED", "JOINED"] },
      },
    }),
    prisma.followUp.count({ where: { agencyId, isDone: false, dueDate: { lte: new Date() } } }),
    prisma.candidate.count({ where: { agencyId, riskLevel: { in: ["HIGH", "CRITICAL"] } } }),
    prisma.candidate.findMany({
      where: { agencyId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, currentRole: true, skills: true, status: true, createdAt: true },
    }),
    prisma.application.findMany({
      where: { agencyId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        candidate: { select: { name: true } },
        job: { select: { title: true, company: true } },
      },
    }),
  ]);

  // Monthly placements chart data (last 6 months)
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const count = await prisma.placement.count({
      where: { agencyId, createdAt: { gte: start, lte: end } },
    });
    months.push({ month: start.toLocaleString("default", { month: "short" }), count });
  }

  return {
    totalCandidates,
    activeJobs,
    todayInterviews,
    monthPlacements,
    pendingFollowups,
    highRiskCandidates,
    recentCandidates,
    recentApplications,
    monthlyChart: months,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const agencyId = (session?.user as any)?.agencyId;

  const emptyStats = {
    totalCandidates: 0,
    activeJobs: 0,
    todayInterviews: 0,
    monthPlacements: 0,
    pendingFollowups: 0,
    highRiskCandidates: 0,
    recentCandidates: [],
    recentApplications: [],
    monthlyChart: [],
  };

  const stats = agencyId
    ? await getDashboardStats(agencyId).catch(() => emptyStats)
    : emptyStats;

  return <DashboardHome stats={stats} userName={session?.user?.name || "there"} />;
}
