"use client"

import { PrivacyPolicy } from "@/components/legal/privacy-policy"
import { TermsConditions } from "@/components/legal/terms-conditions"
import { CookiePolicy } from "@/components/legal/cookie-policy"
import { DataSecurity } from "@/components/legal/data-security"
import { FooterSection } from "@/components/landing/footer-section"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LegalPage() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const targetId = href.substring(1) // Remove '#' from href
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" })
        }
    }


    return (
        <div
            className={`min-h-screen bg-background transition-all duration-700 ease-out ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
        >
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back to Home Link */}
                <div className={`mb-8 transition-all duration-700 ease-out delay-100 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                    }`}>
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <span className="mr-2">←</span>
                        Back to Home
                    </Link>
                </div>

                {/* Page Header */}
                <div className={`mb-12 text-center transition-all duration-700 ease-out delay-200 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}>
                    <h1 className="text-4xl font-bold text-foreground mb-4">Legal Information</h1>
                    <p className="text-lg text-muted-foreground">
                        Important legal documents and policies for Project Machine
                    </p>
                </div>

                {/* Table of Contents */}
                <div className={`mb-8 transition-all duration-700 ease-out delay-300 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}>
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
                <div className={`space-y-8 transition-all duration-700 ease-out delay-500 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                    }`}>
                    <PrivacyPolicy />

                    <Separator className="my-12" />

                    <TermsConditions />

                    <Separator className="my-12" />

                    <CookiePolicy />

                    <Separator className="my-12" />

                    <DataSecurity />

                    <Separator className="my-12" />

                </div>
            </div>

            {/* Footer */}
            <FooterSection />
        </div>
    )
}