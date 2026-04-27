import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agencyId = (session.user as any).agencyId;
  if (!agencyId) return NextResponse.json({ error: "No agency" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const where: any = { agencyId };
  if (search) {
    where.OR = [
      { candidate: { name: { contains: search, mode: "insensitive" } } },
      { job: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      candidate: {
        select: {
          id: true, name: true, phone: true, currentRole: true,
          district: true, aiScore: true, riskLevel: true, skills: true,
        },
      },
      job: {
        select: { id: true, title: true, company: true, location: true },
      },
    },
  });

  return NextResponse.json({ applications });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agencyId = (session.user as any).agencyId;

  const { applicationId, stage, notes } = await req.json();
  if (!applicationId || !stage) return NextResponse.json({ error: "applicationId and stage required" }, { status: 400 });

  const app = await prisma.application.findFirst({ where: { id: applicationId, agencyId } });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { stage, notes: notes || app.notes, updatedAt: new Date() },
  });

  // Auto-create placement when stage = JOINED
  if (stage === "JOINED") {
    const existing = await prisma.placement.findFirst({
      where: { candidateId: app.candidateId, jobId: app.jobId },
    });
    if (!existing) {
      await prisma.placement.create({
        data: {
          candidateId: app.candidateId,
          jobId: app.jobId,
          agencyId,
          status: "JOINED",
        },
      });
      await prisma.candidate.update({
        where: { id: app.candidateId },
        data: { status: "PLACED" },
      });
    }
  }

  return NextResponse.json({ application: updated });
}
