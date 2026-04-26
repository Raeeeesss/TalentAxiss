import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalAgencies,
    activeSubscriptions,
    totalCandidates,
    totalPlacements,
    suspendedAgencies,
    proAgencies,
    maxAgencies,
  ] = await Promise.all([
    prisma.agency.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.candidate.count(),
    prisma.placement.count(),
    prisma.agency.count({ where: { isSuspended: true } }),
    prisma.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } }),
    prisma.subscription.count({ where: { plan: "MAX", status: "ACTIVE" } }),
  ]);

  const mrr = (proAgencies * 2999) + (maxAgencies * 7999);

  return NextResponse.json({
    totalAgencies,
    activeSubscriptions,
    totalCandidates,
    totalPlacements,
    suspendedAgencies,
    proAgencies,
    maxAgencies,
    mrr,
  });
}
