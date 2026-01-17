'use client'

import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'pm_session'
const SESSION_EXPIRY_DAYS = 30

export interface SessionData {
    userId: string
    email: string
    createdAt: string
}

// Client-side session functions
export const sessionUtils = {
    // Check if user has valid session cookie
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false

        const sessionCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${SESSION_COOKIE_NAME}=`))

        return !!sessionCookie
    },

    // Get session data from cookie
    getSession(): SessionData | null {
        if (typeof window === 'undefined') return null

        try {
            const sessionCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith(`${SESSION_COOKIE_NAME}=`))

            if (!sessionCookie) return null

            const sessionValue = sessionCookie.split('=')[1]
            return JSON.parse(decodeURIComponent(sessionValue))
        } catch {
            return null
        }
    },

    // Create session cookie (call after successful auth)
    createSession(sessionData: SessionData): void {
        if (typeof window === 'undefined') return

        const expires = new Date()
        expires.setDate(expires.getDate() + SESSION_EXPIRY_DAYS)

        const sessionValue = encodeURIComponent(JSON.stringify(sessionData))
        document.cookie = `${SESSION_COOKIE_NAME}=${sessionValue}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
    },

    // Clear session cookie (sign out)
    clearSession(): void {
        if (typeof window === 'undefined') return

        document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
}

// Server-side session functions (for server components)
export const serverSessionUtils = {
    async isAuthenticated(): Promise<boolean> {
        try {
            const cookieStore = await cookies()
            const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
            return !!sessionCookie
        } catch {
            return false
        }
    },

    async getSession(): Promise<SessionData | null> {
        try {
            const cookieStore = await cookies()
            const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

            if (!sessionCookie) return null

            return JSON.parse(sessionCookie.value)
        } catch {
            return null
        }
    }
}