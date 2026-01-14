import { Task } from '@/stores/types';

// Mock data for bridge design project tasks
export const bridgeDesignTasks: Partial<Task>[] = [
    {
        title: 'General Research',
        status: 'backlog',
        description: 'Upfront research needed to reduce risk and plan better',
        estimated_hours: 117.6,
        time_spent: 0,
        subtasks: [
            { id: '1-1', title: 'Read Approval in Principal and note all requirements', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-2', title: 'Study design codes and note every design item you\'ll need to consider', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 2, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-3', title: 'Study the designs of other disciplines and determine if there are additional tasks', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 3, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-4', title: 'Check the geotech design and ensure you have all the info you need', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 4, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-5', title: 'Check that your allowable budget and schedule lines up with your plan', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 5, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-6', title: 'Study client requirements, standards, codes, drawings and determine any additional activities required', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 6, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-7', title: 'Detailed discussion with your reviewer and technical lead to discuss your plan and further plan for potential risks', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 7, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-8', title: 'Learning how to use structural analysis software needed for the design', is_completed: false, estimated_duration: 40, time_spent: 0, sort_order: 8, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-9', title: 'Reviewing previous design calcs to fully appreciate level of effort required', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 9, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '1-10', title: 'Durability assessment report and concrete cover determination', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 10, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Initial sizing and bridge element determination',
        status: 'backlog',
        description: 'Prelim determination of geometry and what elements will make up the bridge. We do this to gain an appreciation for everything that the bridge must encompass.',
        estimated_hours: 33.6,
        time_spent: 0,
        subtasks: [
            { id: '2-1', title: 'Determine the vertical and horizontal clearances', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '2-2', title: 'Determine prelim deck thickness, span lengths, heights, and every other geometry you can think of', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '2-3', title: 'Prelim determine the parapet type, expansion joint type, bearings, utility supports, and any other kind of furniture', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '2-4', title: 'Create a simple BIM model or drawing to help work out all the geometries for the structural analysis', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Calculation of loads',
        status: 'backlog',
        description: 'Determine load types applicable to the structure.',
        estimated_hours: 19.2,
        time_spent: 0,
        subtasks: [
            { id: '3-1', title: 'Bridge self-weight loading', is_completed: false, estimated_duration: 2.4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-2', title: 'Asphalt loading', is_completed: false, estimated_duration: 0.8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-3', title: 'Edge barriers loading', is_completed: false, estimated_duration: 0.8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-4', title: 'Traffic loading', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-5', title: 'Earth pressure loading', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-6', title: 'Loading as a result of temperature effects', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-7', title: 'Earthquake loading', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-8', title: 'Wind loading', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-9', title: 'Accidental impact loading', is_completed: false, estimated_duration: 2.4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-10', title: 'Breaking loading', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-11', title: 'Skidding loading', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '3-12', title: 'Centrifugal loading', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Check in with reviewer',
        status: 'backlog',
        description: 'Asking the reviewer to review loading calcs',
        estimated_hours: 9.6,
        time_spent: 0,
        subtasks: [
            { id: '4-1', title: 'Reviewer check discussion', is_completed: false, estimated_duration: 1.6, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '4-2', title: 'Rework as a result of checks', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Structural analysis',
        status: 'backlog',
        description: 'Structural analysis models to determine element moment, forces, and stresses',
        estimated_hours: 80,
        time_spent: 0,
        subtasks: [
            { id: '5-1', title: 'Determining the software and structural analysis models required for finding the required loads', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '5-2', title: 'Building the structural analysis models', is_completed: false, estimated_duration: 40, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '5-3', title: 'Analysing the results of the models and doing spot checks', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '5-4', title: 'Further model iterations', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Section designs',
        status: 'backlog',
        description: 'The design of each of the structural elements of the bridge',
        estimated_hours: 192,
        time_spent: 0,
        subtasks: [
            { id: '6-1', title: 'Deck longitudinal design', is_completed: false, estimated_duration: 40, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-2', title: 'Transverse steel design', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-3', title: 'Abutment wall design', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-4', title: 'Deck overhang checks', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-5', title: 'Pilecap designs', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-6', title: 'Pile designs', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-7', title: 'Approach slab designs', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-8', title: 'Earwall designs', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-9', title: 'Buried joint design', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-10', title: 'Superstructure vibration checks', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-11', title: 'Fatigue checks', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '6-12', title: 'Creep and shrinkage checks', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Final geometry checks',
        status: 'backlog',
        description: 'Final geometry checks after all the sections have been designed',
        estimated_hours: 28,
        time_spent: 0,
        subtasks: [
            { id: '7-1', title: 'Precamber checks', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '7-2', title: 'Vertical deflection checks', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '7-3', title: 'Vertical and horizontal clearance checks', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '7-4', title: 'Determining deck levels at certain intervals', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Miscellaneous items',
        status: 'backlog',
        description: 'Additional items for you to consider',
        estimated_hours: 50.4,
        time_spent: 0,
        subtasks: [
            { id: '8-1', title: 'Bridge waterproofing details', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '8-2', title: 'Bridge number plates', is_completed: false, estimated_duration: 2.4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '8-3', title: 'Drainage details', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '8-4', title: 'Barrier and endblock design and layout', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Sketches for draftspersons and BIM modellers',
        status: 'backlog',
        description: 'Creating detailed sketches for communication of the elements that need to be included on the drawings',
        estimated_hours: 64,
        time_spent: 0,
        subtasks: [
            { id: '9-1', title: 'Pile details', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '9-2', title: 'Pile cap details', is_completed: false, estimated_duration: 4, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '9-3', title: 'Abutment details', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '9-4', title: 'Deck details', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '9-5', title: 'Barriers and endblock details', is_completed: false, estimated_duration: 8, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '9-6', title: 'Miscellaneous bridge items', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Detailed review from the reviewer',
        status: 'backlog',
        description: 'Detailed design check by the reviewer',
        estimated_hours: 96,
        time_spent: 0,
        subtasks: [
            { id: '10-1', title: 'Reviewer design check', is_completed: false, estimated_duration: 80, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '10-2', title: 'Discussions with reviewer', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Design adjustments after review',
        status: 'backlog',
        description: 'Adjustments to various parts of the design after the review',
        estimated_hours: 104,
        time_spent: 0,
        subtasks: [
            { id: '11-1', title: 'Adjustments to various parts of the design after the review', is_completed: false, estimated_duration: 80, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '11-2', title: 'Final review by the reviewer + final adjustments', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Bill of quantities and specs',
        status: 'backlog',
        description: 'Various reports to be developed for the design',
        estimated_hours: 40,
        time_spent: 0,
        subtasks: [
            { id: '12-1', title: 'Bill of quantities (Bill of schedules)', is_completed: false, estimated_duration: 16, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' },
            { id: '12-2', title: 'Specification documents', is_completed: false, estimated_duration: 24, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    },
    {
        title: 'Calculation reports',
        status: 'backlog',
        description: 'Detailed design calculation report for summarising all the data from the design for future reference',
        estimated_hours: 80,
        time_spent: 0,
        subtasks: [
            { id: '13-1', title: 'Calculation report', is_completed: false, estimated_duration: 80, time_spent: 0, sort_order: 1, created_at: '2025-01-01T08:00:00Z', updated_at: '2025-01-01T08:00:00Z' }
        ]
    }
]