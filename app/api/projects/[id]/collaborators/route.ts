import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await params
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to project
    const { data: project } = await supabase
      .from('projects')
      .select('id, created_by')
      .eq('id', projectId)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user is owner or member
    const isOwner = project.created_by === user.id
    if (!isOwner) {
      const { data: member } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single()

      if (!member) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Get all collaborators
    const { data: members, error } = await supabase
      .from('project_members')
      .select(`
        user_id,
        role,
        joined_at
      `)
      .eq('project_id', projectId)
      .order('joined_at', { ascending: true })

    if (error) {
      console.error('Error loading collaborators:', error)
      return NextResponse.json({ error: 'Failed to load collaborators' }, { status: 500 })
    }

    // Add project owner to the list
    const collaborators = [
      {
        user_id: project.created_by,
        role: 'owner',
        joined_at: null
      },
      ...(members || [])
    ]

    return NextResponse.json({ collaborators })
  } catch (error: any) {
    console.error('Collaborators fetch error:', error)
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
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, role = 'editor' } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (role !== 'editor' && role !== 'viewer') {
      return NextResponse.json({ error: 'Invalid role. Must be "editor" or "viewer"' }, { status: 400 })
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('created_by', user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Only project owner can add collaborators' }, { status: 403 })
    }

    // TODO: In production, send email invitation instead of direct add
    // For now, we'll just return success with a note
    // Real implementation would:
    // 1. Create pending_invitations table entry
    // 2. Send email with invitation link
    // 3. User accepts invite via link
    // 4. Add to project_members

    return NextResponse.json({
      message: 'Invitation feature coming soon',
      details: 'In v1.0, this will send an email invitation to the user'
    }, { status: 501 }) // Not Implemented

  } catch (error: any) {
    console.error('Invite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
