import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ReflectionInsert } from '@/lib/supabase/types'

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

    const { data: reflections, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching reflections:', error)
      return NextResponse.json({ error: 'Failed to fetch reflections' }, { status: 500 })
    }

    return NextResponse.json({ reflections })
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

    const reflectionData: ReflectionInsert = {
      project_id: projectId,
      reflection_type,
      content: content.trim(),
      created_by: user.id
    }

    const { data: reflection, error } = await supabase
      .from('reflections')
      .insert(reflectionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating reflection:', error)
      return NextResponse.json({ error: 'Failed to create reflection' }, { status: 500 })
    }

    // Log usage
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'reflection_added',
      event_data: { reflection_type }
    })

    return NextResponse.json({ reflection }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
