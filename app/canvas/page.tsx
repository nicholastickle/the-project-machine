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
import { useEffect, useRef } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

export default function CanvasPage() {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)
    const addTaskNode = useStore((state) => state.addTaskNode)

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
        // Sprint 2: Add 12 pre-defined tasks when user confirms
        const scriptedTasks = [
            { title: 'Site Investigation & Geotech Update', status: 'Not started', estimatedHours: 80 },
            { title: 'Geotechnical Engineering Report', status: 'Not started', estimatedHours: 40 },
            { title: 'Load Analysis & Modeling', status: 'Not started', estimatedHours: 60 },
            { title: 'Foundation Type Selection', status: 'Not started', estimatedHours: 32 },
            { title: 'Foundation Capacity Analysis', status: 'Not started', estimatedHours: 56 },
            { title: 'Structural Foundation Design', status: 'Not started', estimatedHours: 72 },
            { title: 'Finite Element Modeling', status: 'Not started', estimatedHours: 64 },
            { title: 'Seismic Design & Detailing', status: 'Not started', estimatedHours: 48 },
            { title: 'Code Compliance Review', status: 'Not started', estimatedHours: 40 },
            { title: 'Construction Drawings', status: 'Not started', estimatedHours: 96 },
            { title: 'Technical Specifications', status: 'Not started', estimatedHours: 56 },
            { title: 'Environmental & Permit Documentation', status: 'Not started', estimatedHours: 40 },
        ]

        scriptedTasks.forEach((task) => {
            addTaskNode(task)
        })

        // Fit view to show all tasks
        setTimeout(() => {
            if (reactFlowInstance.current) {
                reactFlowInstance.current.fitView({
                    padding: 0.2,
                    duration: 800,
                    maxZoom: 1,
                })
            }
        }, 100)
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                <Canvas onInit={setReactFlowInstance} />
                <ChatPanel onConfirm={handleChatConfirm} />
                <ExportButtons />
                <TaskBook />
                <CanvasSidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
            </div>
        </SidebarProvider>
    )
}