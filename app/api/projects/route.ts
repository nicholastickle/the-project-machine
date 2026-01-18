import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects, projectMembers, usageLogs } from '@/lib/db/schema'
import { isNull, desc, eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/auth/session'
import { createProjectSchema } from '@/lib/validation/schemas'
import { handleApiError } from '@/lib/api-handler'
import { logger } from '@/lib/logger'
import { ServerError } from '@/lib/errors'

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
  try {
    logger.info('[GET /api/projects] Starting request')
    const user = await getCurrentUser()

    // Fetch projects with Drizzle (RLS will filter to user's projects)
    const projectsList = await db
      .select()
      .from(projects)
      .where(isNull(projects.archivedAt))
      .orderBy(desc(projects.updatedAt));

    logger.info('[GET /api/projects] Query result', {
      projectCount: projectsList?.length || 0
    })

    return NextResponse.json({ projects: projectsList })
  } catch (error) {
    return handleApiError(error)
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
      // Zod errors are handled by handleApiError automatically if thrown or passed manually
      // Here we can just return the standardized error response directly for manual Zod check
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: result.error.flatten()
          }
        },
        { status: 400 }
      )
    }

    const { name, description } = result.data

    // 3. Database Operation (Transactional-ish)
    const [project] = await db
      .insert(projects)
      .values({
        name,
        description: description || null,
        createdBy: user.id,
      })
      .returning();

    if (!project) {
      throw new ServerError('Failed to create project record')
    }

    // Force add creator as editor
    try {
      await db.insert(projectMembers).values({
        projectId: project.id,
        userId: user.id,
        role: 'editor',
      });
    } catch (memberError) {
      const wrappedError = memberError instanceof Error ? memberError : new Error(String(memberError));
      logger.error('[CRITICAL] Failed to add creator to project members', wrappedError)

      // Attempt cleanup (compensation action)
      await db.delete(projects).where(eq(projects.id, project.id))

      throw new ServerError('Failed to initialize project membership. Please try again.')
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
    return handleApiError(error)
  }
}
