import { Separator } from "@/components/ui/separator"

export default function TermsConditions() {
    return (
        <>
            <section id="terms-conditions" className="space-y-6">
                <div className="pb-4">
                    <h2 className="text-3xl font-semibold text-foreground">Terms & Conditions</h2>
                    <p className="text-sm text-muted-foreground mt-2">Last updated: September 30, 2025</p>
                </div>

                <div className="space-y-6 text-foreground">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing and using Project Machine&apos;s services, you accept and agree to be bound by the terms
                            and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">2. Use License</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Permission is granted to temporarily use Project Machine for personal or commercial project management purposes.
                            This is the grant of a license, not a transfer of title, and under this license you may not modify or copy
                            the materials beyond what is necessary for normal use of the service.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">3. User Account</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept
                            responsibility for all activities that occur under your account or password. You must notify us immediately
                            of any unauthorized use of your account.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">4. Service Availability</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We strive to provide reliable service, but cannot guarantee 100% uptime. We reserve the right to modify
                            or discontinue the service at any time, with or without notice. We shall not be liable for any
                            modification, suspension, or discontinuation of the service.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">5. Limitation of Liability</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            In no event shall Project Machine or its suppliers be liable for any damages (including, without limitation,
                            damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                            to use the service, even if Project Machine has been notified of the possibility of such damage.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">6. Contact Information</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Questions about the Terms & Conditions should be sent to us at legal@projectmachine.com
                        </p>
                    </div>
                </div>
            </section>
            <Separator className="my-12 bg-muted/20" />
        </>
    )
}