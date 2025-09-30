"use client"

import { PrivacyPolicy } from "@/components/legal/privacy-policy"
import { TermsConditions } from "@/components/legal/terms-conditions"
import { CookiePolicy } from "@/components/legal/cookie-policy"
import { DataSecurity } from "@/components/legal/data-security"
import { FooterSection } from "@/components/landing/footer-section"
import { Separator } from "@/components/ui/separator"
import { AnimatedSection } from "@/components/legal/animated-section"
import Link from "next/link"

export default function LegalPage() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const targetId = href.substring(1) // Remove '#' from href
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" })
        }
    }


    return (
        <AnimatedSection delay={0.2}>
            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Back to Home Link */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="mr-2">←</span>
                            Back to Home
                        </Link>
                    </div>

                    {/* Page Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Legal Information</h1>
                        <p className="text-lg text-muted-foreground">
                            Important legal documents and policies for Project Machine
                        </p>
                    </div>

                    {/* Table of Contents */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold text-foreground mb-6">Table of Contents</h2>
                        <nav className="space-y-3">
                            <div>
                                <a
                                    href="#privacy-policy"
                                    onClick={(e) => handleScroll(e, "#privacy-policy")}
                                    className="inline-block text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    1. Privacy Policy
                                </a>
                            </div>
                            <div>
                                <a
                                    href="#terms-conditions"
                                    onClick={(e) => handleScroll(e, "#terms-conditions")}
                                    className="inline-block text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    2. Terms & Conditions
                                </a>
                            </div>
                            <div>
                                <a
                                    href="#cookie-policy"
                                    onClick={(e) => handleScroll(e, "#cookie-policy")}
                                    className="inline-block text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    3. Cookie Policy
                                </a>
                            </div>
                            <div>
                                <a
                                    href="#data-security"
                                    onClick={(e) => handleScroll(e, "#data-security")}
                                    className="inline-block text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                    4. Data Security
                                </a>
                            </div>
                        </nav>
                    </div>

                    <Separator className="my-12" />

                    {/* Legal Sections with Separators */}
                    <div className="space-y-8">
                        <PrivacyPolicy />

                        <Separator className="my-12" />

                        <TermsConditions />

                        <Separator className="my-12" />

                        <CookiePolicy />

                        <Separator className="my-12" />

                        <DataSecurity />
                    </div>
                </div>

                {/* Footer */}
                <FooterSection />
            </div>
        </AnimatedSection>
    )
}