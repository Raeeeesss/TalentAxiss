import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  description: z.string().optional(),
  requirements: z.string().optional(),
  location: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  jobType: z.string().optional(),
  category: z.string().optional(),
  skills: z.array(z.string()).default([]),
  minExperience: z.number().optional(),
  maxExperience: z.number().optional(),
  minSalary: z.number().optional(),
  maxSalary: z.number().optional(),
  vacancies: z.number().default(1),
  genderPreference: z.string().optional(),
  urgency: z.string().optional(),
  closingDate: z.string().optional(),
  isGulf: z.boolean().default(false),
  gulfCountry: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";

  const where: any = { agencyId };
  if (status) where.status = status;

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;

  try {
    const body = await req.json();
    const data = jobSchema.parse(body);

    const job = await prisma.job.create({
      data: {
        agencyId,
        recruiterId: (session.user as any).id,
        title: data.title,
        company: data.company,
        description: data.description || null,
        requirements: data.requirements || null,
        location: data.location || null,
        district: data.district || null,
        state: data.state || null,
        jobType: data.jobType || null,
        category: data.category || null,
        skills: data.skills,
        minExperience: data.minExperience || null,
        maxExperience: data.maxExperience || null,
        minSalary: data.minSalary || null,
        maxSalary: data.maxSalary || null,
        vacancies: data.vacancies,
        genderPreference: data.genderPreference || null,
        urgency: data.urgency || null,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        isGulf: data.isGulf,
        gulfCountry: data.gulfCountry || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
