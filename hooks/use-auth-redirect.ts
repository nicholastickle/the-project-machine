'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { sessionUtils } from '@/utils/session'

export function useAuthRedirect() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check authentication status on mount (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsAuthenticated(sessionUtils.isAuthenticated())
        }
    }, [])

    const redirectToAuth = useCallback(() => {
        const authStatus = typeof window !== 'undefined' ? sessionUtils.isAuthenticated() : false

        if (authStatus) {
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

    return {
        redirectToAuth,
        redirectWithLoading,
        signOut,
        isAuthenticated,
        isLoading
    }
}