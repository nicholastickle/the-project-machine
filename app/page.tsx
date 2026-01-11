
import HeroSection from "@/components/landing/hero-section"
import DashboardPreview from "@/components/landing/dashboard-preview"
import FeaturesSection from "@/components/landing/features-section"
import AboutSection from "@/components/landing/about-section"
import CTASection from "@/components/landing/cta-section"
import FooterSection from "@/components/landing/footer-section"
import Header from "@/components/landing/header"
import SpacerElement from "@/components/landing/spacer-element"
import FAQSection from "@/components/landing/faq-section"

export default function Home() {

  return (
    <>
      <div className="min-h-screen bg-background relative pb-0">
        <Header />
        <SpacerElement height="80px" text="Project hero" />
        <HeroSection />
        <DashboardPreview />
        <SpacerElement height="500px" text="Project features" id="features-section" />
        <FeaturesSection />
        <SpacerElement height="150px" text="Project about us section" id="about-section" />
        <AboutSection />
        <SpacerElement height="150px" text="Project FAQ section" id="faq-section" />
        <FAQSection />
        <SpacerElement height="150px" text="Project call to action" />
        <CTASection />
        <SpacerElement height="150px" text="Project footer" />
        <FooterSection />
      </div>
    </>
  )
}
