import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const role     = (session.user as any)?.role;
  const agencyId = (session.user as any)?.agencyId;

  // Super admin goes directly to /admin
  if (role === "SUPER_ADMIN") redirect("/admin");

  if (!agencyId) redirect("/dashboard/setup");

  return (
    <div className="min-h-screen bg-[#050508] flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64" data-main>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
