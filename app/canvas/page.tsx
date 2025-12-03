"use client"

import Canvas from "@/components/canvas/canvas"
import AIOrb from "@/components/ai-chat/ai-orb"
import CanvasSidebar, { SidebarProvider } from "@/components/sidebar/canvas-sidebar"
import { UsageDisplay } from "@/components/admin/usage-display"
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
                
                // Auto-connect within this conversation batch (sequential flow)
                if (index > 0 && newNodeIds.length > 1) {
                    connectTasks(newNodeIds[index - 1], nodeId)
                }
                
                // Smooth auto-zoom after last card
                if (index === tasks.length - 1) {
                    setTimeout(() => {
                        if (reactFlowInstance.current) {
                            reactFlowInstance.current.fitView({
                                padding: 0.2,
                                duration: 800,
                                maxZoom: 1
                            })
                        }
                    }, 800)
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
        
        // Convert 1-based user index to 0-based array index
        const targetNode = taskNodes[taskIndex - 1]
        if (targetNode) {
            useStore.getState().updateNodeData(targetNode.id, updates)
        }
    }

    const { connect, disconnect, isConnected, isSpeaking, isConnecting, isMuted, toggleMute } = useRealtimeWebRTC(
        handleTasksGenerated,
        handleConnectTasks,
        handleClearCanvas,
        handleUpdateTask
    )

    return (
        <SidebarProvider>
            <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                <CanvasSidebar />
                <Canvas onInit={setReactFlowInstance} />
                <AIOrb 
                    onConnect={connect}
                    onDisconnect={disconnect}
                    isConnected={isConnected}
                    isSpeaking={isSpeaking}
                    isConnecting={isConnecting}
                    isMuted={isMuted}
                    onToggleMute={toggleMute}
                />
                {process.env.NODE_ENV === 'development' && <UsageDisplay />}
            </div>
        </SidebarProvider>
    )
}