import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: projectId, userId: targetUserId } = await params
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id, created_by')
      .eq('id', projectId)
      .eq('created_by', user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Only project owner can remove collaborators' }, { status: 403 })
    }

    // Don't allow removing the owner
    if (targetUserId === project.created_by) {
      return NextResponse.json({ error: 'Cannot remove project owner' }, { status: 400 })
    }

    // Remove collaborator
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', targetUserId)

    if (error) {
      console.error('Error removing collaborator:', error)
      return NextResponse.json({ error: 'Failed to remove collaborator' }, { status: 500 })
    }

    // Log usage
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'collaborator_removed',
      event_data: {
        removed_user_id: targetUserId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Remove collaborator error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
