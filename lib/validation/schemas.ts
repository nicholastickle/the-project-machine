import { z } from 'zod'

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
    description: z.string().max(500, 'Description too long').optional(),
})

export const updateProjectSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    isArchived: z.boolean().optional(),
})

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().optional(),
    status: z.enum(['Backlog', 'Planned', 'In Progress', 'Stuck', 'Completed', 'Cancelled']).default('Backlog'),
    priority: z.enum(['low', 'medium', 'high']).optional(), // Optional if not in DB yet
    estimatedHours: z.number().min(0).optional(),
    sortOrder: z.number().int().optional(),
})

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    status: z.enum(['Backlog', 'Planned', 'In Progress', 'Stuck', 'Completed', 'Cancelled']).optional(),
    estimatedHours: z.number().min(0).optional(),
    timeSpent: z.number().min(0).optional(),
})

export const createCommentSchema = z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment too long'),
})
