import { LandingNav }         from "@/components/landing/nav";
import { HeroSection }         from "@/components/landing/hero";
import { StatsSection }        from "@/components/landing/stats";
import { SpineSection }        from "@/components/landing/spine";
import { FeaturesGrid }        from "@/components/landing/features";
import { TimelineSection }     from "@/components/landing/timeline";
import { PricingSection }      from "@/components/landing/pricing";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { FAQSection }          from "@/components/landing/faq";
import { AIDemo }              from "@/components/landing/ai-demo";
import { LandingFooter }       from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="bg-[#050507] text-white overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <SpineSection />
      <FeaturesGrid />
      <TimelineSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <AIDemo />
      <LandingFooter />
    </main>
  );
}
