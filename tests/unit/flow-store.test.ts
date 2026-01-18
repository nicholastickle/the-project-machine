import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStore } from '@/stores/flow-store'

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
    })

    it('starts with initial nodes', () => {
        const { nodes } = useStore.getState()
        expect(nodes.length).toBeGreaterThan(0)
    })

    it('adds a task node', () => {
        const { addTaskNode } = useStore.getState()

        const id = addTaskNode({
            title: 'New Task',
            status: 'in-progress'
        })

        const { nodes } = useStore.getState()
        const newNode = nodes.find(n => n.id === id)

        expect(newNode).toBeDefined()
        expect(newNode?.data.title).toBe('New Task')
        expect(newNode?.data.status).toBe('in-progress')
    })

    it('updates a node', () => {
        const { addTaskNode, updateNodeData } = useStore.getState()
        const id = addTaskNode({ title: 'Task 1' })

        updateNodeData(id, { status: 'completed' })

        const { nodes } = useStore.getState()
        const node = nodes.find(n => n.id === id)

        expect(node?.data.status).toBe('completed')
    })

    it('deletes a node', () => {
        const { addTaskNode, deleteNode } = useStore.getState()
        const id = addTaskNode({ title: 'Delete Me' })

        deleteNode(id)

        const { nodes } = useStore.getState()
        const node = nodes.find(n => n.id === id)

        expect(node).toBeUndefined()
    })
})
