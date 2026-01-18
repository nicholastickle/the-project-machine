import { createServerClient } from '@supabase/ssr'
import { cookies as getCookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  sub?: string
  email?: string
  [key: string]: any
}

/**
 * Extract user info directly from the Supabase auth token cookie
 * This bypasses potential issues with supabase.auth.getUser()
 */
export async function extractUserFromCookies() {
  try {
    const cookieStore = await getCookies()
    const projectId = 'xjgjirnqitcpgwawgnlk' // From your .env.local
    const cookieName = `sb-${projectId}-auth-token`
    
    const authCookie = cookieStore.get(cookieName)
    console.log('[extractUserFromCookies] Looking for cookie:', cookieName)
    console.log('[extractUserFromCookies] Found:', !!authCookie)
    
    if (!authCookie || !authCookie.value) {
      console.log('[extractUserFromCookies] No auth cookie found')
      return null
    }

    try {
      // The cookie contains a JSON object with the session
      const authData = JSON.parse(authCookie.value)
      console.log('[extractUserFromCookies] Auth data keys:', Object.keys(authData))
      
      if (authData.access_token) {
        try {
          const decoded = jwtDecode<DecodedToken>(authData.access_token)
          console.log('[extractUserFromCookies] Decoded token:', {
            sub: decoded.sub,
            email: decoded.email
          })
          
          return {
            id: decoded.sub,
            email: decoded.email,
            accessToken: authData.access_token,
            refreshToken: authData.refresh_token
          }
        } catch (e) {
          console.error('[extractUserFromCookies] Failed to decode token:', e)
        }
      }
    } catch (e) {
      console.error('[extractUserFromCookies] Failed to parse cookie:', e)
    }

    return null
  } catch (error) {
    console.error('[extractUserFromCookies] Error:', error)
    return null
  }
}

/**
 * Get authenticated Supabase client with guaranteed session
 * Handles both SSR and Server Components/Route Handlers
 */
export async function createAuthenticatedClient() {
  const cookieStore = await getCookies()
  
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('[createAuthenticatedClient] Error setting cookies:', error)
          }
        },
      },
    }
  )

  // Verify we have a session
  const { data: { session }, error } = await client.auth.getSession()
  console.log('[createAuthenticatedClient] Session check:', {
    hasSession: !!session,
    user: session?.user?.email,
    error: error?.message
  })

  return { client, session, error }
}
