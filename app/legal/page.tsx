import PrivacyPolicy from "@/components/legal/privacy-policy"
import TermsConditions from "@/components/legal/terms-conditions"
import CookiePolicy from "@/components/legal/cookie-policy"
import DataSecurity from "@/components/legal/data-security"
import FooterSection from "@/components/landing/footer-section"
import LegalHeader from "@/components/legal/legal-header"
import LegalContentsTable from "@/components/legal/legal-contents-table"

export default function LegalPage() {

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <LegalHeader />
                <LegalContentsTable />
                <PrivacyPolicy />
                <TermsConditions />
                <CookiePolicy />
                <DataSecurity />
            </div>
            <FooterSection />
        </div>
    )
}