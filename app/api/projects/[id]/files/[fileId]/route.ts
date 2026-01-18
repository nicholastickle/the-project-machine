import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ id: string; fileId: string }>
}

// PATCH /api/projects/[id]/files/[fileId] - Confirm/edit file summary
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId, fileId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { summary } = body

    if (!summary || typeof summary !== 'string') {
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 })
    }

    // Update file summary with user confirmation
    const { data: file, error } = await supabase
      .from('file_summaries')
      .update({
        summary: summary.trim(),
        confirmed_at: new Date().toISOString()
      })
      .eq('id', fileId)
      .eq('project_id', projectId)
      .select()
      .single()

    if (error || !file) {
      console.error('Error confirming file:', error)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Log confirmation
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'file_confirmed',
      event_data: {
        file_id: fileId,
        filename: file.filename
      }
    })

    return NextResponse.json({ file })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/files/[fileId] - Delete file
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId, fileId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get file info
    const { data: file } = await supabase
      .from('file_summaries')
      .select('storage_path')
      .eq('id', fileId)
      .eq('project_id', projectId)
      .single()

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('project-files')
      .remove([file.storage_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('file_summaries')
      .delete()
      .eq('id', fileId)
      .eq('project_id', projectId)

    if (dbError) {
      console.error('Database delete error:', dbError)
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
