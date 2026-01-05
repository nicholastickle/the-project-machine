import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { referenceNotes, usageLogs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Drizzle to fetch notes with RLS
    const notes = await db
      .select({
        id: referenceNotes.id,
        title: referenceNotes.title,
        content: referenceNotes.content,
        createdAt: referenceNotes.createdAt,
        updatedAt: referenceNotes.updatedAt,
      })
      .from(referenceNotes)
      .where(eq(referenceNotes.projectId, projectId))
      .orderBy(desc(referenceNotes.updatedAt));

    return NextResponse.json({ notes: notes || [] })
  } catch (error: any) {
    console.error('Notes fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Use Drizzle to create note with RLS
    const [note] = await db
      .insert(referenceNotes)
      .values({
        projectId,
        title,
        content,
        createdBy: user.id,
      })
      .returning({
        id: referenceNotes.id,
        title: referenceNotes.title,
        content: referenceNotes.content,
        createdAt: referenceNotes.createdAt,
        updatedAt: referenceNotes.updatedAt,
      });

    // Log usage with Drizzle
    await db.insert(usageLogs).values({
      projectId,
      userId: user.id,
      eventType: 'note_created',
      eventData: { title, content_length: content.length },
    });

    return NextResponse.json({ note })
  } catch (error: any) {
    console.error('Note creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
