import { HeroSection } from "@/components/landing/hero-section"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { BentoSection } from "@/components/landing/bento-section"

import { PricingSection } from "@/components/landing/pricing-section"

import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { FooterSection } from "@/components/landing/footer-section"
import { AnimatedSection } from "@/components/landing/animated-section"
import { Separator } from "@/components/ui/separator"
import { AboutSection } from "@/components/landing/about-section"


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <div className="relative z-10">
        <main className="max-w-[1320px] mx-auto relative">
          <HeroSection />
        </main>


        <div className="flex justify-center -mt-20 sm:-mt-40 md:-mt-40 lg:-mt-20 xl:-mt-72 z-30 relative">
          <AnimatedSection delay={0.8}>
            <DashboardPreview />

          </AnimatedSection>
        </div>


        <AnimatedSection id="features-section" className="relative z-10 max-w-[1320px] mx-auto mt-1" delay={0.2}>
          <BentoSection />

        </AnimatedSection>

        <AnimatedSection
          id="pricing-section"
          className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16"
          delay={0.2}
        >
          <PricingSection />

        </AnimatedSection>

        <AnimatedSection
          id="about-section"
          className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16"
          delay={0.2}
        >
          <AboutSection />

        </AnimatedSection>
        <AnimatedSection id="faq-section" className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <FAQSection />

        </AnimatedSection>
        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <CTASection />
          <Separator className="bg-muted" />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <FooterSection />
         
        </AnimatedSection>
      </div>
    </div>
  )
}
