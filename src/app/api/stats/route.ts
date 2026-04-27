import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agencyId = (session.user as any).agencyId;
  if (!agencyId) return NextResponse.json({ error: "No agency" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";

  const now = new Date();
  const periodStart = new Date();
  if (period === "7d") periodStart.setDate(now.getDate() - 7);
  else if (period === "90d") periodStart.setDate(now.getDate() - 90);
  else if (period === "1y") periodStart.setFullYear(now.getFullYear() - 1);
  else periodStart.setDate(now.getDate() - 30); // 30d default

  const [
    totalPlacements,
    totalCandidates,
    totalJobs,
    periodPlacements,
    periodCandidates,
  ] = await Promise.all([
    prisma.placement.count({ where: { agencyId, status: { in: ["CONFIRMED", "JOINED"] } } }),
    prisma.candidate.count({ where: { agencyId } }),
    prisma.job.count({ where: { agencyId } }),
    prisma.placement.count({ where: { agencyId, status: { in: ["CONFIRMED", "JOINED"] }, createdAt: { gte: periodStart } } }),
    prisma.candidate.count({ where: { agencyId, createdAt: { gte: periodStart } } }),
  ]);

  // Revenue: sum of placementFee
  const revenueResult = await prisma.placement.aggregate({
    where: { agencyId, status: { in: ["CONFIRMED", "JOINED"] } },
    _sum: { placementFee: true },
  });
  const totalRevenue = revenueResult._sum.placementFee || 0;

  const periodRevenueResult = await prisma.placement.aggregate({
    where: { agencyId, status: { in: ["CONFIRMED", "JOINED"] }, createdAt: { gte: periodStart } },
    _sum: { placementFee: true },
  });
  const periodRevenue = periodRevenueResult._sum.placementFee || 0;

  // Monthly placement trend (last 6 months)
  const months: { month: string; placements: number; candidates: number; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const [pl, cand, rev] = await Promise.all([
      prisma.placement.count({ where: { agencyId, createdAt: { gte: start, lte: end } } }),
      prisma.candidate.count({ where: { agencyId, createdAt: { gte: start, lte: end } } }),
      prisma.placement.aggregate({ where: { agencyId, createdAt: { gte: start, lte: end } }, _sum: { placementFee: true } }),
    ]);
    months.push({
      month: start.toLocaleString("default", { month: "short" }),
      placements: pl,
      candidates: cand,
      revenue: rev._sum.placementFee || 0,
    });
  }

  // Category breakdown
  const jobCategories = await prisma.placement.findMany({
    where: { agencyId },
    include: { job: { select: { category: true } } },
  });
  const categoryMap: Record<string, number> = {};
  jobCategories.forEach((p) => {
    const cat = p.job?.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Pipeline funnel
  const stages = ["APPLIED", "SHORTLISTED", "CALLED", "INTERVIEW", "OFFER", "JOINED"] as const;
  const stageCounts = await prisma.application.groupBy({
    by: ["stage"],
    where: { agencyId },
    _count: true,
  });
  const stageMap: Record<string, number> = {};
  stageCounts.forEach((s) => { stageMap[s.stage] = s._count; });
  const funnel = stages.map((s) => ({ stage: s, count: stageMap[s] || 0 }));

  // Staff performance
  const staffPerf = await prisma.candidate.groupBy({
    by: ["recruiterId"],
    where: { agencyId, status: "PLACED", recruiterId: { not: null } },
    _count: true,
  });
  const staffIds = staffPerf.map((s) => s.recruiterId!).filter(Boolean);
  const staffUsers = await prisma.user.findMany({
    where: { id: { in: staffIds } },
    select: { id: true, name: true },
  });
  const staffData = staffPerf.map((s) => {
    const user = staffUsers.find((u) => u.id === s.recruiterId);
    return { name: user?.name || "Unknown", placements: s._count };
  });

  // Success rate: JOINED / APPLIED
  const totalApplied = await prisma.application.count({ where: { agencyId } });
  const totalJoined = await prisma.application.count({ where: { agencyId, stage: "JOINED" } });
  const successRate = totalApplied > 0 ? Math.round((totalJoined / totalApplied) * 100) : 0;

  return NextResponse.json({
    totalPlacements,
    totalCandidates,
    totalJobs,
    periodPlacements,
    periodCandidates,
    totalRevenue,
    periodRevenue,
    successRate,
    months,
    categoryData,
    funnel,
    staffData,
  });
}
