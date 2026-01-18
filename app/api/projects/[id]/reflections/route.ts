import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { reflections, usageLogs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/reflections - List reflections
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Use Drizzle to fetch reflections with RLS
    const reflectionsList = await db
      .select()
      .from(reflections)
      .where(eq(reflections.projectId, projectId))
      .orderBy(desc(reflections.createdAt))
      .limit(limit);

    return NextResponse.json({ reflections: reflectionsList })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects/[id]/reflections - Create reflection
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { reflection_type, content } = body

    if (!reflection_type || !['start_of_day', 'end_of_day'].includes(reflection_type)) {
      return NextResponse.json({ error: 'Valid reflection_type required (start_of_day or end_of_day)' }, { status: 400 })
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Use Drizzle to create reflection with RLS
    const [reflection] = await db
      .insert(reflections)
      .values({
        projectId,
        createdBy: user.id, // Changed from userId to match schema
        reflectionType: reflection_type,
        content: content.trim(),
      })
      .returning();

    // Log usage with Drizzle
    await db.insert(usageLogs).values({
      projectId,
      userId: user.id,
      eventType: 'reflection_added',
      eventData: { reflection_type },
    });

    return NextResponse.json({ reflection }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
