/**
 * Integration test for project persistence
 * This tests the actual Supabase database with RLS policies
 * Run with: npm test -- tests/integration/project-lifecycle.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

describe('Project Lifecycle Integration Test', () => {
  let testEmail: string
  let testPassword: string
  let userId: string
  let projectId: string

  beforeAll(() => {
    testEmail = `test-${Date.now()}@example.com`
    testPassword = 'test-password-123'
  })

  it('should create user, project, and persist across sessions', async () => {
    // Step 1: Sign up
    const supabase1 = createClient(supabaseUrl, supabaseKey)
    
    const { data: signUpData, error: signUpError } = await supabase1.auth.signUp({
      email: testEmail,
      password: testPassword,
    })

    expect(signUpError).toBeNull()
    expect(signUpData.user).toBeDefined()
    userId = signUpData.user!.id
    console.log('✓ User signed up:', userId)

    // Step 2: Create project
    const { data: project, error: projectError } = await supabase1
      .from('projects')
      .insert({
        name: 'Test Project',
        description: 'Integration test',
        created_by: userId,
      })
      .select()
      .single()

    expect(projectError).toBeNull()
    expect(project).toBeDefined()
    projectId = project.id
    console.log('✓ Project created:', projectId)

    // Step 3: Add to project_members
    const { error: memberError } = await supabase1
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role: 'editor',
      })

    expect(memberError).toBeNull()
    console.log('✓ Added to project_members')

    // Step 4: Sign out
    await supabase1.auth.signOut()
    console.log('✓ Signed out')

    // Step 5: Sign in again (simulate new session)
    const supabase2 = createClient(supabaseUrl, supabaseKey)
    
    const { data: signInData, error: signInError } = await supabase2.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    expect(signInError).toBeNull()
    expect(signInData.user).toBeDefined()
    expect(signInData.user!.id).toBe(userId)
    console.log('✓ Signed in again')

    // Step 6: Fetch projects (this should work with RLS)
    const { data: projects, error: fetchError } = await supabase2
      .from('projects')
      .select('*')
      .is('archived_at', null)

    console.log('Fetch result:', {
      projectCount: projects?.length || 0,
      error: fetchError,
      projects: projects?.map(p => ({ id: p.id, name: p.name }))
    })

    expect(fetchError).toBeNull()
    expect(projects).toBeDefined()
    expect(projects!.length).toBeGreaterThan(0)
    expect(projects!.find(p => p.id === projectId)).toBeDefined()
    console.log('✓ Project persisted and visible after re-login!')

    // Cleanup
    await supabase2.from('projects').delete().eq('id', projectId)
    await supabase2.auth.signOut()
  }, 30000) // 30 second timeout for network requests
})
