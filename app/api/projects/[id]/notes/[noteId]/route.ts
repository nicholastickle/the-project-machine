import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { referenceNotes, usageLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: projectId, noteId } = await params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (content !== undefined) updates.content = content

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    // Use Drizzle to update note with RLS
    updates.updatedAt = new Date();
    const [note] = await db
      .update(referenceNotes)
      .set(updates)
      .where(
        and(
          eq(referenceNotes.id, noteId),
          eq(referenceNotes.projectId, projectId)
        )
      )
      .returning({
        id: referenceNotes.id,
        title: referenceNotes.title,
        content: referenceNotes.content,
        updatedAt: referenceNotes.updatedAt,
      });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ note })
  } catch (error: any) {
    console.error('Note update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: projectId, noteId } = await params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Drizzle to delete note with RLS
    await db
      .delete(referenceNotes)
      .where(
        and(
          eq(referenceNotes.id, noteId),
          eq(referenceNotes.projectId, projectId)
        )
      );

    // Log usage with Drizzle
    await db.insert(usageLogs).values({
      projectId,
      userId: user.id,
      eventType: 'note_deleted',
      eventData: { note_id: noteId }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Note deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
