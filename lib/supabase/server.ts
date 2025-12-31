import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    console.log('[createClient] Cookies available:', {
      count: allCookies.length,
      names: allCookies.map((c: any) => c.name).join(', '),
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'not set',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set'
    })

    const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookies = cookieStore.getAll()
            console.log('[createClient.cookies.getAll] Returning', cookies.length, 'cookies')
            return cookies
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                console.log('[createClient.cookies.setAll] Setting cookie:', name)
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              console.error('[createClient.cookies.setAll] Error:', error)
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    return client
  } catch (error) {
    console.error('[createClient] Error creating client:', error)
    throw error
  }
}
