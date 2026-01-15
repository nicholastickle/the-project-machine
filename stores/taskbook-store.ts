import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { TaskbookEntry } from './types';

// Extract the subtask type for better type safety
type SubtaskType = NonNullable<TaskbookEntry['subtasks']>[number];

interface TaskbookState {
    savedTasks: TaskbookEntry[];
    hasNewTask: boolean;
    addSavedTask: (task: Omit<TaskbookEntry, 'id' | 'created_at' | 'updated_at'>) => void;
    removeTask: (taskId: string) => void;
    updateSavedTask: (taskId: string, updates: Partial<TaskbookEntry>) => void;
    addSubtask: (taskId: string) => void;
    updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubtaskType>) => void;
    deleteSubtask: (taskId: string, subtaskId: string) => void;
    clearNewTaskIndicator: () => void;
}

// These match the tasks that get added to canvas after user confirms AI plan
const seedTasks: TaskbookEntry[] = [];

const useTaskbookStore = create<TaskbookState>()(
    (set, get) => ({
            savedTasks: seedTasks,
            hasNewTask: false,

            addSavedTask: (task) => {
                const now = new Date().toISOString();
                const newTask: TaskbookEntry = {
                    ...task,
                    id: `saved-${uuidv4()}`,
                    created_at: now,
                    updated_at: now,
                    usage_count: 0
                };
                set({
                    savedTasks: [...get().savedTasks, newTask],
                    hasNewTask: true,
                });
            },

            removeTask: (taskId: string) => {
                set({
                    savedTasks: get().savedTasks.filter(task => task.id !== taskId)
                });
            },

            updateSavedTask: (taskId: string, updates: Partial<TaskbookEntry>) => {
                const now = new Date().toISOString();
                const isOnlyUsedAtUpdate = Object.keys(updates).length === 1 && 'used_at' in updates;

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                ...updates,
                                ...(isOnlyUsedAtUpdate ? {} : { updated_at: now })
                            }
                            : task
                    )
                });
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

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                subtasks: [...(task.subtasks || []), newSubtask],
                                updated_at: now
                            }
                            : task
                    )
                });
            },

            updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubtaskType>) => {
                const now = new Date().toISOString();

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                subtasks: (task.subtasks || []).map(subtask =>
                                    subtask.id === subtaskId
                                        ? { ...subtask, ...updates }
                                        : subtask
                                ),
                                updated_at: now
                            }
                            : task
                    )
                });
            },

            deleteSubtask: (taskId: string, subtaskId: string) => {
                const now = new Date().toISOString();

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                subtasks: (task.subtasks || []).filter(subtask => subtask.id !== subtaskId),
                                updated_at: now
                            }
                            : task
                    )
                });
            },

            clearNewTaskIndicator: () => {
                set({ hasNewTask: false });
            },
    })
);

export default useTaskbookStore;
