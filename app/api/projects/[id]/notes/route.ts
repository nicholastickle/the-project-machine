import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const { data: notes, error } = await supabase
      .from('reference_notes')
      .select('id, title, content, created_at, updated_at')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error loading notes:', error)
      return NextResponse.json({ error: 'Failed to load notes' }, { status: 500 })
    }

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

    const { data: note, error } = await supabase
      .from('reference_notes')
      .insert({
        project_id: projectId,
        title,
        content,
        created_by: user.id
      })
      .select('id, title, content, created_at, updated_at')
      .single()

    if (error) {
      console.error('Error creating note:', error)
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
    }

    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'note_created',
      event_data: { title, content_length: content.length }
    })

    return NextResponse.json({ note })
  } catch (error: any) {
    console.error('Note creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
