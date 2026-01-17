// =========================================================================
// PROJECT SERVICE
// =========================================================================

import type { Project, ProjectData } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const projectService = {
  /**
   * Get all projects for a user
   */
  getAll: async (userId: string): Promise<Project[]> => {
    return await adapter.projects.getAll(userId);
  },

  /**
   * Get a project by ID
   */
  getById: async (projectId: string): Promise<Project | null> => {
    return await adapter.projects.getById(projectId);
  },

  /**
   * Get complete project data (includes tasks, nodes, edges, etc.)
   */
  getData: async (projectId: string): Promise<ProjectData | null> => {
    return await adapter.projects.getData(projectId);
  },

  /**
   * Create a new project
   */
  create: async (
    userId: string,
    project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'owner_id'>
  ): Promise<Project> => {
    return await adapter.projects.create(userId, project);
  },

  /**
   * Update a project
   */
  update: async (projectId: string, updates: Partial<Project>): Promise<Project> => {
    return await adapter.projects.update(projectId, updates);
  },

  /**
   * Delete a project
   */
  delete: async (projectId: string, userId: string): Promise<void> => {
    await adapter.projects.delete(projectId, userId);
  },
};