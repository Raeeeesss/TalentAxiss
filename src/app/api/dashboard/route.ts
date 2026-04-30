import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const agencyId = (session.user as any)?.agencyId;
    if (!agencyId) return NextResponse.json({ error: "No agency" }, { status: 400 });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

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
          createdAt: { gte: monthStart },
          status: { in: ["CONFIRMED", "JOINED"] },
        },
      }),
      prisma.followUp.count({ where: { agencyId, isDone: false, dueDate: { lte: now } } }),
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
          job:       { select: { title: true, company: true } },
        },
      }),
    ]);

    // Monthly chart — 6 months serial (small queries)
    const monthlyChart: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const count = await prisma.placement.count({
        where: { agencyId, createdAt: { gte: start, lte: end } },
      });
      monthlyChart.push({ month: start.toLocaleString("default", { month: "short" }), count });
    }

    return NextResponse.json({
      totalCandidates,
      activeJobs,
      todayInterviews,
      monthPlacements,
      pendingFollowups,
      highRiskCandidates,
      recentCandidates,
      recentApplications,
      monthlyChart,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
