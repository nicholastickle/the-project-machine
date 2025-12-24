import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UsageLogInsert } from '@/lib/supabase/types';

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

    const logData: UsageLogInsert = {
      event_type,
      project_id: project_id || null,
      user_id: user?.id || null,
      event_data: event_data || null
    };

    const { error } = await supabase
      .from('usage_logs')
      .insert(logData);

    if (error) {
      console.error('Error logging usage:', error);
      return NextResponse.json({ error: 'Failed to log usage' }, { status: 500 });
    }

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
    const { data: logs, error } = await supabase
      .from('usage_logs')
      .select('event_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching usage:', error);
      return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
    }

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
