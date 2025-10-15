"use client";
import AnimatedSection from "@/components/ui/animated-section";
import { Separator } from "@/components/ui/separator";

export default function LegalContentsTable() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1); 
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <AnimatedSection className="mb-8" delay={0.2}>
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
            <Separator className="my-12 bg-muted/20" />
        </AnimatedSection>
    );
}
