import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStore } from '@/stores/flow-store'

// Mock fetch for API calls
global.fetch = vi.fn((url, options) => {
    // Mock task creation
    if (url.includes('/tasks') && !url.includes('/api/tasks/')) {
        const body = options?.body ? JSON.parse(options.body as string) : {}
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                task: {
                    id: `task-${Date.now()}`,
                    title: body.title || '',
                    description: body.description || '',
                    status: body.status || 'Backlog',
                    estimated_hours: body.estimatedHours || 0,
                    time_spent: body.timeSpent || 0,
                    created_by: 'test-user',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            })
        })
    }
    // Mock task update
    if (url.includes('/api/tasks/')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
        })
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
}) as any

// Mock local storage validation since zustand persist uses it
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString() },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { store = {} }
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

describe('Flow Store', () => {
    beforeEach(() => {
        useStore.getState().resetCanvas()
        // Set a project ID for tests
        useStore.getState().setProjectId('test-project-id')
    })

    it('starts with empty canvas after reset', () => {
        const { nodes } = useStore.getState()
        expect(nodes.length).toBe(0)
    })

    it('adds a task node', async () => {
        const { addTaskNode } = useStore.getState()

        const id = await addTaskNode({
            title: 'New Task',
            status: 'in-progress'
        })

        const { nodes, tasks } = useStore.getState()
        const newNode = nodes.find(n => n.id === id)
        const newTask = tasks.find(t => t.node_id === id)

        expect(newNode).toBeDefined()
        expect(newTask).toBeDefined()
        expect(newTask?.title).toBe('New Task')
        expect(newTask?.status).toBe('in-progress')
    })

    it('updates a node', async () => {
        const { addTaskNode, updateTask } = useStore.getState()
        const nodeId = await addTaskNode({ title: 'Task 1' })
        
        // Find the task by node_id
        const { tasks } = useStore.getState()
        const task = tasks.find(t => t.node_id === nodeId)
        
        if (task) {
            await updateTask(task.id, { status: 'completed' })
        }

        const { tasks: updatedTasks } = useStore.getState()
        const updatedTask = updatedTasks.find(t => t.node_id === nodeId)

        expect(updatedTask?.status).toBe('completed')
    })

    it('deletes nodes via ReactFlow', async () => {
        const { addTaskNode, onNodesChange } = useStore.getState()
        const id = await addTaskNode({ title: 'Delete Me' })

        // Simulate ReactFlow node deletion
        onNodesChange([{ type: 'remove', id }])

        const { nodes, tasks } = useStore.getState()
        const node = nodes.find(n => n.id === id)
        const task = tasks.find(t => t.node_id === id)

        expect(node).toBeUndefined()
        expect(task).toBeUndefined()
    })
})
