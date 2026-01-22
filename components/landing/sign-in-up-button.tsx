"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export function SignInUpButton() {
    const { openAuthModal } = useAuth()
    const router = useRouter()
    
    return (
        <Button
            onClick={() => openAuthModal()}
            className="h-8 bg-transparent text-muted hover:text-foreground hover:bg-transparent px-5 rounded-md border border-border-dark font-medium"
        >
            Sign In
        </Button>
    )
}
