"use client"

import { Loader2 } from "lucide-react"
import { ProjectMachineLogoStandard } from "@/components/logo/project-machine-logo-standard"

interface LoadingSkeletonProps {
    size?: "sm" | "md" | "lg"
}

export function LoadingSkeleton({
    size = "md",
}: LoadingSkeletonProps) {
    const sizeClasses = {
        sm: {
            logo: "h-12 w-12",
            spinner: "h-5 w-5",
        },
        md: {
            logo: "h-16 w-16",
            spinner: "h-6 w-6",
        },
        lg: {
            logo: "h-24 w-24",
            spinner: "h-8 w-8",
        },
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6">
                {/* Logo */}
                <ProjectMachineLogoStandard 
                    size={
                        size === "sm" ? 48 : 
                        size === "md" ? 64 : 
                        96
                    } 
                />

                {/* Spinner */}
                <Loader2
                    className={`${sizeClasses[size].spinner} animate-spin text-muted-foreground`}
                />
            </div>
        </div>
    )
}