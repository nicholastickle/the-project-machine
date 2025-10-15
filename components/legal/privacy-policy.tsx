"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import AnimatedSection from "@/components/ui/animated-section"

export default function PrivacyPolicy() {
    return (
        <>
            <AnimatedSection className="space-y-8" delay={0.3}>
                <section id="privacy-policy" className="space-y-6">
                    <div className="pb-4">
                        <h2 className="text-3xl font-semibold text-foreground">Privacy Policy</h2>
                        <p className="text-sm text-muted-foreground mt-2">Last updated: September 30, 2025</p>
                    </div>

                    <div className="space-y-6 text-foreground">
                        <div>
                            <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                At Project Machine, we collect information you provide directly to us, such as when you create an account,
                                use our services, or contact us for support. This may include your name, email address, and project data
                                that you choose to store in our platform.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We use the information we collect to provide, maintain, and improve our AI project management services.
                                This includes processing your project data to provide AI-powered insights, managing your account,
                                and communicating with you about our services.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">3. Information Sharing</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
                                except as described in this policy. We may share information with trusted service providers who assist us
                                in operating our platform, subject to confidentiality agreements.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We implement appropriate security measures to protect your personal information against unauthorized access,
                                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">5. Contact Us</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at privacy@projectmachine.com
                            </p>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
            <Separator className="my-12 bg-muted/20" />
        </>
    )
}