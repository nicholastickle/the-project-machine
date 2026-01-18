// ========================================================================
// MEMBER SERVICE
// ========================================================================

import type { ProjectMember } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const memberService = {
  /**
   * Get all members of a project
   */
  getByProject: async (projectId: string): Promise<ProjectMember[]> => {
    return await adapter.members.getByProject(projectId);
  },

  /**
   * Add a member to a project
   */
  add: async (
    projectId: string,
    userId: string,
    role: 'admin' | 'editor' | 'viewer' = 'editor',
    name?: string
  ): Promise<ProjectMember> => {
    return await adapter.members.add(projectId, {
      project_id: projectId,
      user_id: userId,
      role,
      name,
    });
  },

  /**
   * Remove a member from a project
   */
  remove: async (projectId: string, userId: string): Promise<void> => {
    await adapter.members.remove(projectId, userId);
  },
};