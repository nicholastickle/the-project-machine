import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Validates the current user session server-side.
 * Throws an AuthError if the user is not authenticated.
 * 
 * @returns The authenticated user object
 */
export async function getCurrentUser(): Promise<User> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    console.error('[Auth] Failed to get user:', error?.message)
    throw new AuthError('Unauthorized', 401)
  }

  return user
}

/**
 * Ensures the user is a member of the project (or the owner).
 * Throws if access is denied.
 * 
 * @param projectId The project ID to check
 * @param requiredRole Minimum role required (optional)
 */
export async function requireProjectAccess(projectId: string, requiredRole?: 'editor' | 'viewer') {
  const user = await getCurrentUser()
  const supabase = await createClient()

  // 1. Check if owner
  const { data: project } = await supabase
    .from('projects')
    .select('created_by')
    .eq('id', projectId)
    .single()

  if (project?.created_by === user.id) {
    return { user, role: 'owner' }
  }

  // 2. Check membership
  const { data: member } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single()

  if (member) {
    if (requiredRole === 'editor' && member.role !== 'editor') {
       throw new AuthError('Insufficient permissions', 403)
    }
    return { user, role: member.role }
  }

  throw new AuthError('Forbidden', 403)
}
