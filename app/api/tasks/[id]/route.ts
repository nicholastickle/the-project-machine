import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(
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
    const { title, description, status, estimatedHours, timeSpent, sortOrder } = body;

    // Build update object with only provided fields
    const updateData: any = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    // Update task (RLS will ensure user has permission)
    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found or no permission' }, { status: 404 });
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('[PATCH /api/tasks/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Soft delete (set deletedAt timestamp)
    const [deletedTask] = await db
      .update(tasks)
      .set({ deletedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();

    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found or no permission' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted', task: deletedTask });
  } catch (error) {
    console.error('[DELETE /api/tasks/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
