"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export function SignInUpButton() {
    const { user, openAuthModal } = useAuth()
    const router = useRouter()
    
    const handleClick = () => {
        if (user) {
            // Already logged in, go to canvas
            router.push('/canvas')
        } else {
            // Not logged in, show auth modal
            openAuthModal()
        }
    }
    
    return (
        <Button
            onClick={handleClick}
            className="h-8 bg-transparent text-muted hover:text-foreground hover:bg-transparent px-5 rounded-md border border-border-dark font-medium"
        >
            {user ? 'Go to Canvas' : 'Sign In'}
        </Button>
    )
}
