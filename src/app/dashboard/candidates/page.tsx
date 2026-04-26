import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CandidatesClient } from "@/components/dashboard/candidates/candidates-client";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await auth();
  const agencyId = (session?.user as any)?.agencyId;

  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const district = searchParams.district || "";
  const status = searchParams.status || "";
  const skill = searchParams.skill || "";
  const pageSize = 20;

  let candidates: any[] = [];
  let total = 0;

  if (agencyId) {
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
    if (skill) where.skills = { hasSome: [skill] };

    [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, name: true, phone: true, email: true,
          currentRole: true, district: true, totalExperience: true,
          expectedSalary: true, skills: true, status: true,
          riskLevel: true, aiScore: true, fakeProfileScore: true,
          gulfExperience: true, createdAt: true, tags: true,
        },
      }),
      prisma.candidate.count({ where }),
    ]);
  }

  return (
    <CandidatesClient
      initialCandidates={candidates}
      total={total}
      page={page}
      pageSize={pageSize}
    />
  );
}
