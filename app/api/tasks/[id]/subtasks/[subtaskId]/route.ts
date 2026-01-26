import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { subtasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type RouteContext = {
  params: Promise<{ id: string; subtaskId: string }>
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { id: taskId, subtaskId } = await context.params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: any = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.isCompleted !== undefined) updateData.isCompleted = body.isCompleted;
    if (body.estimatedDuration !== undefined) updateData.estimatedDuration = body.estimatedDuration;
    if (body.timeSpent !== undefined) updateData.timeSpent = body.timeSpent;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

    // Update subtask
    const [updatedSubtask] = await db
      .update(subtasks)
      .set(updateData)
      .where(eq(subtasks.id, subtaskId))
      .returning();

    if (!updatedSubtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }

    return NextResponse.json({ subtask: updatedSubtask });
  } catch (error) {
    console.error('[PATCH /api/tasks/[id]/subtasks/[subtaskId]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update subtask' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id: taskId, subtaskId } = await context.params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete subtask
    const [deletedSubtask] = await db
      .delete(subtasks)
      .where(eq(subtasks.id, subtaskId))
      .returning();

    if (!deletedSubtask) {
      return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, subtask: deletedSubtask });
  } catch (error) {
    console.error('[DELETE /api/tasks/[id]/subtasks/[subtaskId]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete subtask' },
      { status: 500 }
    );
  }
}
