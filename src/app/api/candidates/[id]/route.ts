import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;

  const candidate = await prisma.candidate.findFirst({
    where: { id: params.id, agencyId },
    include: {
      applications: { include: { job: { select: { title: true, company: true } } } },
      interviews: { orderBy: { scheduledAt: "desc" }, take: 5 },
      placements: { take: 3 },
      activityHistory: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!candidate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ candidate });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;

  const candidate = await prisma.candidate.findFirst({ where: { id: params.id, agencyId } });
  if (!candidate) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.candidate.update({
    where: { id: params.id },
    data: { ...body, updatedAt: new Date() },
  });

  return NextResponse.json({ candidate: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;
  const role = (session.user as any).role;

  if (role !== "AGENCY_OWNER") {
    return NextResponse.json({ error: "Only agency owner can delete" }, { status: 403 });
  }

  const candidate = await prisma.candidate.findFirst({ where: { id: params.id, agencyId } });
  if (!candidate) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.candidate.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
