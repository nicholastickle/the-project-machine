import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { taskbookEntries } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

// GET /api/taskbook - Fetch user's taskbook templates
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's taskbook entries (not deleted)
    const entries = await db
      .select()
      .from(taskbookEntries)
      .where(
        and(
          eq(taskbookEntries.userId, user.id),
          isNull(taskbookEntries.deletedAt)
        )
      )
      .orderBy(taskbookEntries.createdAt);

    return NextResponse.json({ taskbook: entries });
  } catch (error) {
    console.error('[GET /api/taskbook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch taskbook' },
      { status: 500 }
    );
  }
}

// POST /api/taskbook - Create new taskbook template
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, defaultSubtasks, projectId } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create new taskbook entry
    const [newEntry] = await db
      .insert(taskbookEntries)
      .values({
        userId: user.id,
        projectId: projectId || null,
        title: title.trim(),
        description: description || null,
        category: category || null,
        defaultSubtasks: defaultSubtasks || null,
        usageCount: 0,
      })
      .returning();

    return NextResponse.json({ entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/taskbook] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create taskbook entry' },
      { status: 500 }
    );
  }
}
