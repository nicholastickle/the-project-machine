import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { taskComments } from '@/lib/db/schema';
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

    // Fetch non-deleted comments with user info
    const comments = await db
      .select()
      .from(taskComments)
      .where(
        and(
          eq(taskComments.taskId, taskId),
          isNull(taskComments.deletedAt)
        )
      )
      .orderBy(asc(taskComments.createdAt));

    // Enrich comments with user names from Supabase auth
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          // Fetch user from Supabase auth
          const { data: userData } = await supabase.auth.admin.getUserById(comment.userId);
          return {
            ...comment,
            userName: userData?.user?.email?.split('@')[0] || 'User'
          };
        } catch (error) {
          return {
            ...comment,
            userName: 'User'
          };
        }
      })
    );

    return NextResponse.json({ comments: enrichedComments });
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

    // Add userName to response
    const commentWithUserName = {
      ...newComment,
      userName: user.email?.split('@')[0] || 'You'
    };

    return NextResponse.json({ comment: commentWithUserName }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tasks/[id]/comments] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
