import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ProjectInsert } from '@/lib/supabase/types'

// GET /api/projects - List user's projects
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('[GET /api/projects] Auth check:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message
    })
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch projects (RLS will filter to user's projects)
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .is('archived_at', null)
      .order('updated_at', { ascending: false })

    console.log('[GET /api/projects] Query result:', {
      projectCount: projects?.length || 0,
      error: error?.message,
      errorDetails: error
    })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    const projectData: ProjectInsert = {
      name: name.trim(),
      description: description?.trim() || null,
      created_by: user.id
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    console.log('[POST /api/projects] Project created:', {
      projectId: project.id,
      projectName: project.name,
      createdBy: project.created_by
    })

    // Add creator as project member
    const { error: memberError } = await supabase.from('project_members').insert({
      project_id: project.id,
      user_id: user.id,
      role: 'editor'
    })

    if (memberError) {
      console.error('[POST /api/projects] Failed to add creator to project_members:', memberError)
      // Don't fail the request, but log it
    } else {
      console.log('[POST /api/projects] Creator added to project_members')
    }

    // Log usage event
    await supabase.from('usage_logs').insert({
      project_id: project.id,
      user_id: user.id,
      event_type: 'project_created',
      event_data: { name: project.name }
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
