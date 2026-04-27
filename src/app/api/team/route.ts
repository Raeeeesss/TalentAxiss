import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/email";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agencyId = (session.user as any).agencyId;
  if (!agencyId) return NextResponse.json({ error: "No agency" }, { status: 400 });

  const members = await prisma.user.findMany({
    where: { agencyId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      staffProfile: { select: { designation: true, permissions: true } },
      _count: {
        select: {
          assignedCandidates: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Get placement counts per recruiter
  const placementCounts = await prisma.placement.groupBy({
    by: ["candidateId"],
    where: { agencyId },
    _count: true,
  });

  // Associate placements with recruiters (via candidate.recruiterId)
  const recruiterPlacements = await prisma.candidate.findMany({
    where: { agencyId, recruiterId: { not: null }, status: "PLACED" },
    select: { recruiterId: true },
  });

  const placementByRecruiter: Record<string, number> = {};
  recruiterPlacements.forEach((c) => {
    if (c.recruiterId) {
      placementByRecruiter[c.recruiterId] = (placementByRecruiter[c.recruiterId] || 0) + 1;
    }
  });

  const result = members.map((m) => ({
    ...m,
    placements: placementByRecruiter[m.id] || 0,
    candidateCount: m._count.assignedCandidates,
  }));

  return NextResponse.json({ members: result });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agencyId = (session.user as any).agencyId;
  const role = (session.user as any).role;

  if (role !== "AGENCY_OWNER") {
    return NextResponse.json({ error: "Only agency owner can invite members" }, { status: 403 });
  }

  const { name, email, designation, role: inviteRole } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

  // Create user with temp password
  const tempPassword = Math.random().toString(36).slice(-10);
  const hashed = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: inviteRole || "AGENCY_STAFF",
      agencyId,
      isActive: true,
    },
  });

  await prisma.staffMember.create({
    data: {
      userId: user.id,
      agencyId,
      designation: designation || null,
      permissions: {},
    },
  });

  // Send invitation email with temp password
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "TalentAxiss <noreply@talentaxiss.com>",
    to: email,
    subject: "You've been invited to TalentAxiss",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0d0d1a;color:#fff;border-radius:16px;">
        <h2>You're invited to join TalentAxiss 🎉</h2>
        <p style="color:rgba(255,255,255,0.6);">Hi ${name}, you've been added as a recruiter.</p>
        <p style="color:rgba(255,255,255,0.6);">Login at <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" style="color:#6366f1;">${process.env.NEXT_PUBLIC_APP_URL}/auth/login</a></p>
        <p style="color:rgba(255,255,255,0.6);">Email: <strong style="color:#fff;">${email}</strong><br/>Temp password: <strong style="color:#6366f1;">${tempPassword}</strong></p>
        <p style="color:rgba(255,255,255,0.3);font-size:12px;">Please change your password after first login.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true, userId: user.id });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role;
  const agencyId = (session.user as any).agencyId;

  if (role !== "AGENCY_OWNER") {
    return NextResponse.json({ error: "Only agency owner can remove members" }, { status: 403 });
  }

  const { userId } = await req.json();
  const member = await prisma.user.findFirst({ where: { id: userId, agencyId } });
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
