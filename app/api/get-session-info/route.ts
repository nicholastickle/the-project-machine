import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/get-session-info
 * 
 * Returns your current session info if you're logged in via browser.
 * This helps you get the cookie value to use in REST Client/Postman.
 * 
 * Usage:
 * 1. Go to http://localhost:3000/canvas (you'll be logged in)
 * 2. Call this endpoint from REST Client
 * 3. It will return your session info and show you how to use the cookie
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json(
        {
          authenticated: false,
          message: 'You are not logged in. Please log in at http://localhost:3000/canvas first, then make this request from the browser or REST Client with cookies enabled.',
          error: error?.message
        },
        { status: 401 }
      )
    }

    // Extract the auth cookie from the request
    const cookies = request.cookies.getAll()
    const authCookie = cookies.find(c => c.name.includes('auth-token'))

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at
      },
      session_info: {
        expires_at: new Date(session.expires_at! * 1000).toISOString(),
        provider: session.user.app_metadata?.provider
      },
      auth_cookie: authCookie ? {
        name: authCookie.name,
        value_length: authCookie.value.length,
        first_50_chars: authCookie.value.substring(0, 50) + '...',
        instructions: [
          '✅ Copy the cookie value above',
          '📋 Use it in REST Client:',
          '   @authCookie = <paste the FULL cookie value here>',
          '   Cookie: {{authCookie}}'
        ]
      } : {
        message: 'No auth cookie found. Make sure you\'re testing from the browser context.'
      }
    })
  } catch (error) {
    console.error('[GET /api/get-session-info] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: String(error)
      },
      { status: 500 }
    )
  }
}
