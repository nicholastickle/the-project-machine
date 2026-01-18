"use client"

import { useCallback } from "react"
import Link from "next/link"
import { ProjectMachineLogoFooter } from "@/components/logo/project-machine-logo-footer"
import { AuthRedirectButton } from "@/components/auth/auth-redirect-button"

export default function FooterSection() {
  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) {
        return; // Allow normal navigation for non-anchor links
      }
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const headerHeight = 44 // h-11 = 44px
        const offset = 20 // Additional margin
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    },
    []
  )

  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-row justify-center border-x border-border-dark">

      <div className="w-[60px] diagonal-lines border-x border-border-dark"></div>

      <footer className="flex-1 max-w-[1320px relative flex flex-col overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px]  mb-5">

        {/* 4-column navigation grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">

          {/* Column 1: Logo and Title */}
          <div className="flex flex-col items-start space-y-4 border-r border-border-dark p-5">
            <ProjectMachineLogoFooter />
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col items-start space-y-4 border-r border-border-dark py-5">
            <h3 className="font-semibold text-muted text-sm uppercase tracking-wider">Navigation</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="#features-section" onClick={(e) => handleScroll(e, "#features-section")} className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">Features</Link>
              <Link href="#about-section" onClick={(e) => handleScroll(e, "#about-section")} className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">About</Link>
              <Link href="#faq-section" onClick={(e) => handleScroll(e, "#faq-section")} className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">FAQ</Link>
              <AuthRedirectButton
                text="Get Started"
                asLink={true}
                className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200"
              />
              <Link href="/legal" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">Legal</Link>
            </nav>
          </div>

          {/* Column 3: Social */}
          <div className="flex flex-col items-start space-y-4 border-r border-border-dark py-5">
            <h3 className="font-semibold text-muted text-sm uppercase tracking-wider">Social</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="https://www.linkedin.com/company/the-project-machine/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">LinkedIn</Link>
              <Link href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">Discord</Link>
              <Link href="https://business.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">WhatsApp</Link>
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col items-start space-y-4 py-5">
            <h3 className="font-semibold text-muted text-sm uppercase tracking-wider">Contact</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="mailto:nicholas@projectmachine.com" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">nicholas@projectmachine.com</Link>
              <Link href="https://www.featurebase.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200">Give feedback</Link>
              <span className="text-muted/50 text-sm">London, United Kingdom</span>
            </nav>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-border-dark pt-5 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Project Machine | All rights reserved.
          </p>
        </div>

      </footer>

      <div className="w-[60px] diagonal-lines border-x border-border-dark"></div>
    </div>
  )
}
