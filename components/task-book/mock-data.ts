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
                lastUpdated: "12/01/2024, 14:30:00",
                lastUsed: "12/02/2024, 09:15:00",
            },
            {
                id: "task-2",
                title: "Database Schema Design",
                description:
                    "Design and implement the complete database schema including all tables, relationships, indexes, and constraints needed for the application. This task involves creating an Entity Relationship Diagram (ERD), defining all table structures with appropriate data types, setting up foreign key relationships, creating migration scripts for version control, and seeding initial test data. The schema must be optimized for query performance and maintain data integrity across all operations.",
                totalDuration: "6 days, 4 hours",
             
                lastUpdated: "11/28/2024, 16:45:00",
                lastUsed: "11/30/2024, 11:20:00",
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
              
                lastUpdated: "11/25/2024, 10:15:00",
                lastUsed: "11/29/2024, 14:50:00",
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
                lastUpdated: "11/20/2024, 13:30:00",
                lastUsed: "11/22/2024, 09:45:00",
            },
        ],
    },
]

export type { Task, Section }
export { mockSections }