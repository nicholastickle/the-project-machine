import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { planSnapshots, usageLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

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

    const [snapshot] = await db
      .select()
      .from(planSnapshots)
      .where(
        and(
          eq(planSnapshots.id, snapshotId),
          eq(planSnapshots.projectId, projectId)
        )
      )

    if (!snapshot) {
      return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 })
    }

    // Log usage event
    await db.insert(usageLogs).values({
      projectId: projectId,
      userId: user.id,
      eventType: 'snapshot_loaded',
      eventData: { snapshot_id: snapshot.id }
    })

    return NextResponse.json({ snapshot })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
