import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { usageLogs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// POST /api/usage - Log usage event
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user (optional - usage can be logged without auth for some events)
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { event_type, project_id, event_data } = body;

    if (!event_type || typeof event_type !== 'string') {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 });
    }

    await db.insert(usageLogs).values({
      eventType: event_type,
      projectId: project_id || null,
      userId: user?.id || null,
      eventData: event_data || null
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Usage logging error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/usage - Get usage stats (admin only - requires service role)
export async function GET() {
  try {
    // TODO: Add admin authentication check
    // For now, return basic stats

    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's usage stats
    const logs = await db
      .select({
        event_type: usageLogs.eventType,
        created_at: usageLogs.createdAt
      })
      .from(usageLogs)
      .where(eq(usageLogs.userId, user.id))
      .orderBy(desc(usageLogs.createdAt))
      .limit(100);

    // Aggregate by event type
    const summary: Record<string, number> = {};
    logs?.forEach(log => {
      summary[log.event_type] = (summary[log.event_type] || 0) + 1;
    });

    return NextResponse.json({
      total_events: logs?.length || 0,
      summary,
      recent_events: logs?.slice(0, 10)
    });
  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
