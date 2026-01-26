import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { taskComments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { id: commentId } = await context.params;

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

    // Update comment (RLS ensures only owner can update)
    const [updatedComment] = await db
      .update(taskComments)
      .set({
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(taskComments.id, commentId),
          eq(taskComments.userId, user.id) // Only author can edit
        )
      )
      .returning();

    if (!updatedComment) {
      return NextResponse.json({ error: 'Comment not found or no permission' }, { status: 404 });
    }

    // Add userName to response
    const commentWithUserName = {
      ...updatedComment,
      userName: user.email?.split('@')[0] || 'You'
    };

    return NextResponse.json({ comment: commentWithUserName });
  } catch (error) {
    console.error('[PATCH /api/comments/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id: commentId } = await context.params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soft delete (RLS ensures only owner can delete)
    const [deletedComment] = await db
      .update(taskComments)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(taskComments.id, commentId),
          eq(taskComments.userId, user.id) // Only author can delete
        )
      )
      .returning();

    if (!deletedComment) {
      return NextResponse.json({ error: 'Comment not found or no permission' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted', comment: deletedComment });
  } catch (error) {
    console.error('[DELETE /api/comments/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
