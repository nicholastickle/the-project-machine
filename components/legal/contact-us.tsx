"use client"

import Link from "next/link"

export default function ContactUs() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    return (
        <>

            <section id="contact-us" className="space-y-6">
                <div className="pb-4">
                    <h2 className="text-3xl font-semibold text-foreground">4. Contact Us</h2>
                    <p className="text-sm text-muted-foreground mt-2">Get in touch with our team</p>
                </div>

                <div className="space-y-6 text-foreground">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">4.1. General Inquiries</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about Project Machine, feature requests, technical support, or general inquiries,
                            please don&apos;t hesitate to reach out to us.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">4.2. Email Support</h3>
                        <p className="text-muted-foreground leading-relaxed mb-2">
                            Our primary contact method is email. We typically respond within 24 hours during business days.
                        </p>
                        <div className="">
                            <p className="text-foreground font-medium">
                                Email: <a
                                    href="mailto:nicholas@theprojectmachine.com"
                                    className="text-foreground underline"
                                >
                                    nicholas@theprojectmachine.com
                                </a>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">4.3. What to Include</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            When contacting us, please include relevant details about your inquiry to help us assist you more effectively.
                            This might include your account information (if applicable), steps to reproduce any issues,
                            or specific questions about our features.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">4.4. Response Time</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We aim to respond to all inquiries within 24 hours during business days (Monday through Friday).
                            For technical support issues, we prioritize based on severity and may respond sooner for critical matters.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex justify-start items-center pt-8 gap-10">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="mr-2">←</span>
                            Back to Home
                        </Link>

                        <button
                            onClick={scrollToTop}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <span className="mr-2">↑</span>
                            Return to Top
                        </button>
                    </div>
                </div>
            </section>

        </>
    )
}