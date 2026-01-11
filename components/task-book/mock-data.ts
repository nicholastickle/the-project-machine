interface Section {
    id: string
    title: string
    tasks: Task[]
}

interface Task {
    id: string
    title: string
    description: string
    totalDuration: string
    lastUpdated: string
    lastUsed: string
    subtasks?: Array<{
        name: string
        estimated: string
        timeSpent: string
    }>
}

const mockSections: Section[] = [
    {
        id: "section-1",
        title: "Project Setup & Configuration",
        tasks: [
            {
                id: "task-1",
                title: "Initialize Development Environment",
                description:
                    "Set up the complete development environment including all necessary tools, dependencies, and configurations for the project. This includes setting up version control, package managers, and development servers.",
                totalDuration: "4 days, 2 hours",
                lastUpdated: "12/01/2024, 14:30",
                lastUsed: "12/02/2024, 09:15",
                subtasks: [
                    { name: "Install Node.js and npm", estimated: "30 mins", timeSpent: "25 mins" },
                    { name: "Configure Git repository", estimated: "1 hour", timeSpent: "1 hour 15 mins" },
                    { name: "Set up development server", estimated: "2 hours", timeSpent: "2 hours 30 mins" },
                ],
            },
            {
                id: "task-2",
                title: "Database Schema Design",
                description:
                    "Design and implement the complete database schema including all tables, relationships, indexes, and constraints needed for the application. This task involves creating an Entity Relationship Diagram (ERD), defining all table structures with appropriate data types, setting up foreign key relationships, creating migration scripts for version control, and seeding initial test data. The schema must be optimized for query performance and maintain data integrity across all operations.",
                totalDuration: "6 days, 4 hours",
             
                lastUpdated: "11/28/2024, 16:45",
                lastUsed: "11/30/2024, 11:20",
                subtasks: [
                    { name: "Create ERD diagram", estimated: "3 hours", timeSpent: "3 hours 20 mins" },
                    { name: "Define table structures", estimated: "4 hours", timeSpent: "4 hours 45 mins" },
                    { name: "Write migration scripts", estimated: "5 hours", timeSpent: "5 hours 10 mins" },
                    { name: "Seed test data", estimated: "2 hours", timeSpent: "1 hour 50 mins" },
                ],
            },
        ],
    },
    {
        id: "section-2",
        title: "Feature Development",
        tasks: [
            {
                id: "task-3",
                title: "User Authentication System",
                description:
                    "Implement a comprehensive authentication system with secure login, registration, password reset, and session management features.",
                totalDuration: "8 days, 3 hours",
              
                lastUpdated: "11/25/2024, 10:15",
                lastUsed: "11/29/2024, 14:50",
                subtasks: [
                    { name: "Implement login functionality", estimated: "6 hours", timeSpent: "6 hours 30 mins" },
                    { name: "Create registration flow", estimated: "5 hours", timeSpent: "5 hours 15 mins" },
                    { name: "Add password reset", estimated: "4 hours", timeSpent: "4 hours 20 mins" },
                    { name: "Set up session management", estimated: "7 hours", timeSpent: "7 hours 45 mins" },
                ],
            },
        ],
    },
    {
        id: "section-3",
        title: "Testing & Quality Assurance",
        tasks: [
            {
                id: "task-4",
                title: "Unit Testing Implementation",
                description:
                    "Write comprehensive unit tests for all critical components and functions to ensure code reliability and prevent regressions.",
                totalDuration: "5 days, 2 hours",
                lastUpdated: "11/20/2024, 13:30",
                lastUsed: "11/22/2024, 09:45",
                subtasks: [
                    { name: "Write unit tests for utilities", estimated: "8 hours", timeSpent: "8 hours 20 mins" },
                    { name: "Test authentication module", estimated: "6 hours", timeSpent: "6 hours 10 mins" },
                    { name: "Create integration tests", estimated: "10 hours", timeSpent: "10 hours 30 mins" },
                ],
            },
        ],
    },
]

export type { Task, Section }
export { mockSections }