'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { sessionUtils } from '@/utils/session'

export function useAuthRedirect() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const redirectToAuth = useCallback(() => {
        const isAuthenticated = sessionUtils.isAuthenticated()

        if (isAuthenticated) {
            // User is already authenticated, redirect to canvas
            router.push('/canvas')
        } else {
            // User is not authenticated, redirect to auth page
            router.push('/auth')
        }
    }, [router])

    const redirectWithLoading = useCallback(async (destination: string, delay: number = 800) => {
        setIsLoading(true)
        
        // Add a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, delay))
        
        router.push(destination)
        
        // Reset loading state after a short delay
        setTimeout(() => setIsLoading(false), 100)
    }, [router])

    const signOut = useCallback(() => {
        // Clear the session cookie
        sessionUtils.clearSession()

        // Redirect to landing page
        router.push('/')
    }, [router])

    const isAuthenticated = sessionUtils.isAuthenticated()

    return {
        redirectToAuth,
        redirectWithLoading,
        signOut,
        isAuthenticated,
        isLoading
    }
}