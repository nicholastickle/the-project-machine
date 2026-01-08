import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractUserFromCookies, createAuthenticatedClient } from '@/lib/supabase/auth-utils'
import { db } from '@/lib/db'
import { projects, projectMembers, usageLogs } from '@/lib/db/schema'
import { isNull, desc, eq } from 'drizzle-orm'
import { getCurrentUser, AuthError } from '@/lib/auth/session'
import { createProjectSchema } from '@/lib/validation/schemas'

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
  try {
    console.log('[GET /api/projects] Starting request')
    const user = await getCurrentUser()

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
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
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
    // 1. Strict Auth Check
    const user = await getCurrentUser()

    // 2. Input Validation
    const body = await request.json()
    const result = createProjectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, description } = result.data

    // 3. Database Operation (Transactional-ish)
    // Drizzle doesn't support nested transactions easily with standard client, 
    // so we sequence carefully: Project -> Member -> Usage.
    // If Member fails, we should ideally rollback, but for now we'll just error hard.

    const [project] = await db
      .insert(projects)
      .values({
        name,
        description: description || null,
        createdBy: user.id,
      })
      .returning();

    if (!project) {
      throw new Error('Failed to create project record')
    }

    // Force add creator as editor
    try {
      await db.insert(projectMembers).values({
        projectId: project.id,
        userId: user.id,
        role: 'editor',
      });
    } catch (memberError) {
      console.error('[CRITICAL] Failed to add creator to project members:', memberError)
      // Attempt cleanup (compensation action)
      await db.delete(projects).where(eq(projects.id, project.id))
      return NextResponse.json(
        { error: 'Failed to initialize project membership. Please try again.' },
        { status: 500 }
      )
    }

    // Log usage (fire and forget / non-critical)
    try {
      await db.insert(usageLogs).values({
        projectId: project.id,
        userId: user.id,
        eventType: 'project_created',
        eventData: { name: project.name },
      });
    } catch (e) { /* ignore usage logging failure */ }

    return NextResponse.json({ project }, { status: 201 })

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('[POST /api/projects] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
