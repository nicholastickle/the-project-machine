import React from "react"

export function CookiePolicy() {
    return (
        <section id="cookie-policy" className="space-y-6">
            <div className="pb-4">
                <h2 className="text-3xl font-semibold text-foreground">Cookie Policy</h2>
                <p className="text-sm text-muted-foreground mt-2">Last updated: September 30, 2025</p>
            </div>

            <div className="space-y-6 text-foreground">
                <div>
                    <h3 className="text-xl font-semibold mb-3">What Are Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Cookies are small text files that are stored on your computer or mobile device when you visit our website.
                        They help us provide you with a better experience by remembering your preferences and understanding how
                        you use our service.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">How We Use Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Project Machine uses cookies for several purposes: to keep you signed in, remember your preferences,
                        analyze how our service is used, and provide personalized content. We use both session cookies
                        (which expire when you close your browser) and persistent cookies (which remain until deleted).
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Types of Cookies We Use</h3>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-foreground">Essential Cookies</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                These cookies are necessary for the service to function properly and cannot be disabled.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Analytics Cookies</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                These help us understand how users interact with our service by collecting anonymous usage data.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Preference Cookies</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                These remember your settings and preferences to provide a personalized experience.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Managing Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        You can control and/or delete cookies as you wish. You can delete all cookies that are already on your
                        computer and you can set most browsers to prevent them from being placed. However, if you do disable
                        cookies, some features of our service may not function properly.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about our use of cookies, please contact us at cookies@projectmachine.com
                    </p>
                </div>
            </div>
        </section>
    )
}