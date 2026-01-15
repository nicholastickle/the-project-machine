import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';
import { createTaskSchema } from '@/lib/validation/schemas';
import { handleApiError } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { ServerError } from '@/lib/errors';

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id: projectId } = await context.params;

  try {
    const user = await getCurrentUser();

    // Fetch all non-deleted tasks for this project
    // RLS will automatically filter to only tasks user has access to
    const projectTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, projectId),
          isNull(tasks.deletedAt)
        )
      );

    return NextResponse.json({ tasks: projectTasks });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/projects/:id/tasks - Create new task
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { id: projectId } = await context.params;

  try {
    // 1. Strict Auth Check
    const user = await getCurrentUser()

    // 2. Input Validation
    const body = await request.json()
    const result = createTaskSchema.safeParse(body)

    if (!result.success) {
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

    const { title, description, status, estimatedHours, sortOrder } = result.data

    // 3. Insert Task
    const [newTask] = await db
      .insert(tasks)
      .values({
        projectId,
        title,
        description: description || null,
        status,
        estimatedHours: estimatedHours || null,
        sortOrder: sortOrder || 0,
        createdBy: user.id,
        timeSpent: 0,
      })
      .returning();

    if (!newTask) {
      throw new ServerError('Failed to create task record')
    }

    return NextResponse.json({ task: newTask }, { status: 201 });

  } catch (error) {
    return handleApiError(error);
  }
}
