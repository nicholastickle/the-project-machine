
import HeroSection from "@/components/landing/hero-section"
import DashboardPreview from "@/components/landing/dashboard-preview"
import BentoSection from "@/components/landing/bento-section"
import PricingSection from "@/components/landing/pricing-section"
import FAQSection from "@/components/landing/faq-section"
import CTASection from "@/components/landing/cta-section"
import FooterSection from "@/components/landing/footer-section"
import AboutSection from "@/components/landing/about-section"
import LoadingScreen from "@/components/landing/landing-loading"


export default function Home() {

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-background relative pb-0">
        <HeroSection />
        <DashboardPreview />
        <BentoSection />
        <PricingSection />
        <AboutSection />
        <FAQSection />
        <CTASection />
        <FooterSection />
      </div>
    </>
  )
}
