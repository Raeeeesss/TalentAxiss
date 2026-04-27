import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — no auth required — cached for 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const [totalAgencies, totalCandidates, totalPlacements] = await Promise.all([
      prisma.agency.count({ where: { isActive: true } }),
      prisma.candidate.count(),
      prisma.placement.count({ where: { status: { in: ["CONFIRMED", "JOINED"] } } }),
    ]);

    return NextResponse.json({ totalAgencies, totalCandidates, totalPlacements });
  } catch {
    return NextResponse.json({ totalAgencies: 0, totalCandidates: 0, totalPlacements: 0 });
  }
}
