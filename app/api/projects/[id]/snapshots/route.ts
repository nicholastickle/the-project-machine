import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { PlanSnapshotInsert } from '@/lib/supabase/types'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/snapshots - List snapshots for project
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await context.params
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type') // 'manual' | 'autosave' | 'ai_generated'

    let query = supabase
      .from('plan_snapshots')
      .select('id, project_id, created_at, created_by, snapshot_type, summary, snapshot_data')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (type) {
      query = query.eq('snapshot_type', type)
    }

    const { data: snapshots, error } = await query

    if (error) {
      console.error('Error fetching snapshots:', error)
      return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 })
    }

    return NextResponse.json({ snapshots })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects/[id]/snapshots - Save new snapshot
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await context.params
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { snapshot_data, snapshot_type, summary } = body

    if (!snapshot_data || typeof snapshot_data !== 'object') {
      return NextResponse.json({ error: 'snapshot_data is required' }, { status: 400 })
    }

    // Validate snapshot_data has nodes and edges
    if (!Array.isArray(snapshot_data.nodes) || !Array.isArray(snapshot_data.edges)) {
      return NextResponse.json({ error: 'snapshot_data must have nodes and edges arrays' }, { status: 400 })
    }

    const snapshotData: PlanSnapshotInsert = {
      project_id: projectId,
      snapshot_data: snapshot_data,
      snapshot_type: snapshot_type || 'manual',
      summary: summary || null,
      created_by: user.id
    }

    const { data: snapshot, error } = await supabase
      .from('plan_snapshots')
      .insert(snapshotData)
      .select()
      .single()

    if (error) {
      console.error('Error creating snapshot:', error)
      return NextResponse.json({ error: 'Failed to create snapshot' }, { status: 500 })
    }

    // Log usage event
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'snapshot_saved',
      event_data: {
        snapshot_id: snapshot.id,
        snapshot_type: snapshot.snapshot_type,
        node_count: snapshot_data.nodes.length,
        edge_count: snapshot_data.edges.length
      }
    })

    return NextResponse.json({ snapshot }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
