import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID missing from session" }, { status: 400 });
  }

  // Check if user already has an agency
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, agencyId: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.agencyId) {
    return NextResponse.json({ error: "Agency already exists" }, { status: 400 });
  }

  const body = await req.json();
  const agencyName = body.agencyName?.trim();

  if (!agencyName) {
    return NextResponse.json({ error: "Agency name is required" }, { status: 400 });
  }

  // Generate unique slug
  let slug = slugify(agencyName);
  const slugExists = await prisma.agency.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now()}`;

  // Create agency
  const agency = await prisma.agency.create({
    data: {
      name: agencyName,
      slug,
      phone: body.phone || null,
      district: body.district || null,
      address: body.address || null,
      ownerId: userId,
    },
  });

  // Link agency to user
  await prisma.user.update({
    where: { id: userId },
    data: {
      agencyId: agency.id,
      role: "AGENCY_OWNER",
    },
  });

  // Create free trial subscription
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);

  await prisma.subscription.create({
    data: {
      agencyId: agency.id,
      plan: "FREE",
      status: "ACTIVE",
      trialEnd,
      candidateLimit: 100,
      userLimit: 1,
    },
  });

  return NextResponse.json({ success: true, agencyId: agency.id });
}
