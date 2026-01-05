import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { taskComments } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch non-deleted comments
    const comments = await db
      .select()
      .from(taskComments)
      .where(
        and(
          eq(taskComments.taskId, taskId),
          isNull(taskComments.deletedAt)
        )
      )
      .orderBy(taskComments.createdAt);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('[GET /api/tasks/[id]/comments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Create comment
    const [newComment] = await db
      .insert(taskComments)
      .values({
        taskId,
        userId: user.id,
        content: content.trim(),
      })
      .returning();

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tasks/[id]/comments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
