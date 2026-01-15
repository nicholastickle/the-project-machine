import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { chatMessages, projects, usageLogs } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

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

    // Verify project ownership
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get chat history (ordered chronologically)
    const messages = await db
      .select({
        id: chatMessages.id,
        role: chatMessages.role,
        content: chatMessages.content,
        created_at: chatMessages.createdAt
      })
      .from(chatMessages)
      .where(eq(chatMessages.projectId, projectId))
      .orderBy(asc(chatMessages.createdAt))

    return NextResponse.json({ messages: messages || [] })
  } catch (error: any) {
    console.error('Chat history error:', error)
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
    const { role, content } = body

    if (!role || !content) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 })
    }

    if (role !== 'user' && role !== 'assistant') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Verify project ownership
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Insert message
    const [message] = await db
      .insert(chatMessages)
      .values({
        projectId,
        role,
        content,
        createdBy: role === 'user' ? user.id : null // Only set for user messages, null for AI
      })
      .returning({
        id: chatMessages.id,
        role: chatMessages.role,
        content: chatMessages.content,
        created_at: chatMessages.createdAt
      })

    // Log usage
    await db.insert(usageLogs).values({
      projectId: projectId,
      userId: user.id,
      eventType: 'chat_message',
      eventData: {
        role,
        message_length: content.length
      }
    })

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error('Chat save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    // Verify project ownership
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete all chat messages for this project
    await db
      .delete(chatMessages)
      .where(eq(chatMessages.projectId, projectId))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Chat clear error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
