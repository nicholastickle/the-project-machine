import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { reflections } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

type RouteContext = {
  params: Promise<{ id: string; reflectionId: string }>
}

// GET /api/projects/[id]/reflections/[reflectionId]
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId, reflectionId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Drizzle to fetch reflection with RLS
    const [reflection] = await db
      .select()
      .from(reflections)
      .where(
        and(
          eq(reflections.id, reflectionId),
          eq(reflections.projectId, projectId)
        )
      );

    if (!reflection) {
      return NextResponse.json({ error: 'Reflection not found' }, { status: 404 })
    }

    return NextResponse.json({ reflection })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/projects/[id]/reflections/[reflectionId]
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId, reflectionId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { reflection_type, content, tags } = body

    const updateData: any = {}
    if (reflection_type !== undefined) updateData.reflectionType = reflection_type
    if (content !== undefined) updateData.content = content
    if (tags !== undefined) updateData.tags = tags

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Use Drizzle to update reflection with RLS
    const [reflection] = await db
      .update(reflections)
      .set(updateData)
      .where(
        and(
          eq(reflections.id, reflectionId),
          eq(reflections.projectId, projectId)
        )
      )
      .returning();

    if (!reflection) {
      return NextResponse.json({ error: 'Reflection not found' }, { status: 404 })
    }

    return NextResponse.json({ reflection })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]/reflections/[reflectionId]
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId, reflectionId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Drizzle to delete reflection with RLS
    await db
      .delete(reflections)
      .where(
        and(
          eq(reflections.id, reflectionId),
          eq(reflections.projectId, projectId)
        )
      );

    if (error) {
      console.error('Error deleting reflection:', error)
      return NextResponse.json({ error: 'Failed to delete reflection' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
