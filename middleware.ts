import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // This refreshes a user's session in the background
    await supabase.auth.getUser()
  } catch (error) {
    // Silently continue if middleware fails
    console.error('[middleware] Error:', error)
  }
  
  return response
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    // Run middleware on all routes except:
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
