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
      .select('id, name')
      .eq('id', projectId)
      .eq('created_by', user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Only project owner can add collaborators' }, { status: 403 })
    }

    // Check if user exists in auth.users by email
    const { data: invitedUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single()

    // If user exists in system, add directly to project_members
    if (invitedUser) {
      // Check if already a member
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId)
        .eq('user_id', invitedUser.id)
        .single()

      if (existingMember) {
        return NextResponse.json({ error: 'User is already a collaborator' }, { status: 400 })
      }

      // Add to project_members
      const { error: insertError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: invitedUser.id,
          role
        })

      if (insertError) {
        console.error('Error adding collaborator:', insertError)
        return NextResponse.json({ error: 'Failed to add collaborator' }, { status: 500 })
      }

      // Log usage
      await supabase.from('usage_logs').insert({
        project_id: projectId,
        user_id: user.id,
        event_type: 'collaborator_added',
        event_data: {
          invited_email: email,
          role,
          added_directly: true
        }
      })

      return NextResponse.json({
        message: 'User added as collaborator',
        collaborator: {
          user_id: invitedUser.id,
          email,
          role
        }
      })
    }

    // User not in system - create pending invitation
    const inviteToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days to accept

    const { data: invitation, error: inviteError } = await supabase
      .from('pending_invitations')
      .insert({
        project_id: projectId,
        invited_email: email,
        role,
        invited_by: user.id,
        invite_token: inviteToken,
        expires_at: expiresAt.toISOString()
      })
      .select('id, invited_email, role, expires_at')
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 })
    }

    // Log usage
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'invitation_sent',
      event_data: {
        invited_email: email,
        role,
        invite_token: inviteToken
      }
    })

    // TODO: Send email with invitation link
    // In production, use email service (e.g., SendGrid, Resend)
    // const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`
    // await sendEmail(email, 'Project Invitation', inviteLink)

    return NextResponse.json({
      message: 'Invitation created (email not sent - configure email service)',
      invitation: {
        ...invitation,
        invite_link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${inviteToken}`
      },
      note: 'Send this link manually to the user. Email service not configured yet.'
    })

  } catch (error: any) {
    console.error('Invite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

  } catch (error: any) {
    console.error('Invite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
