"use client"

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
import { LoadingScreen } from "@/components/landing/landing-loading"

import { useState } from "react"


export default function Home() {


  const [isLoading, setIsLoading] = useState(true)
  const [shouldLift, setShouldLift] = useState(false)

  const handleLoadingComplete = () => {
    setShouldLift(true)
    // Remove loading screen after animation completes
    setTimeout(() => setIsLoading(false), 1800)
  }



  return (
    <>
      {isLoading && (
        <div
          className={`fixed inset-0 z-50 ${shouldLift ? "-translate-y-full" : "translate-y-0"
            }`}
          style={{
            transition: "transform 1800ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <LoadingScreen onComplete={handleLoadingComplete} />
        </div>
      )}
      <div className="min-h-screen bg-background relative pb-0">
        <div className="relative z-10">
          <main className="max-w-[1320px] mx-auto relative">
            
            <HeroSection />
            
          </main>
          <div className="flex justify-center -mt-20 sm:-mt-40 md:-mt-40 lg:-mt-20 xl:-mt-72 z-30 relative">
            <AnimatedSection delay={6}>
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
            <Separator className="bg-muted/20" />
          </AnimatedSection>
          <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
            <FooterSection />
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}
