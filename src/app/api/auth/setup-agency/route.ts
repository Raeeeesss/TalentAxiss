import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  agencyName: z.string().min(2),
  phone:      z.string().optional(),
  district:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    const data = schema.parse(await req.json());

    let slug = slugify(data.agencyName);
    if (await prisma.agency.findUnique({ where: { slug } })) {
      slug = `${slug}-${Date.now()}`;
    }

    const agency = await prisma.agency.create({
      data: {
        name:     data.agencyName,
        slug,
        phone:    data.phone    ?? null,
        district: data.district ?? null,
        ownerId:  userId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data:  { agencyId: agency.id, role: "AGENCY_OWNER" },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    const msg = error instanceof Error ? error.message : "Setup failed";
    console.error("Setup agency error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
