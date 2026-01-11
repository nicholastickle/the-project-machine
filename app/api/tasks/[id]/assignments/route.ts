import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { taskAssignments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

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

    const assignments = await db
      .select()
      .from(taskAssignments)
      .where(eq(taskAssignments.taskId, taskId));

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('[GET /api/tasks/[id]/assignments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
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
    const { userId: assigneeUserId, role = 'assignee' } = body;

    if (!assigneeUserId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Create assignment
    const [newAssignment] = await db
      .insert(taskAssignments)
      .values({
        taskId,
        userId: assigneeUserId,
        role,
        assignedBy: user.id,
      })
      .returning();

    return NextResponse.json({ assignment: newAssignment }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tasks/[id]/assignments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId query param required' }, { status: 400 });
    }

    // Delete assignment
    await db
      .delete(taskAssignments)
      .where(
        and(
          eq(taskAssignments.taskId, taskId),
          eq(taskAssignments.userId, userId)
        )
      );

    return NextResponse.json({ message: 'Assignment removed' });
  } catch (error) {
    console.error('[DELETE /api/tasks/[id]/assignments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to remove assignment' },
      { status: 500 }
    );
  }
}
