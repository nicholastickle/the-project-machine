import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { projects, projectMembers, usageLogs, pendingInvitations } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'

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
    const [project] = await db
      .select({
        id: projects.id,
        created_by: projects.createdBy
      })
      .from(projects)
      .where(eq(projects.id, projectId))

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user is owner or member
    const isOwner = project.created_by === user.id
    if (!isOwner) {
      const [member] = await db
        .select({ userId: projectMembers.userId })
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, user.id)
          )
        )

      if (!member) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Get all collaborators
    const members = await db
      .select({
        user_id: projectMembers.userId,
        role: projectMembers.role,
        joined_at: projectMembers.joinedAt
      })
      .from(projectMembers)
      .where(eq(projectMembers.projectId, projectId))
      .orderBy(asc(projectMembers.joinedAt))

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
    const [project] = await db
      .select({
        id: projects.id,
        name: projects.name
      })
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.createdBy, user.id)
        )
      )

    if (!project) {
      return NextResponse.json({ error: 'Only project owner can add collaborators' }, { status: 403 })
    }

    // Check if user exists in auth.users by email (must use Supabase for auth.users)
    const { data: invitedUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single()

    // If user exists in system, add directly to project_members
    if (invitedUser) {
      // Check if already a member
      const [existingMember] = await db
        .select({ userId: projectMembers.userId })
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, invitedUser.id)
          )
        )

      if (existingMember) {
        return NextResponse.json({ error: 'User is already a collaborator' }, { status: 400 })
      }

      // Add to project_members
      await db
        .insert(projectMembers)
        .values({
          projectId,
          userId: invitedUser.id,
          role
        })

      // Log usage
      await db.insert(usageLogs).values({
        projectId: projectId,
        userId: user.id,
        eventType: 'collaborator_added',
        eventData: {
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

    const [invitation] = await db
      .insert(pendingInvitations)
      .values({
        projectId,
        invitedEmail: email,
        role,
        invitedBy: user.id,
        inviteToken,
        expiresAt
      })
      .returning({
        id: pendingInvitations.id,
        invited_email: pendingInvitations.invitedEmail,
        role: pendingInvitations.role,
        expires_at: pendingInvitations.expiresAt
      })

    // Log usage
    await db.insert(usageLogs).values({
      projectId: projectId,
      userId: user.id,
      eventType: 'invitation_sent',
      eventData: {
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
