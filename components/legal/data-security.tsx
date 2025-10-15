import React from "react"

export default function DataSecurity() {
    return (
        <section id="data-security" className="space-y-6">
            <div className="pb-4">
                <h2 className="text-3xl font-semibold text-foreground">Data Security</h2>
                <p className="text-sm text-muted-foreground mt-2">Last updated: September 30, 2025</p>
            </div>

            <div className="space-y-6 text-foreground">
                <div>
                    <h3 className="text-xl font-semibold mb-3">Our Commitment to Security</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        At Project Machine, we take data security seriously. We implement industry-standard security measures
                        to protect your personal information and project data from unauthorized access, use, or disclosure.
                        Your trust is important to us, and we are committed to maintaining the highest standards of data protection.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Data Encryption & End-to-End Security</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Project Machine employs <strong>end-to-end encryption</strong> to ensure your data remains private and secure
                        at every step. All data transmitted between your device and our servers is encrypted using industry-standard
                        SSL/TLS encryption. Your project data is encrypted at rest using advanced encryption standards (AES-256).
                        Additionally, we implement end-to-end encryption for sensitive project communications and data sharing,
                        meaning only you and authorized team members can access your information - not even our staff can view
                        your encrypted project data.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">SOC 2 Certification & Compliance</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Project Machine is <strong>SOC 2 Type II certified</strong>, demonstrating our commitment to the highest
                        standards of security, availability, and confidentiality. This certification is awarded after rigorous
                        third-party audits of our security controls, data handling practices, and operational procedures. Our SOC 2
                        compliance ensures that we meet strict criteria for protecting customer data and maintaining system security.
                        We undergo regular audits to maintain this certification and continuously improve our security posture.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Access Controls</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We implement strict access controls to ensure that only authorized personnel can access your data.
                        Our team members undergo security training and are bound by confidentiality agreements. Access to
                        user data is limited to essential functions and is monitored and logged.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Infrastructure Security</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Our infrastructure is hosted on secure cloud platforms that maintain SOC 2 Type II compliance and
                        other industry certifications. We regularly conduct security audits and vulnerability assessments
                        to identify and address potential security risks.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Data Backup & Recovery</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We maintain regular encrypted backups of your data to ensure business continuity and data recovery
                        in the event of an incident. Our backup systems are geographically distributed and regularly tested
                        to ensure data integrity and availability.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Incident Response</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        In the unlikely event of a security incident, we have established procedures to respond quickly and
                        effectively. We will notify affected users and relevant authorities as required by applicable laws
                        and regulations.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Your Role in Security</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        While we implement robust security measures, we encourage users to follow best practices: use strong,
                        unique passwords, enable two-factor authentication when available, and keep your account information
                        up to date. Never share your login credentials with others.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">AI Training and Data Usage</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        <strong>We do not use your data for AI training purposes.</strong> Your project data, personal information,
                        and any content you create within Project Machine will never be used to train artificial intelligence models
                        or machine learning systems. Your data belongs to you and remains confidential. We only process your data
                        to provide you with our project management services and improve your user experience within the platform itself.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3">Questions About Security</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have questions about our security practices or wish to report a security concern,
                        please contact our security team at security@projectmachine.com
                    </p>
                </div>
            </div>
        </section>
    )
}