import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { TaskbookEntry } from './types';

// Extract the subtask type for better type safety
type SubtaskType = NonNullable<TaskbookEntry['subtasks']>[number];

interface TaskbookState {
    savedTasks: TaskbookEntry[];
    hasNewTask: boolean;
    isLoading: boolean;
    
    // Backend integration
    fetchTaskbook: () => Promise<void>;
    addSavedTask: (task: Omit<TaskbookEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
    removeTask: (taskId: string) => Promise<void>;
    updateSavedTask: (taskId: string, updates: Partial<TaskbookEntry>) => Promise<void>;
    
    // Subtask operations (local + sync)
    addSubtask: (taskId: string) => void;
    updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubtaskType>) => void;
    deleteSubtask: (taskId: string, subtaskId: string) => void;
    
    clearNewTaskIndicator: () => void;
}

// These match the tasks that get added to canvas after user confirms AI plan
const seedTasks: TaskbookEntry[] = [];

const useTaskbookStore = create<TaskbookState>()((set, get) => ({
    savedTasks: seedTasks,
    hasNewTask: false,
    isLoading: false,

    fetchTaskbook: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/taskbook');
            if (response.ok) {
                const data = await response.json();
                set({ savedTasks: data.taskbook || [], isLoading: false });
            } else {
                console.error('[Taskbook Store] Failed to fetch taskbook');
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('[Taskbook Store] Error fetching taskbook:', error);
            set({ isLoading: false });
        }
    },

    addSavedTask: async (task) => {
        try {
            const response = await fetch('/api/taskbook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    category: task.category,
                    defaultSubtasks: task.subtasks,
                    projectId: null,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                set({
                    savedTasks: [...get().savedTasks, data.entry],
                    hasNewTask: true,
                });
            } else {
                console.error('[Taskbook Store] Failed to create task');
            }
        } catch (error) {
            console.error('[Taskbook Store] Error creating task:', error);
        }
    },

    removeTask: async (taskId: string) => {
        // Optimistic update
        const oldTasks = get().savedTasks;
        set({
            savedTasks: oldTasks.filter(task => task.id !== taskId)
        });

        try {
            const response = await fetch(`/api/taskbook/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Revert on failure
                set({ savedTasks: oldTasks });
                console.error('[Taskbook Store] Failed to delete task');
            }
        } catch (error) {
            // Revert on error
            set({ savedTasks: oldTasks });
            console.error('[Taskbook Store] Error deleting task:', error);
        }
    },

    updateSavedTask: async (taskId: string, updates: Partial<TaskbookEntry>) => {
        const isOnlyUsedAtUpdate = Object.keys(updates).length === 1 && 'used_at' in updates;

        // Optimistic update
        const oldTasks = get().savedTasks;
        set({
            savedTasks: oldTasks.map(task =>
                task.id === taskId
                    ? { ...task, ...updates }
                    : task
            )
        });

        try {
            const response = await fetch(`/api/taskbook/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                // Revert on failure
                set({ savedTasks: oldTasks });
                console.error('[Taskbook Store] Failed to update task');
            }
        } catch (error) {
            // Revert on error
            set({ savedTasks: oldTasks });
            console.error('[Taskbook Store] Error updating task:', error);
        }
    },

            addSubtask: (taskId: string) => {
                const now = new Date().toISOString();
                const newSubtask = {
                    id: `subtask-${uuidv4()}`,
                    title: '',
                    is_completed: false,
                    estimated_duration: 0,
                    time_spent: 0,
                    sort_order: 0,
                    created_at: now,
                    updated_at: now
                };

                const updatedTask = get().savedTasks.find(t => t.id === taskId);
                if (!updatedTask) return;

                const newSubtasks = [...(updatedTask.subtasks || []), newSubtask];
                
                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? { ...task, subtasks: newSubtasks }
                            : task
                    )
                });

                // Sync to backend
                get().updateSavedTask(taskId, { subtasks: newSubtasks as any });
            },

            updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubtaskType>) => {
                const updatedTask = get().savedTasks.find(t => t.id === taskId);
                if (!updatedTask) return;

                const newSubtasks = (updatedTask.subtasks || []).map(subtask =>
                    subtask.id === subtaskId
                        ? { ...subtask, ...updates }
                        : subtask
                );

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? { ...task, subtasks: newSubtasks }
                            : task
                    )
                });

                // Sync to backend
                get().updateSavedTask(taskId, { subtasks: newSubtasks as any });
            },

            deleteSubtask: (taskId: string, subtaskId: string) => {
                const updatedTask = get().savedTasks.find(t => t.id === taskId);
                if (!updatedTask) return;

                const newSubtasks = (updatedTask.subtasks || []).filter(subtask => subtask.id !== subtaskId);

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? { ...task, subtasks: newSubtasks }
                            : task
                    )
                });

                // Sync to backend
                get().updateSavedTask(taskId, { subtasks: newSubtasks as any });
            },

            clearNewTaskIndicator: () => {
                set({ hasNewTask: false });
            },
        }));

export default useTaskbookStore;
