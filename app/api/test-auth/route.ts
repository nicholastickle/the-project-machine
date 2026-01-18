import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/test-auth
 * 
 * Returns current session info for testing purposes.
 * Shows you what cookies and session are available on the server.
 * 
 * Usage in REST Client:
 * @sessionInfo = {{sessionToken}}
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/test-auth] Debug endpoint - checking current auth')
    
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Extract cookies from request
    const cookies = request.cookies.getAll()
    const cookieInfo = cookies.map(c => ({
      name: c.name,
      value: c.value.substring(0, 50) + (c.value.length > 50 ? '...' : ''),
      size: c.value.length
    }))

    if (user) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        cookies: cookieInfo,
        message: '✅ You are authenticated! This endpoint proves your session works.'
      })
    } else {
      return NextResponse.json({
        authenticated: false,
        error: authError?.message || 'No authenticated session found',
        cookies: cookieInfo,
        message: '❌ Not authenticated. When you access this from REST Client/Postman, you need to include auth cookies.',
        debug: {
          cookieCount: cookies.length,
          authError: authError?.message
        }
      }, { status: 401 })
    }
  } catch (error) {
    console.error('[GET /api/test-auth] Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 })
  }
}
