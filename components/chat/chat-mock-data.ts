// Mock data for bridge design project tasks
export const bridgeDesignTasks = [
    {
        title: 'General Research',
        status: 'Not started',
        description: 'Upfront research needed to reduce risk and plan better',
        estimatedHours: 117.6,
        timeSpent: 0,
        subtasks: [
            { id: '1-1', title: 'Read Approval in Principal and note all requirements', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '1-2', title: 'Study design codes and note every design item you\'ll need to consider', isCompleted: false, estimatedDuration: 16, timeSpent: 0 },
            { id: '1-3', title: 'Study the designs of other disciplines and determine if there are additional tasks', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '1-4', title: 'Check the geotech design and ensure you have all the info you need', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '1-5', title: 'Check that your allowable budget and schedule lines up with your plan', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '1-6', title: 'Study client requirements, standards, codes, drawings and determine any additional activities required', isCompleted: false, estimatedDuration: 16, timeSpent: 0 },
            { id: '1-7', title: 'Detailed discussion with your reviewer and technical lead to discuss your plan and further plan for potential risks', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '1-8', title: 'Learning how to use structural analysis software needed for the design', isCompleted: false, estimatedDuration: 40, timeSpent: 0 },
            { id: '1-9', title: 'Reviewing previous design calcs to fully appreciate level of effort required', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '1-10', title: 'Durability assessment report and concrete cover determination', isCompleted: false, estimatedDuration: 16, timeSpent: 0 }
        ]
    },
    {
        title: 'Initial sizing and bridge element determination',
        status: 'Not started',
        description: 'Prelim determination of geometry and what elements will make up the bridge. We do this to gain an appreciation for everything that the bridge must encompass.',
        estimatedHours: 33.6,
        timeSpent: 0,
        subtasks: [
            { id: '2-1', title: 'Determine the vertical and horizontal clearances', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '2-2', title: 'Determine prelim deck thickness, span lengths, heights, and every other geometry you can think of', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '2-3', title: 'Prelim determine the parapet type, expansion joint type, bearings, utility supports, and any other kind of furniture', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '2-4', title: 'Create a simple BIM model or drawing to help work out all the geometries for the structural analysis', isCompleted: false, estimatedDuration: 16, timeSpent: 0 }
        ]
    },
    {
        title: 'Calculation of loads',
        status: 'Not started',
        description: 'Determine load types applicable to the structure.',
        estimatedHours: 19.2,
        timeSpent: 0,
        subtasks: [
            { id: '3-1', title: 'Bridge self-weight loading', isCompleted: false, estimatedDuration: 2.4, timeSpent: 0 },
            { id: '3-2', title: 'Asphalt loading', isCompleted: false, estimatedDuration: 0.8, timeSpent: 0 },
            { id: '3-3', title: 'Edge barriers loading', isCompleted: false, estimatedDuration: 0.8, timeSpent: 0 },
            { id: '3-4', title: 'Traffic loading', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '3-5', title: 'Earth pressure loading', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '3-6', title: 'Loading as a result of temperature effects', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '3-7', title: 'Earthquake loading', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '3-8', title: 'Wind loading', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '3-9', title: 'Accidental impact loading', isCompleted: false, estimatedDuration: 2.4, timeSpent: 0 },
            { id: '3-10', title: 'Breaking loading', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '3-11', title: 'Skidding loading', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '3-12', title: 'Centrifugal loading', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 }
        ]
    },
    {
        title: 'Check in with reviewer',
        status: 'Not started',
        description: 'Asking the reviewer to review loading calcs',
        estimatedHours: 9.6,
        timeSpent: 0,
        subtasks: [
            { id: '4-1', title: 'Reviewer check discussion', isCompleted: false, estimatedDuration: 1.6, timeSpent: 0 },
            { id: '4-2', title: 'Rework as a result of checks', isCompleted: false, estimatedDuration: 8, timeSpent: 0 }
        ]
    },
    {
        title: 'Structural analysis',
        status: 'Not started',
        description: 'Structural analysis models to determine element moment, forces, and stresses',
        estimatedHours: 80,
        timeSpent: 0,
        subtasks: [
            { id: '5-1', title: 'Determining the software and structural analysis models required for finding the required loads', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '5-2', title: 'Building the structural analysis models', isCompleted: false, estimatedDuration: 40, timeSpent: 0 },
            { id: '5-3', title: 'Analysing the results of the models and doing spot checks', isCompleted: false, estimatedDuration: 16, timeSpent: 0 },
            { id: '5-4', title: 'Further model iterations', isCompleted: false, estimatedDuration: 16, timeSpent: 0 }
        ]
    },
    {
        title: 'Section designs',
        status: 'Not started',
        description: 'The design of each of the structural elements of the bridge',
        estimatedHours: 192,
        timeSpent: 0,
        subtasks: [
            { id: '6-1', title: 'Deck longitudinal design', isCompleted: false, estimatedDuration: 40, timeSpent: 0 },
            { id: '6-2', title: 'Transverse steel design', isCompleted: false, estimatedDuration: 24, timeSpent: 0 },
            { id: '6-3', title: 'Abutment wall design', isCompleted: false, estimatedDuration: 24, timeSpent: 0 },
            { id: '6-4', title: 'Deck overhang checks', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '6-5', title: 'Pilecap designs', isCompleted: false, estimatedDuration: 24, timeSpent: 0 },
            { id: '6-6', title: 'Pile designs', isCompleted: false, estimatedDuration: 24, timeSpent: 0 },
            { id: '6-7', title: 'Approach slab designs', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '6-8', title: 'Earwall designs', isCompleted: false, estimatedDuration: 24, timeSpent: 0 },
            { id: '6-9', title: 'Buried joint design', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '6-10', title: 'Superstructure vibration checks', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '6-11', title: 'Fatigue checks', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '6-12', title: 'Creep and shrinkage checks', isCompleted: false, estimatedDuration: 8, timeSpent: 0 }
        ]
    },
    {
        title: 'Final geometry checks',
        status: 'Not started',
        description: 'Final geometry checks after all the sections have been designed',
        estimatedHours: 28,
        timeSpent: 0,
        subtasks: [
            { id: '7-1', title: 'Precamber checks', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '7-2', title: 'Vertical deflection checks', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '7-3', title: 'Vertical and horizontal clearance checks', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '7-4', title: 'Determining deck levels at certain intervals', isCompleted: false, estimatedDuration: 8, timeSpent: 0 }
        ]
    },
    {
        title: 'Miscellaneous items',
        status: 'Not started',
        description: 'Additional items for you to consider',
        estimatedHours: 50.4,
        timeSpent: 0,
        subtasks: [
            { id: '8-1', title: 'Bridge waterproofing details', isCompleted: false, estimatedDuration: 16, timeSpent: 0 },
            { id: '8-2', title: 'Bridge number plates', isCompleted: false, estimatedDuration: 2.4, timeSpent: 0 },
            { id: '8-3', title: 'Drainage details', isCompleted: false, estimatedDuration: 16, timeSpent: 0 },
            { id: '8-4', title: 'Barrier and endblock design and layout', isCompleted: false, estimatedDuration: 16, timeSpent: 0 }
        ]
    },
    {
        title: 'Sketches for draftspersons and BIM modellers',
        status: 'Not started',
        description: 'Creating detailed sketches for communication of the elements that need to be included on the drawings',
        estimatedHours: 64,
        timeSpent: 0,
        subtasks: [
            { id: '9-1', title: 'Pile details', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '9-2', title: 'Pile cap details', isCompleted: false, estimatedDuration: 4, timeSpent: 0 },
            { id: '9-3', title: 'Abutment details', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '9-4', title: 'Deck details', isCompleted: false, estimatedDuration: 16, timeSpent: 0 },
            { id: '9-5', title: 'Barriers and endblock details', isCompleted: false, estimatedDuration: 8, timeSpent: 0 },
            { id: '9-6', title: 'Miscellaneous bridge items', isCompleted: false, estimatedDuration: 24, timeSpent: 0 }
        ]
    },
    {
        title: 'Detailed review from the reviewer',
        status: 'Not started',
        description: 'Detailed design check by the reviewer',
        estimatedHours: 96,
        timeSpent: 0,
        subtasks: [
            { id: '10-1', title: 'Reviewer design check', isCompleted: false, estimatedDuration: 80, timeSpent: 0 },
            { id: '10-2', title: 'Discussions with reviewer', isCompleted: false, estimatedDuration: 16, timeSpent: 0 }
        ]
    },
    {
        title: 'Design adjustments after review',
        status: 'Not started',
        description: 'Adjustments to various parts of the design after the review',
        estimatedHours: 104,
        timeSpent: 0,
        subtasks: [
            { id: '11-1', title: 'Adjustments to various parts of the design after the review', isCompleted: false, estimatedDuration: 80, timeSpent: 0 },
            { id: '11-2', title: 'Final review by the reviewer + final adjustments', isCompleted: false, estimatedDuration: 24, timeSpent: 0 }
        ]
    },
    {
        title: 'Bill of quantities and specs',
        status: 'Not started',
        description: 'Various reports to be developed for the design',
        estimatedHours: 40,
        timeSpent: 0,
        subtasks: [
            { id: '12-1', title: 'Bill of quantities (Bill of schedules)', isCompleted: false, estimatedDuration: 16, timeSpent: 0 },
            { id: '12-2', title: 'Specification documents', isCompleted: false, estimatedDuration: 24, timeSpent: 0 }
        ]
    },
    {
        title: 'Calculation reports',
        status: 'Not started',
        description: 'Detailed design calculation report for summarising all the data from the design for future reference',
        estimatedHours: 80,
        timeSpent: 0,
        subtasks: [
            { id: '13-1', title: 'Calculation report', isCompleted: false, estimatedDuration: 80, timeSpent: 0 }
        ]
    }
]