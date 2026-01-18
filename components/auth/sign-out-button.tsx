'use client'

import { useAuthRedirect } from '@/hooks/use-auth-redirect'

interface SignOutButtonProps {
    text?: string
    className?: string
    children?: React.ReactNode
}

export function SignOutButton({
    text = 'Sign out',
    className,
    children
}: SignOutButtonProps) {
    const { signOut } = useAuthRedirect()

    return (
        <span
            onClick={signOut}
            className={className}
            style={{ cursor: 'pointer' }}
        >
            {children || text}
        </span>
    )
}