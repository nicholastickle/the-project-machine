import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { planSnapshots, usageLogs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

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

    let query = db
      .select()
      .from(planSnapshots)
      .where(eq(planSnapshots.projectId, projectId))
      .orderBy(desc(planSnapshots.createdAt))
      .limit(limit)

    if (type) {
      query = query.where(eq(planSnapshots.snapshotType, type))
    }

    const snapshots = await query

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

    const [snapshot] = await db
      .insert(planSnapshots)
      .values({
        projectId: projectId,
        snapshotData: snapshot_data,
        snapshotType: snapshot_type || 'manual',
        summary: summary || null,
        createdBy: user.id
      })
      .returning()

    // Log usage event
    await db.insert(usageLogs).values({
      projectId: projectId,
      userId: user.id,
      eventType: 'snapshot_saved',
      eventData: {
        snapshot_id: snapshot.id,
        snapshot_type: snapshot.snapshotType,
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
