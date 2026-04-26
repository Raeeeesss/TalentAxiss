import { Suspense } from "react";
import { AIMatchingClient } from "@/components/dashboard/matching/ai-matching-client";

export default function AIMatchingPage() {
  return (
    <Suspense fallback={<div className="min-h-96 flex items-center justify-center text-white/20">Loading...</div>}>
      <AIMatchingClient />
    </Suspense>
  );
}
