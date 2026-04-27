import { LandingNav } from "@/components/landing/nav";
import { HeroSection } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem";
import { SolutionSection } from "@/components/landing/solution";
import { FeaturesGrid } from "@/components/landing/features";
import { AIDemo } from "@/components/landing/ai-demo";
import { PricingSection } from "@/components/landing/pricing";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { FAQSection } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050508] text-foreground overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <AIDemo />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
