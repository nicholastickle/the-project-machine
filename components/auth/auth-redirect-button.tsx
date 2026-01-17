'use client'

import { Button } from '@/components/ui/button'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

interface AuthRedirectButtonProps {
    text?: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
    asLink?: boolean
}

export function AuthRedirectButton({
    text = 'Get started',
    variant = 'default',
    size = 'default',
    className,
    asLink = false
}: AuthRedirectButtonProps) {
    const { redirectToAuth } = useAuthRedirect()

    if (asLink) {
        return (
            <button
                onClick={redirectToAuth}
                className={className}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
            >
                {text}
            </button>
        )
    }

    return (
        <Button
            onClick={redirectToAuth}
            variant={variant}
            size={size}
            className={className}
        >
            {text}
        </Button>
    )
}