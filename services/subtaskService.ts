// =========================================================================
// SUBTASK SERVICE
// ========================================================================

import type { Subtask } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const subtaskService = {
  /**
   * Get all subtasks for a task
   */
  getByTask: async (taskId: string, projectId: string): Promise<Subtask[]> => {
    return await adapter.subtasks.getByTask(taskId, projectId);
  },

  /**
   * Create a new subtask
   */
  create: async (
    projectId: string,
    subtask: Omit<Subtask, 'id' | 'created_at'>
  ): Promise<Subtask> => {
    return await adapter.subtasks.create(projectId, subtask);
  },

  /**
   * Update a subtask
   */
  update: async (
    subtaskId: string,
    projectId: string,
    updates: Partial<Subtask>
  ): Promise<Subtask> => {
    return await adapter.subtasks.update(subtaskId, projectId, updates);
  },

  /**
   * Toggle subtask completion
   */
  toggleComplete: async (subtaskId: string, projectId: string): Promise<Subtask> => {
    const subtasks = await adapter.subtasks.getByTask('', projectId);
    const subtask = subtasks.find(s => s.id === subtaskId);
    if (!subtask) throw new Error('Subtask not found');
    
    return await adapter.subtasks.update(subtaskId, projectId, {
      is_completed: !subtask.is_completed,
    });
  },

  /**
   * Delete a subtask
   */
  delete: async (subtaskId: string, projectId: string): Promise<void> => {
    await adapter.subtasks.delete(subtaskId, projectId);
  },
};