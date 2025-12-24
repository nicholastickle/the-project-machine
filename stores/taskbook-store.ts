import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SavedTask } from './types';

// ⚠️ DEPRECATED: This store will be replaced with a derived view over PlanSnapshots
// In v1.0, PlanSnapshots are the ONLY authoritative memory
// Taskbook should show all tasks across all snapshots (history view)
// DO NOT extend this store - it will be refactored to read from Supabase plan_snapshots table

interface TaskbookState {
    savedTasks: SavedTask[];
    hasNewTask: boolean;
    addSavedTask: (task: Omit<SavedTask, 'id' | 'savedAt' | 'lastUpdated'>) => void;
    removeTask: (taskId: string) => void;
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
