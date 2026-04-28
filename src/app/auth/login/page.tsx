import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In | TalentAxiss",
  description: "Sign in to your TalentAxiss agency dashboard.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafbff]" />}>
      <LoginForm />
    </Suspense>
  );
}
