import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { planSnapshots, usageLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

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
    const [snapshot] = await db
      .select({
        snapshotData: planSnapshots.snapshotData,
        snapshotType: planSnapshots.snapshotType,
        summary: planSnapshots.summary
      })
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

    // Log the restore action
    await db.insert(usageLogs).values({
      projectId: projectId,
      userId: user.id,
      eventType: 'snapshot_restore',
      eventData: {
        snapshot_id: snapshotId,
        snapshot_type: snapshot.snapshotType
      }
    })

    return NextResponse.json({
      snapshot: {
        id: snapshotId,
        snapshot_data: snapshot.snapshotData,
        snapshot_type: snapshot.snapshotType,
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
