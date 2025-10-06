import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

interface ProjectMachineLogoProps {
    size?: "sm" | "md" | "lg" | "xl"
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
    const { open, openMobile, isMobile } = useSidebar()

    // Use the appropriate open state based on device type
    const isOpen = isMobile ? openMobile : open
    const [showDelayedText, setShowDelayedText] = useState(isOpen)

    // Handle delayed text visibility
    useEffect(() => {
        if (isOpen && showText) {
            // Delay showing text when opening (to allow sidebar animation to complete)
            const timer = setTimeout(() => {
                setShowDelayedText(true)
            }, 150) // 150ms delay matches typical sidebar animation duration

            return () => clearTimeout(timer)
        } else {
            // Hide text immediately when closing
            setShowDelayedText(false)
        }
    }, [isOpen, showText])

    // Only show text when conditions are met AND after delay
    const shouldShowText = showText && isOpen && showDelayedText

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
        xl: "w-12 h-12"
    }

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
    }

    const LogoContent = () => (
        <div className={`flex items-center gap-3 transition-all duration-300 ${className}`}>
            <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
                <Image
                    src="/logos/logo.svg"
                    alt="Project Machine"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    priority
                />
            </div>
            {shouldShowText && (
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
                className="flex items-center "
                aria-label="Project Machine - Go to homepage"
            >
                <LogoContent />
            </Link>
        )
    }

    return <LogoContent />
}
