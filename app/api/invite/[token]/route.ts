import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const supabase = await createClient()
    const { token } = await params
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in first.' }, { status: 401 })
    }

    // Find invitation by token
    const { data: invitation, error: inviteError } = await supabase
      .from('pending_invitations')
      .select('id, project_id, invited_email, role, expires_at, accepted_at')
      .eq('invite_token', token)
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 })
    }

    // Check if already accepted
    if (invitation.accepted_at) {
      return NextResponse.json({ error: 'Invitation already accepted' }, { status: 400 })
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 })
    }

    // Check if email matches (optional - can allow any authenticated user)
    if (user.email && invitation.invited_email !== user.email) {
      return NextResponse.json({
        error: 'This invitation was sent to a different email address',
        details: `Expected: ${invitation.invited_email}, Got: ${user.email}`
      }, { status: 403 })
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', invitation.project_id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      // Mark as accepted but don't re-add
      await supabase
        .from('pending_invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitation.id)

      return NextResponse.json({
        message: 'You are already a member of this project',
        project_id: invitation.project_id
      })
    }

    // Add to project_members
    const { error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id: invitation.project_id,
        user_id: user.id,
        role: invitation.role
      })

    if (memberError) {
      console.error('Error adding member:', memberError)
      return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 })
    }

    // Mark invitation as accepted
    await supabase
      .from('pending_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id)

    // Log usage
    await supabase.from('usage_logs').insert({
      project_id: invitation.project_id,
      user_id: user.id,
      event_type: 'invitation_accepted',
      event_data: {
        invitation_id: invitation.id,
        role: invitation.role
      }
    })

    return NextResponse.json({
      message: 'Invitation accepted successfully',
      project_id: invitation.project_id,
      role: invitation.role
    })
  } catch (error: any) {
    console.error('Accept invitation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
