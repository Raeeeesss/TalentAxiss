import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  agencyName: z.string().min(2),
  phone: z.string().optional(),
  district: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Unique slug
    let slug = slugify(data.agencyName);
    const slugExists = await prisma.agency.findUnique({ where: { slug } });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    // Step 1 — create user first (no agency yet)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "AGENCY_OWNER",
        phone: data.phone || null,
      },
    });

    // Step 2 — create agency with real ownerId
    const agency = await prisma.agency.create({
      data: {
        name: data.agencyName,
        slug,
        phone: data.phone || null,
        district: data.district || null,
        ownerId: user.id,
      },
    });

    // Step 3 — link user to agency
    await prisma.user.update({
      where: { id: user.id },
      data: { agencyId: agency.id },
    });

    // Step 4 — create free trial subscription
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

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Registration failed",
    }, { status: 500 });
  }
}
