import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    console.error('[GET /api/projects/[id]/tasks] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status = 'backlog', estimatedHours, sortOrder = 0 } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Insert new task
    const [newTask] = await db
      .insert(tasks)
      .values({
        projectId,
        title,
        description,
        status,
        estimatedHours,
        sortOrder,
        createdBy: user.id,
        timeSpent: 0,
      })
      .returning();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects/[id]/tasks] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
