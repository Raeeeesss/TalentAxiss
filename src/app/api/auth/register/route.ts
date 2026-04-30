import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/email";

const schema = z.object({
  name:       z.string().min(2),
  email:      z.string().email(),
  password:   z.string().min(8),
  agencyName: z.string().min(2),
  phone:      z.string().optional(),
  district:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    let slug = slugify(data.agencyName);
    if (await prisma.agency.findUnique({ where: { slug } })) {
      slug = `${slug}-${Date.now()}`;
    }

    const user = await prisma.user.create({
      data: {
        name:     data.name,
        email:    data.email,
        password: hashedPassword,
        role:     "AGENCY_OWNER",
        phone:    data.phone ?? null,
      },
    });

    const agency = await prisma.agency.create({
      data: {
        name:     data.agencyName,
        slug,
        phone:    data.phone    ?? null,
        district: data.district ?? null,
        ownerId:  user.id,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data:  { agencyId: agency.id },
    });

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await prisma.subscription.create({
      data: {
        agencyId:       agency.id,
        plan:           "FREE",
        status:         "ACTIVE",
        trialEnd,
        candidateLimit: 100,
        userLimit:      1,
      },
    });

    sendWelcomeEmail(data.email, data.name, data.agencyName).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    const msg = error instanceof Error ? error.message : "Registration failed";
    console.error("Register error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
