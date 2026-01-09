import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SavedTask } from './types';

interface TaskbookState {
    savedTasks: SavedTask[];
    hasNewTask: boolean;
    addSavedTask: (task: Omit<SavedTask, 'id' | 'savedAt' | 'lastUpdated'>) => void;
    removeTask: (taskId: string) => void;
    updateSavedTask: (taskId: string, updates: Partial<SavedTask>) => void;
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
                set({
                    savedTasks: get().savedTasks.map(task =>
                        task.id === taskId
                            ? { ...task, ...updates, lastUpdated: now }
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
