"use client"

import Canvas from "@/components/canvas/canvas"
import AIOrb from "@/components/ai-chat/ai-orb"
import { useRealtimeSession } from "@/hooks/use-realtime-session"
import useStore from "@/stores/flow-store"
import { useEffect, useRef, type RefObject } from "react"
import type { ReactFlowInstance } from '@xyflow/react'

export default function CanvasPage() {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const addTaskNode = useStore((state) => state.addTaskNode)
    const resetCanvas = useStore((state) => state.resetCanvas)
    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)

    const setReactFlowInstance = (instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                undo()
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault()
                redo()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [undo, redo])

    const connectTasks = useStore((state) => state.connectTasks)
    
    const handleTasksGenerated = (tasks: any[]): string[] => {
        console.log('🎯 Generating', tasks.length, 'tasks')
        const newNodeIds: string[] = []
        tasks.forEach((task) => {
            const nodeId = addTaskNode({
                title: task.title,
                status: 'Not started'
            })
            newNodeIds.push(nodeId)
        })
        
        console.log('🆔 New task IDs:', newNodeIds)
        
        // Auto-connect tasks in sequence
        if (newNodeIds.length > 1) {
            for (let i = 0; i < newNodeIds.length - 1; i++) {
                console.log('🔗 Connecting', newNodeIds[i], '→', newNodeIds[i + 1])
                connectTasks(newNodeIds[i], newNodeIds[i + 1])
            }
        }
        
        // Smooth auto-zoom to fit all tasks with padding
        setTimeout(() => {
            if (reactFlowInstance.current) {
                reactFlowInstance.current.fitView({
                    padding: 0.2,
                    duration: 800,
                    maxZoom: 1
                })
            }
        }, 600) // Wait for animations to start
        
        return newNodeIds
    }

    const handleConnectTasks = (connections: { from: number; to: number }[]) => {
        const nodes = useStore.getState().nodes
        const latestTasks = nodes.slice(-10) // Get recent tasks
        
        connections.forEach(({ from, to }) => {
            if (from < latestTasks.length && to < latestTasks.length) {
                connectTasks(latestTasks[from].id, latestTasks[to].id)
            }
        })
    }

    const handleClearCanvas = () => {
        resetCanvas()
    }

    const { connect, disconnect, isConnected, isSpeaking } = useRealtimeSession(
        handleTasksGenerated,
        handleConnectTasks,
        handleClearCanvas
    )

    return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden">
            <Canvas onInit={setReactFlowInstance} />
            <AIOrb 
                onConnect={connect}
                onDisconnect={disconnect}
                isConnected={isConnected}
                isSpeaking={isSpeaking}
            />
        </div>
    )
}