import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SavedTask } from './types';

// ⚠️ DEPRECATED: This store will be replaced with a derived view over PlanSnapshots
// In v1.0, PlanSnapshots are the ONLY authoritative memory
// Taskbook should show all tasks across all snapshots (history view)
// DO NOT extend this store - it will be refactored to read from Supabase plan_snapshots table

// Extract the subtask type for better type safety
type SubtaskType = NonNullable<SavedTask['subtasks']>[number];

interface TaskbookState {
    savedTasks: SavedTask[];
    hasNewTask: boolean;
    addSavedTask: (task: Omit<SavedTask, 'id' | 'savedAt' | 'lastUpdated'>) => void;
    removeTask: (taskId: string) => void;
    updateSavedTask: (taskId: string, updates: Partial<SavedTask>) => void;
    addSubtask: (taskId: string) => void;
    updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubtaskType>) => void;
    deleteSubtask: (taskId: string, subtaskId: string) => void;
    clearNewTaskIndicator: () => void;
}

// These match the tasks that get added to canvas after user confirms AI plan
const seedTasks: SavedTask[] = [];

const useTaskbookStore = create<TaskbookState>()(
    persist(
        (set, get) => ({
            savedTasks: seedTasks,
            hasNewTask: false,

            addSavedTask: (task) => {
                const now = new Date().toLocaleString();
                const newTask: SavedTask = {
                    ...task,
                    id: `saved-${uuidv4()}`,
                    savedAt: now,
                    lastUpdated: now,
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

            updateSavedTask: (taskId: string, updates: Partial<SavedTask>) => {
                const now = new Date().toLocaleString();
                const isOnlyLastUsedUpdate = Object.keys(updates).length === 1 && 'lastUsed' in updates;

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                ...updates,
                                ...(isOnlyLastUsedUpdate ? {} : { lastUpdated: now })
                            }
                            : task
                    )
                });
            },

            addSubtask: (taskId: string) => {
                const now = new Date().toLocaleString();
                const newSubtask = {
                    id: `subtask-${uuidv4()}`,
                    title: '',
                    isCompleted: false,
                    estimatedDuration: 0,
                    timeSpent: 0
                };

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                subtasks: [...(task.subtasks || []), newSubtask],
                                lastUpdated: now
                            }
                            : task
                    )
                });
            },

            updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubtaskType>) => {
                const now = new Date().toLocaleString();

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
                                lastUpdated: now
                            }
                            : task
                    )
                });
            },

            deleteSubtask: (taskId: string, subtaskId: string) => {
                const now = new Date().toLocaleString();

                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                subtasks: (task.subtasks || []).filter(subtask => subtask.id !== subtaskId),
                                lastUpdated: now
                            }
                            : task
                    )
                });
            },

            clearNewTaskIndicator: () => {
                set({ hasNewTask: false });
            },
        }),
        {
            name: 'taskbook-storage', // Separate localStorage key
            version: 1,
        }
    )
);

export default useTaskbookStore;
