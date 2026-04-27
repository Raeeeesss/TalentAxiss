import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const candidateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  altPhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().default("Indian"),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().default("Kerala"),
  pincode: z.string().optional(),
  currentRole: z.string().optional(),
  currentCompany: z.string().optional(),
  totalExperience: z.string().optional(),
  currentSalary: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  hasPassport: z.boolean().default(false),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  hasDrivingLicense: z.boolean().default(false),
  drivingLicenseNo: z.string().optional(),
  gulfExperience: z.boolean().default(false),
  gulfCountries: z.array(z.string()).default([]),
  category: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;
  if (!agencyId) return NextResponse.json({ error: "No agency" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const district = searchParams.get("district") || "";
  const status = searchParams.get("status") || "";

  const where: any = { agencyId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
      { currentRole: { contains: search, mode: "insensitive" } },
      { skills: { hasSome: [search] } },
    ];
  }
  if (district) where.district = district;
  if (status) where.status = status;

  const riskLevelParam = searchParams.get("riskLevel") || "";
  if (riskLevelParam) {
    const levels = riskLevelParam.split(",").map((l) => l.trim()).filter(Boolean);
    where.riskLevel = levels.length === 1 ? levels[0] : { in: levels };
  }

  const [candidates, total] = await Promise.all([
    prisma.candidate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, phone: true, email: true,
        currentRole: true, district: true, totalExperience: true,
        expectedSalary: true, skills: true, status: true,
        riskLevel: true, aiScore: true, gulfExperience: true,
        createdAt: true, tags: true,
      },
    }),
    prisma.candidate.count({ where }),
  ]);

  return NextResponse.json({ candidates, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agencyId = (session.user as any).agencyId;
  if (!agencyId) return NextResponse.json({ error: "No agency" }, { status: 400 });

  try {
    const body = await req.json();
    const data = candidateSchema.parse(body);

    const candidate = await prisma.candidate.create({
      data: {
        agencyId,
        recruiterId: (session.user as any).id,
        name: data.name,
        phone: data.phone || null,
        altPhone: data.altPhone || null,
        email: data.email || null,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        maritalStatus: data.maritalStatus || null,
        nationality: data.nationality,
        address: data.address || null,
        city: data.city || null,
        district: data.district || null,
        state: data.state,
        pincode: data.pincode || null,
        currentRole: data.currentRole || null,
        currentCompany: data.currentCompany || null,
        totalExperience: data.totalExperience ? parseFloat(data.totalExperience) : null,
        currentSalary: data.currentSalary ? parseFloat(data.currentSalary) : null,
        expectedSalary: data.expectedSalary ? parseFloat(data.expectedSalary) : null,
        noticePeriod: data.noticePeriod ? parseInt(data.noticePeriod) : null,
        skills: data.skills,
        languages: data.languages,
        hasPassport: data.hasPassport,
        passportNumber: data.passportNumber || null,
        passportExpiry: data.passportExpiry ? new Date(data.passportExpiry) : null,
        hasDrivingLicense: data.hasDrivingLicense,
        drivingLicenseNo: data.drivingLicenseNo || null,
        gulfExperience: data.gulfExperience,
        gulfCountries: data.gulfCountries,
        source: data.source || null,
        notes: data.notes || null,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      },
    });

    // Log activity
    await prisma.candidateActivity.create({
      data: {
        candidateId: candidate.id,
        action: "CREATED",
        description: "Candidate profile created",
        performedBy: (session.user as any).id,
      },
    });

    return NextResponse.json({ candidate }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Create candidate error:", error);
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
  }
}
