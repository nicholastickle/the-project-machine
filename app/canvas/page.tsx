"use client"

import Canvas from "@/components/canvas/canvas"
import ChatPanel from "@/components/chat/chat-panel"
import SidebarProvider from "@/components/ui/sidebar"
import CanvasSidebar from "@/components/sidebar/canvas-sidebar"
import CanvasToolbar from "@/components/toolbar/canvas-toolbar"
import CanvasSidebarTrigger from "@/components/sidebar/sidebar-trigger"
import ExportButtons from "@/components/export/export-buttons"
import TaskBook from "@/components/task-book/task-book"
import useStore from "@/stores/flow-store"
import { useEffect, useRef, useState } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

export default function CanvasPage() {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const [isChatVisible, setIsChatVisible] = useState(true)
    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)
    const addTaskNode = useStore((state) => state.addTaskNode)
    const nodes = useStore((state) => state.nodes)

    const setReactFlowInstance = (instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance
        // Center on logo without animation
        instance.setCenter(600, 300, { zoom: 0.8 })
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

    // Handle confirmation from chat - add scripted tasks to canvas
    const handleChatConfirm = () => {
        // Sprint 2: Add 13 pre-defined bridge design tasks when user confirms
        const scriptedTasks = [
            { title: 'General Research', status: 'Not started', estimatedHours: 114.4 },
            { title: 'Initial sizing and bridge element determination', status: 'Not started', estimatedHours: 33.6 },
            { title: 'Calculation of loads', status: 'Not started', estimatedHours: 20.8 },
            { title: 'Check in with reviewer', status: 'Not started', estimatedHours: 9.6 },
            { title: 'Structural analysis', status: 'Not started', estimatedHours: 80 },
            { title: 'Section designs', status: 'Not started', estimatedHours: 212 },
            { title: 'Final geometry checks', status: 'Not started', estimatedHours: 28 },
            { title: 'Miscellaneous items', status: 'Not started', estimatedHours: 50.4 },
            { title: 'Sketches for draftspersons and BIM modellers', status: 'Not started', estimatedHours: 64 },
            { title: 'Detailed review from the reviewer', status: 'Not started', estimatedHours: 96 },
            { title: 'Design adjustments after review', status: 'Not started', estimatedHours: 104 },
            { title: 'Bill of quantities and specs', status: 'Not started', estimatedHours: 40 },
            { title: 'Calculation reports', status: 'Not started', estimatedHours: 80 },
        ]

        // Add tasks sequentially with animation (one at a time)
        scriptedTasks.forEach((task, index) => {
            setTimeout(() => {
                addTaskNode(task)
                
                // Fit view after last task is added
                if (index === scriptedTasks.length - 1) {
                    setTimeout(() => {
                        if (reactFlowInstance.current) {
                            reactFlowInstance.current.fitView({
                                padding: 0.2,
                                duration: 800,
                                maxZoom: 1,
                            })
                        }
                    }, 200)
                }
            }, index * 400) // 400ms delay between each task
        })
    }

    // Handle chat visibility changes - adjust canvas viewport
    const handleChatVisibilityChange = (isVisible: boolean) => {
        setIsChatVisible(isVisible)
        
        // Adjust canvas viewport when chat opens/closes
        setTimeout(() => {
            if (reactFlowInstance.current) {
                reactFlowInstance.current.fitView({
                    padding: 0.2,
                    duration: 500,
                    maxZoom: 1,
                })
            }
        }, 300) // Wait for animation to start
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                <Canvas onInit={setReactFlowInstance} />
                <ChatPanel 
                    onConfirm={handleChatConfirm} 
                    onVisibilityChange={handleChatVisibilityChange}
                />
                <ExportButtons isChatVisible={isChatVisible} hasNodes={nodes.filter(n => n.type === 'taskCardNode').length > 0} />
                <TaskBook />
                <CanvasSidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
            </div>
        </SidebarProvider>
    )
}