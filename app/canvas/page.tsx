"use client"

import Canvas from "@/components/canvas/canvas"
import AIOrb from "@/components/ai-chat/ai-orb"
import SidebarProvider from "@/components/ui/sidebar"
import CanvasSidebar from "@/components/sidebar/canvas-sidebar"
import CanvasToolbar from "@/components/toolbar/canvas-toolbar"
import CanvasSidebarTrigger from "@/components/sidebar/sidebar-trigger"
import ExportButtons from "@/components/export/export-buttons"
import TaskBook from "@/components/task-book/task-book"


import { UsageDisplay } from "@/components/admin/usage-display"
import { AIStatusIndicator } from "@/components/admin/ai-status-indicator"
import { useRealtimeWebRTC } from "@/hooks/use-realtime-webrtc"
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
        // Smooth initial fitView on mount
        setTimeout(() => {
            instance.fitView({
                padding: 0.2,
                duration: 800,
                maxZoom: 1
            })
        }, 100)
    }

    // Initialize history on mount
    useEffect(() => {
        const saveHistory = useStore.getState().saveHistory
        const history = useStore.getState().history
        if (history.length === 0) {
            saveHistory()
        }
    }, [])

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
        const newNodeIds: string[] = []

        // Add cards one at a time with delays
        tasks.forEach((task, index) => {
            setTimeout(() => {
                const nodeId = addTaskNode({
                    title: task.title,
                    status: 'Not started',
                    estimatedHours: task.estimatedHours
                })
                newNodeIds.push(nodeId)

                // Auto-connect within this conversation batch (vertical flow: bottom→top)
                if (index > 0 && newNodeIds.length > 1) {
                    const sourceId = newNodeIds[index - 1]
                    const targetId = nodeId

                    // Get positions of the actual nodes to determine if same column
                    const nodes = useStore.getState().nodes
                    const sourceNode = nodes.find(n => n.id === sourceId)
                    const targetNode = nodes.find(n => n.id === targetId)

                    // Check if same column (similar x position within 100px tolerance)
                    const isSameColumn = sourceNode && targetNode &&
                        Math.abs(sourceNode.position.x - targetNode.position.x) < 100

                    if (isSameColumn) {
                        // Vertical: bottom → top (step edge for 90-degree lines)
                        connectTasks(sourceId, targetId, { sourceHandle: 'bottom', targetHandle: 'top' })
                    } else {
                        // Cross-column: right → left (smoothstep for curves)
                        connectTasks(sourceId, targetId, { sourceHandle: 'right', targetHandle: 'left' })
                    }
                }

                // Smooth auto-zoom after last card
                if (index === tasks.length - 1) {
                    setTimeout(() => {
                        if (reactFlowInstance.current) {
                            reactFlowInstance.current.fitView({
                                padding: 0.2,
                                duration: 600,
                                maxZoom: 1
                            })
                        }
                    }, 400)
                }
            }, index * 2000) // 2 second delay between cards for better pacing
        })

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

    const handleUpdateTask = (taskIndex: number, updates: { status?: string; estimatedHours?: number; title?: string }) => {
        const nodes = useStore.getState().nodes
        const taskNodes = nodes.filter(n => n.type === 'taskCardNode')
        
        console.log(`[Voice] Update task ${taskIndex}:`, updates)
        console.log(`[Voice] Found ${taskNodes.length} task nodes`)
        
        // Convert 1-based user index to 0-based array index
        const targetNode = taskNodes[taskIndex - 1]
        if (targetNode) {
            console.log(`[Voice] Updating node ${targetNode.id}:`, updates)
            useStore.getState().updateNodeData(targetNode.id, updates)
        } else {
            console.error(`[Voice] Task ${taskIndex} not found. Valid range: 1-${taskNodes.length}`)
        }
    }

    const handleDeleteTask = (taskIndex: number) => {
        const nodes = useStore.getState().nodes
        const taskNodes = nodes.filter(n => n.type === 'taskCardNode')
        
        console.log(`[Voice] Delete task ${taskIndex}`)
        console.log(`[Voice] Found ${taskNodes.length} task nodes`)
        
        // Convert 1-based user index to 0-based array index
        const targetNode = taskNodes[taskIndex - 1]
        if (targetNode) {
            console.log(`[Voice] Deleting node ${targetNode.id}`)
            useStore.getState().deleteNode(targetNode.id)
        } else {
            console.error(`[Voice] Task ${taskIndex} not found. Valid range: 1-${taskNodes.length}`)
        }
    }

    const nodes = useStore((state) => state.nodes)
    const taskNodes = nodes.filter(n => n.type === 'taskCardNode')
    const hasTaskNodes = taskNodes.length > 0
    const taskCount = taskNodes.length

    const { connect, disconnect, isConnected, isSpeaking, isConnecting, isMuted, toggleMute, currentActivity } = useRealtimeWebRTC(
        handleTasksGenerated,
        handleConnectTasks,
        handleClearCanvas,
        handleUpdateTask,
        handleDeleteTask,
        hasTaskNodes,
        taskCount
    )

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                <Canvas onInit={setReactFlowInstance} />
                <ExportButtons />
                <TaskBook />
                <AIOrb
                    onConnect={connect}
                    onDisconnect={disconnect}
                    isConnected={isConnected}
                    isSpeaking={isSpeaking}
                    isConnecting={isConnecting}
                    isMuted={isMuted}
                    onToggleMute={toggleMute}
                    hasTaskNodes={hasTaskNodes}
                />

                <CanvasSidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
                {process.env.NODE_ENV === 'development' && (
                    <>
                        <UsageDisplay />
                        <AIStatusIndicator 
                            isConnected={isConnected}
                            isConnecting={isConnecting}
                            isSpeaking={isSpeaking}
                            currentActivity={currentActivity}
                        />
                    </>
                )}
            </div>
        </SidebarProvider>
    )
}