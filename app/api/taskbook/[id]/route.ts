import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { taskbookEntries } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH /api/taskbook/[id] - Update taskbook template
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, defaultSubtasks, usageCount } = body;

    // Verify ownership
    const [existing] = await db
      .select()
      .from(taskbookEntries)
      .where(
        and(
          eq(taskbookEntries.id, id),
          eq(taskbookEntries.userId, user.id),
          isNull(taskbookEntries.deletedAt)
        )
      );

    if (!existing) {
      return NextResponse.json({ error: 'Taskbook entry not found' }, { status: 404 });
    }

    // Update entry
    const [updated] = await db
      .update(taskbookEntries)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(defaultSubtasks !== undefined && { defaultSubtasks }),
        ...(usageCount !== undefined && { usageCount }),
        updatedAt: new Date(),
      })
      .where(eq(taskbookEntries.id, id))
      .returning();

    return NextResponse.json({ entry: updated });
  } catch (error) {
    console.error('[PATCH /api/taskbook/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update taskbook entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/taskbook/[id] - Soft delete taskbook template
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(taskbookEntries)
      .where(
        and(
          eq(taskbookEntries.id, id),
          eq(taskbookEntries.userId, user.id),
          isNull(taskbookEntries.deletedAt)
        )
      );

    if (!existing) {
      return NextResponse.json({ error: 'Taskbook entry not found' }, { status: 404 });
    }

    // Soft delete
    await db
      .update(taskbookEntries)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(taskbookEntries.id, id));

    return NextResponse.json({ message: 'Taskbook entry deleted' });
  } catch (error) {
    console.error('[DELETE /api/taskbook/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete taskbook entry' },
      { status: 500 }
    );
  }
}
