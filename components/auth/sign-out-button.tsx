'use client'

import { Button } from '@/components/ui/button'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { LogOut } from 'lucide-react'

interface SignOutButtonProps {
    text?: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
    showIcon?: boolean
    asDropdownItem?: boolean
    children?: React.ReactNode
}

export function SignOutButton({
    text = 'Sign out',
    variant = 'outline',
    size = 'default',
    className,
    showIcon = true,
    asDropdownItem = false,
    children
}: SignOutButtonProps) {
    const { signOut } = useAuthRedirect()

    if (asDropdownItem) {
        return (
            <button
                onClick={signOut}
                className={className}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', width: '100%' }}
            >
                {children || (
                    <>
                        {showIcon && <LogOut />}
                        {text}
                    </>
                )}
            </button>
        )
    }

    return (
        <Button
            onClick={signOut}
            variant={variant}
            size={size}
            className={className}
        >
            {showIcon && <LogOut className="h-4 w-4 mr-2" />}
            {text}
        </Button>
    )
}