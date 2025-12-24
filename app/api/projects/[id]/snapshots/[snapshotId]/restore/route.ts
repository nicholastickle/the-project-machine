import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ id: string; snapshotId: string }>
}

// POST /api/projects/[id]/snapshots/[snapshotId]/restore
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId, snapshotId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the snapshot
    const { data: snapshot, error } = await supabase
      .from('plan_snapshots')
      .select('snapshot_data, snapshot_type, summary')
      .eq('id', snapshotId)
      .eq('project_id', projectId)
      .single()

    if (error || !snapshot) {
      console.error('Error fetching snapshot:', error)
      return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 })
    }

    // Log the restore action
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'snapshot_restore',
      event_data: {
        snapshot_id: snapshotId,
        snapshot_type: snapshot.snapshot_type
      }
    })

    return NextResponse.json({
      snapshot: {
        id: snapshotId,
        snapshot_data: snapshot.snapshot_data,
        snapshot_type: snapshot.snapshot_type,
        summary: snapshot.summary
      }
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
