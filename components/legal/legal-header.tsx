"use client";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function LegalHeader() {
    return (
        <>
            <AnimatedSection className="mb-8" delay={0}>
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <span className="mr-2">←</span>
                    Back to Home
                </Link>
            </AnimatedSection>

            <AnimatedSection className="mb-12 text-center" delay={0.1}>
                <h1 className="text-4xl font-bold text-foreground mb-4">Legal Information</h1>
                <p className="text-lg text-muted-foreground">
                    Important legal documents and policies for Project Machine
                </p>
            </AnimatedSection>
        </>
    );
}
