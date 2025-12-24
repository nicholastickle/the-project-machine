import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ id: string; snapshotId: string }>
}

// GET /api/projects/[id]/snapshots/[snapshotId] - Get specific snapshot
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId, snapshotId } = await context.params
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: snapshot, error } = await supabase
      .from('plan_snapshots')
      .select('*')
      .eq('id', snapshotId)
      .eq('project_id', projectId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 })
      }
      console.error('Error fetching snapshot:', error)
      return NextResponse.json({ error: 'Failed to fetch snapshot' }, { status: 500 })
    }

    // Log usage event
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'snapshot_loaded',
      event_data: { snapshot_id: snapshot.id }
    })

    return NextResponse.json({ snapshot })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
