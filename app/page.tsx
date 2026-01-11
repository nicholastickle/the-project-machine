'use client'

import { useEffect } from 'react'
import HeroSection from "@/components/landing/hero-section"
import DashboardPreview from "@/components/landing/dashboard-preview"
import BentoSection from "@/components/landing/bento-section"
import AboutSection from "@/components/landing/about-section"
import CTASection from "@/components/landing/cta-section"
import FooterSection from "@/components/landing/footer-section"
import { trackEvent } from '@/lib/analytics/posthog'

export default function Home() {
  useEffect(() => {
    // Track landing page view
    trackEvent('landing_page_view', {
      page: 'home',
      timestamp: new Date().toISOString()
    })
  }, [])

  return (
    <>
      <div className="min-h-screen bg-background relative pb-0">
        <HeroSection />
        <DashboardPreview />
        <BentoSection />
        <AboutSection />
        <CTASection />
        <FooterSection />
      </div>
    </>
  )
}
