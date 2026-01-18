import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { subtasks } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { asc } from 'drizzle-orm';

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id: taskId } = await context.params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all subtasks (no deletedAt column)
    const taskSubtasks = await db
      .select()
      .from(subtasks)
      .where(eq(subtasks.taskId, taskId))
      .orderBy(asc(subtasks.sortOrder));

    return NextResponse.json({ subtasks: taskSubtasks });
  } catch (error) {
    console.error('[GET /api/tasks/[id]/subtasks] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtasks' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { id: taskId } = await context.params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, estimatedDuration = 0, sortOrder = 0 } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Insert new subtask
    const [newSubtask] = await db
      .insert(subtasks)
      .values({
        taskId,
        title,
        estimatedDuration,
        sortOrder,
        isCompleted: false,
        timeSpent: 0,
      })
      .returning();

    return NextResponse.json({ subtask: newSubtask }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tasks/[id]/subtasks] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create subtask' },
      { status: 500 }
    );
  }
}
