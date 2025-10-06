"use client"

import { Separator } from "../components/ui/separator"

// Social Media Icons
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

const RedditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
)

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 py-10 md:py-10">
      {/* Main Footer Content */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
        {/* Left Section: Logo, Description, Social Links */}
        <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
          <div className="flex gap-3 items-stretch justify-center">
            <div className="text-center text-foreground text-xl font-semibold leading-4">Project Machine</div>
          </div>
          <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left">Your AI Project Manager</p>
          <div className="flex justify-start items-start gap-3">
            <a href="https://www.linkedin.com/company/the-project-machine/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-orange-400 transition-colors">
              <LinkedInIcon />
            </a>
            <a href="https://x.com/projectmachine" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-orange-400 transition-colors">
              <XIcon />
            </a>
            <a href="https://reddit.com/r/projectmachine" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-orange-400 transition-colors">
              <RedditIcon />
            </a>
          </div>
        </div>
        {/* Right Section: Product, Company, Legal */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Product</h3>
            <div className="flex flex-col justify-end items-start gap-2">
              <a href="#features-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Features
              </a>
              <a href="#pricing-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Pricing
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Company</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              <a href="#about-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                About
              </a>
              <a href="#faq-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                FAQs
              </a>
              <a href="https://vercel.com/home" target="_blank" rel="noopener noreferrer" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Contact/Feedback
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Legal</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              <a href="/legal" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Privacy Policy
              </a>
              <a href="/legal" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Terms & Conditions
              </a>
              <a href="/legal" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Cookie Policy
              </a>
              <a href="/legal" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Data Security
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section - Always at bottom */}
      <div className="w-full mt-8">
        <Separator className="mb-6" />
        <div className="flex justify-center items-center gap-4 px-4 md:px-8">
          <p className="text-muted-foreground text-sm">
            © 2025 Project Machine | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
