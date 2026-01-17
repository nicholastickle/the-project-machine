// =========================================================================
// COMMENT SERVICE
// =========================================================================

import type { TaskComment } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const commentService = {
    /**
     * Get all comments for a task
     */
    getByTask: async (taskId: string, projectId: string): Promise<TaskComment[]> => {
        return await adapter.comments.getByTask(taskId, projectId);
    },


    /**
     * Create a comment on a task
     */
    createOnTask: async (
        projectId: string,
        taskId: string,
        userId: string,
        comment: string
    ): Promise<TaskComment> => {
        return await adapter.comments.create(projectId, {
            task_id: taskId,
            user_id: userId,
            user_name: '', // This would need to be passed in or retrieved from user context
            content: comment,
        });
    },

    /**
     * Delete a comment
     */
    delete: async (commentId: string, projectId: string): Promise<void> => {
        await adapter.comments.delete(commentId, projectId);
    },
};