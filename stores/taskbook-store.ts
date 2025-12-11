import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SavedTask } from './types';

interface TaskbookState {
    savedTasks: SavedTask[];
    hasNewTask: boolean;
    addSavedTask: (task: Omit<SavedTask, 'id' | 'savedAt' | 'lastUpdated'>) => void;
    clearNewTaskIndicator: () => void;
}

// Seed data - initial tasks that appear in the taskbook
// These match the tasks that get added to canvas after user confirms AI plan
const seedTasks: SavedTask[] = [
    {
        id: 'seed-1',
        title: 'General Research',
        description: 'Upfront research needed to reduce risk and plan better. Includes reading requirements, studying design codes, checking other disciplines designs, reviewing geotechnical data, and learning structural analysis software.',
        status: 'Complete',
        estimatedHours: 14.2,
        timeSpent: 14.7,
        savedAt: '11/15/2024, 10:30',
        lastUpdated: '11/22/2024, 16:45',
        lastUsed: '12/01/2024, 09:15',
        subtasks: [
            { name: 'Read Approval in Principal and note all requirements', estimated: '4 hours', timeSpent: '4 hours 15 mins' },
            { name: 'Study design codes and note every design item', estimated: '16 hours', timeSpent: '16 hours 30 mins' },
            { name: 'Study the designs of other disciplines', estimated: '8 hours', timeSpent: '8 hours 20 mins' },
            { name: 'Check the geotech design', estimated: '4 hours', timeSpent: '3 hours 45 mins' },
            { name: 'Check allowable budget and schedule', estimated: '1.6 hours', timeSpent: '1.5 hours' },
            { name: 'Study client requirements and standards', estimated: '16 hours', timeSpent: '17 hours' },
            { name: 'Discussion with reviewer and technical lead', estimated: '4 hours', timeSpent: '4 hours 10 mins' },
            { name: 'Learning structural analysis software', estimated: '40 hours', timeSpent: '41 hours 30 mins' },
            { name: 'Reviewing previous design calcs', estimated: '8 hours', timeSpent: '8 hours 15 mins' },
            { name: 'Durability assessment and concrete cover', estimated: '16 hours', timeSpent: '16 hours 45 mins' },
        ],
    },
    {
        id: 'seed-2',
        title: 'Calculation of loads',
        description: 'Determine all load types applicable to the structure including self-weight, traffic, earth pressure, temperature effects, earthquake, wind, and impact loading.',
        status: 'Complete',
        estimatedHours: 2.6,
        timeSpent: 2.9,
        savedAt: '11/20/2024, 14:00',
        lastUpdated: '11/25/2024, 11:30',
        lastUsed: '11/28/2024, 10:00',
        subtasks: [
            { name: 'Bridge self-weight loading', estimated: '2.4 hours', timeSpent: '2.5 hours' },
            { name: 'Asphalt loading', estimated: '48 mins', timeSpent: '45 mins' },
            { name: 'Edge barriers loading', estimated: '48 mins', timeSpent: '50 mins' },
            { name: 'Traffic loading', estimated: '4 hours', timeSpent: '4 hours 20 mins' },
            { name: 'Earth pressure loading', estimated: '1.6 hours', timeSpent: '1 hour 45 mins' },
            { name: 'Temperature effects loading', estimated: '1.6 hours', timeSpent: '1 hour 50 mins' },
            { name: 'Earthquake loading', estimated: '1.6 hours', timeSpent: '1 hour 40 mins' },
            { name: 'Wind loading', estimated: '1.6 hours', timeSpent: '1 hour 55 mins' },
            { name: 'Accidental impact loading', estimated: '2.4 hours', timeSpent: '2 hours 30 mins' },
            { name: 'Breaking, skidding, centrifugal loading', estimated: '4.8 hours', timeSpent: '5 hours 10 mins' },
        ],
    },
    {
        id: 'seed-3',
        title: 'Section designs',
        description: 'Design of each structural element of the bridge including deck longitudinal and transverse design, abutment walls, pile caps, piles, approach slabs, earwalls, and various structural checks.',
        status: 'Complete',
        estimatedHours: 26.5,
        timeSpent: 28.2,
        savedAt: '12/01/2024, 09:15',
        lastUpdated: '12/08/2024, 15:30',
        lastUsed: '12/10/2024, 11:00',
        subtasks: [
            { name: 'Deck longitudinal design', estimated: '40 hours', timeSpent: '42 hours 15 mins' },
            { name: 'Transverse steel design', estimated: '24 hours', timeSpent: '25 hours 30 mins' },
            { name: 'Abutment wall design', estimated: '24 hours', timeSpent: '25 hours' },
            { name: 'Deck overhang checks', estimated: '8 hours', timeSpent: '8 hours 45 mins' },
            { name: 'Pilecap designs', estimated: '24 hours', timeSpent: '25 hours 20 mins' },
            { name: 'Pile designs', estimated: '24 hours', timeSpent: '24 hours 50 mins' },
            { name: 'Approach slab designs', estimated: '8 hours', timeSpent: '8 hours 30 mins' },
            { name: 'Earwall designs', estimated: '24 hours', timeSpent: '25 hours 15 mins' },
            { name: 'Buried joint design', estimated: '4 hours', timeSpent: '4 hours 20 mins' },
            { name: 'Superstructure vibration checks', estimated: '4 hours', timeSpent: '4 hours 15 mins' },
            { name: 'Fatigue and creep/shrinkage checks', estimated: '16 hours', timeSpent: '17 hours' },
        ],
    },
];

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
