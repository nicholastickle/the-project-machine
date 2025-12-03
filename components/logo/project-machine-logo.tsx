"use client"

import Image from "next/image"
import Link from "next/link"

interface ProjectMachineLogoProps {
    size?: "sm" | "md" | "lg" | "xl" | "xxl"
    showText?: boolean
    href?: string
    className?: string
}

export function ProjectMachineLogo({
    size = "md",
    showText = true,
    href = "/",
    className = ""
}: ProjectMachineLogoProps) {

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
        xl: "w-12 h-12",
        xxl: "w-100 h-100"
    }

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        xxl: "text-2xl"
    }

    const LogoContent = () => (
        <div className={`flex items-center gap-3 transition-all duration-300 ${className}`}>
            <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
                <Image
                    src="/logos/logo.svg"
                    alt="Project Machine"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                    priority
                />
            </div>
            {showText && (
                <span className={`font-semibold text-foreground ${textSizeClasses[size]} whitespace-nowrap transition-opacity duration-200`}>
                    Project Machine
                </span>
            )}
        </div>
    )

    if (href) {
        return (
            <Link
                href={href}
                className="flex items-center"
                aria-label="Project Machine - Go to homepage"
            >
                <LogoContent />
            </Link>
        )
    }

    return <LogoContent />
}
