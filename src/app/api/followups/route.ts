import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;
  const { searchParams } = new URL(req.url);
  const isDone = searchParams.get("isDone");

  const where: any = { agencyId };
  if (isDone !== null) where.isDone = isDone === "true";

  const followUps = await prisma.followUp.findMany({
    where,
    orderBy: [{ isDone: "asc" }, { dueDate: "asc" }],
    include: {
      candidate: { select: { id: true, name: true } },
      job: { select: { id: true, title: true, company: true } },
    },
  });

  return NextResponse.json({ followUps });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;

  const body = await req.json();
  const followUp = await prisma.followUp.create({
    data: {
      agencyId,
      title: body.title,
      description: body.description,
      type: body.type || "GENERAL",
      dueDate: new Date(body.dueDate),
      candidateId: body.candidateId || null,
      jobId: body.jobId || null,
      priority: body.priority || "NORMAL",
    },
  });

  return NextResponse.json({ followUp }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, isDone } = body;

  const followUp = await prisma.followUp.update({
    where: { id },
    data: { isDone, doneAt: isDone ? new Date() : null },
  });

  return NextResponse.json({ followUp });
}
