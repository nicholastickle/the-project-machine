
import HeroSection from "@/components/landing/hero-section"
import DashboardPreview from "@/components/landing/dashboard-preview"
import BentoSection from "@/components/landing/bento-section"
import AboutSection from "@/components/landing/about-section"
import CTASection from "@/components/landing/cta-section"
import FooterSection from "@/components/landing/footer-section"
import Header from "@/components/landing/header"
import SpacerElement from "@/components/landing/spacer-element"

export default function Home() {

  return (
    <>
      <div className="min-h-screen bg-background relative pb-0">
        <Header />
        <SpacerElement height="60px" text="Project hero" />
        <HeroSection />
        <DashboardPreview />
        <SpacerElement height="500px" text="Project features" />
        <BentoSection />
        <SpacerElement height="80px" text="Project about us section" />
        <AboutSection />
        <SpacerElement height="80px" text="Project call to action" />
        <CTASection />
        <SpacerElement height="80px" text="Project footer" />
        <FooterSection />
      </div>
    </>
  )
}
