// =========================================================================
// TASK SERVICE
// =========================================================================

import type { Task, ProjectMember } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const taskService = {
  /**
   * Get all tasks for a project
   */
  getAll: async (projectId: string): Promise<Task[]> => {
    return await adapter.tasks.getAll(projectId);
  },

  /**
   * Get a single task by ID
   */
  getById: async (taskId: string, projectId: string): Promise<Task | null> => {
    return await adapter.tasks.getById(taskId, projectId);
  },

  /**
   * Create a new task
   */
  create: async (
    projectId: string,
    task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'project_id'>
  ): Promise<Task> => {
    return await adapter.tasks.create(projectId, { ...task, project_id: projectId });
  },

  /**
   * Update a task
   */
  update: async (taskId: string, projectId: string, updates: Partial<Task>): Promise<Task> => {
    return await adapter.tasks.update(taskId, projectId, updates);
  },

  /**
   * Delete a task
   */
  delete: async (taskId: string, projectId: string): Promise<void> => {
    await adapter.tasks.delete(taskId, projectId);
  },

  /**
   * Update task status
   */
  updateStatus: async (
    taskId: string,
    projectId: string,
    status: 'backlog' | 'planned' | 'in_progress' | 'stuck' | 'completed' | 'cancelled'
  ): Promise<Task> => {
    return await adapter.tasks.update(taskId, projectId, { status });
  },

  /**
   * Assign task to user
   */
  assignTo: async (taskId: string, projectId: string, userId: string): Promise<Task> => {
    const newMember: ProjectMember = {
      project_id: projectId,
      user_id: userId,
      role: 'editor'
    };
    
    return await adapter.tasks.update(taskId, projectId, { members: [newMember] });
  },
};