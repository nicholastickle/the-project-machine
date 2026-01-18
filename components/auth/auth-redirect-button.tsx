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
    const { isAuthenticated } = useAuthRedirect()

    const handleClick = () => {
        if (isAuthenticated) {
            window.open('/canvas', '_blank')
        } else {
            window.open('/auth', '_blank')
        }
    }

    if (asLink) {
        return (
            <button
                onClick={handleClick}
                className={className}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
                {text}
            </button>
        )
    }

    return (
        <Button
            onClick={handleClick}
            variant={variant}
            size={size}
            className={className}
        >
            {text}
        </Button>
    )
}