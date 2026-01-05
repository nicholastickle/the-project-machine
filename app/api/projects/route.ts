import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractUserFromCookies, createAuthenticatedClient } from '@/lib/supabase/auth-utils'
import { db } from '@/lib/db'
import { projects, projectMembers, usageLogs } from '@/lib/db/schema'
import { isNull, desc } from 'drizzle-orm'

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/projects] Starting request')
    console.log('[GET /api/projects] Request headers:', {
      cookie: request.headers.get('cookie') ? 'set' : 'not set',
      authorization: request.headers.get('authorization') ? 'set' : 'not set',
    })
    
    // Try the standard approach first
    const supabase = await createClient()
    let { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('[GET /api/projects] Standard auth check:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message
    })
    
    // If standard auth fails, try extracting from cookies directly
    if (!user && authError) {
      console.log('[GET /api/projects] Standard auth failed, trying cookie extraction...')
      const userFromCookie = await extractUserFromCookies()
      if (userFromCookie) {
        user = {
          id: userFromCookie.id!,
          email: userFromCookie.email,
          // @ts-ignore - just setting the fields we need
          aud: 'authenticated',
          role: 'authenticated',
        }
        authError = null
        console.log('[GET /api/projects] Successfully extracted user from cookies:', {
          userId: user.id,
          userEmail: user.email
        })
      }
    }
    
    if (authError || !user) {
      console.error('[GET /api/projects] Authorization failed:', {
        authError: authError?.message,
        noUser: !user
      })
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          details: authError?.message || 'No user found in session',
          debug: {
            hasAuthError: !!authError,
            hasUser: !!user
          }
        }, 
        { status: 401 }
      )
    }

    // Fetch projects with Drizzle (RLS will filter to user's projects)
    const projectsList = await db
      .select()
      .from(projects)
      .where(isNull(projects.archivedAt))
      .orderBy(desc(projects.updatedAt));

    console.log('[GET /api/projects] Query result:', {
      projectCount: projectsList?.length || 0,
      error: undefined,
      errorDetails: null
    })

    return NextResponse.json({ projects: projectsList })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: String(error) 
      }, 
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    // Use Drizzle to create project with RLS
    const [project] = await db
      .insert(projects)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        createdBy: user.id,
      })
      .returning();

    console.log('[POST /api/projects] Project created:', {
      projectId: project.id,
      projectName: project.name,
      createdBy: project.createdBy
    })

    // Add creator as project member with Drizzle
    try {
      await db.insert(projectMembers).values({
        projectId: project.id,
        userId: user.id,
        role: 'editor',
      });
      console.log('[POST /api/projects] Creator added to project_members')
    } catch (memberError) {
      console.error('[POST /api/projects] Failed to add creator to project_members:', memberError)
      // Don't fail the request, but log it
    }

    // Log usage event with Drizzle
    await db.insert(usageLogs).values({
      projectId: project.id,
      userId: user.id,
      eventType: 'project_created',
      eventData: { name: project.name },
    });

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
