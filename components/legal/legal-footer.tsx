"use client"

import Link from "next/link"

export default function LegalFooter() {
    const currentYear = new Date().getFullYear()

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <div className="flex flex-row justify-center border border-muted/20">

            <footer className="flex-1 max-w-[1320px] relative flex flex-col overflow-hidden w-full md:w-[98vw] lg:w-[98vw] xl:w-[1220px] max-w-[1220px]">

                {/* Copyright */}
                <div className="m-5 text-center">
                    <p className="text-muted-foreground text-sm">
                        © {currentYear} Project Machine | All rights reserved.
                    </p>
                </div>

            </footer>
        </div>
    )
}