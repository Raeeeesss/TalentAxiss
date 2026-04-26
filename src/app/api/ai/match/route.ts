import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchCandidatesWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;

  try {
    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

    const job = await prisma.job.findFirst({ where: { id: jobId, agencyId } });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Get all active candidates for this agency
    const candidates = await prisma.candidate.findMany({
      where: { agencyId, status: "ACTIVE" },
      select: {
        id: true, name: true, skills: true, totalExperience: true,
        expectedSalary: true, city: true, district: true, currentRole: true,
      },
      take: 500, // batch limit
    });

    if (candidates.length === 0) {
      return NextResponse.json({ results: [], message: "No active candidates found" });
    }

    const results = await matchCandidatesWithAI(
      {
        title: job.title,
        skills: job.skills,
        minExperience: job.minExperience ?? undefined,
        maxExperience: job.maxExperience ?? undefined,
        minSalary: job.minSalary ?? undefined,
        maxSalary: job.maxSalary ?? undefined,
        location: job.location ?? undefined,
        description: job.description ?? undefined,
      },
      candidates.map((c) => ({
        id: c.id,
        name: c.name,
        skills: c.skills,
        totalExperience: c.totalExperience ?? undefined,
        expectedSalary: c.expectedSalary ?? undefined,
        city: c.city ?? undefined,
        district: c.district ?? undefined,
        currentRole: c.currentRole ?? undefined,
      }))
    );

    // Update AI scores on candidate profiles
    for (const result of results) {
      await prisma.candidate.update({
        where: { id: result.candidateId },
        data: { aiScore: result.score },
      }).catch(() => null);
    }

    return NextResponse.json({ results, total: candidates.length });
  } catch (error) {
    console.error("AI match error:", error);
    return NextResponse.json({ error: "AI matching failed" }, { status: 500 });
  }
}
