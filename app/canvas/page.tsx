"use client"

import Canvas from "@/components/canvas/canvas"
import ChatPanel from "@/components/chat/chat-panel"
import SidebarProvider from "@/components/ui/sidebar"
import CanvasSidebar from "@/components/sidebar/canvas-sidebar"
import CanvasToolbar from "@/components/toolbar/canvas-toolbar"
import CanvasSidebarTrigger from "@/components/sidebar/sidebar-trigger"
import ExportButtons from "@/components/export/export-buttons"
import TaskBook from "@/components/task-book/task-book"
import AuthProvider from "@/components/auth/auth-provider"
import useStore from "@/stores/flow-store"
import { useEffect, useRef, useState } from "react"
import type { ReactFlowInstance } from "@xyflow/react"
import { useAutosave, loadLatestSnapshot } from "@/lib/autosave"

export default function CanvasPage() {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const [isChatVisible, setIsChatVisible] = useState(true)
    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)
    const nodes = useStore((state) => state.nodes)
    const projectId = useStore((state) => state.projectId)
    const setNodes = useStore((state) => state.setNodes)
    const setEdges = useStore((state) => state.setEdges)
    const markClean = useStore((state) => state.markClean)
    
    const { performAutosave } = useAutosave(120000)

    const setReactFlowInstance = (instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance
        // Center on canvas without animation
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

    // Load latest snapshot when project changes
    useEffect(() => {
        if (!projectId) return

        loadLatestSnapshot(projectId).then((snapshot) => {
            if (snapshot) {
                setNodes(snapshot.nodes)
                setEdges(snapshot.edges)
                markClean()
                useStore.setState({ lastSavedAt: new Date().toISOString() })
            }
        })
    }, [projectId])

    // Autosave interval
    useEffect(() => {
        if (!projectId) return

        const interval = setInterval(() => {
            performAutosave()
        }, 120000) // 2 minutes

        return () => clearInterval(interval)
    }, [projectId, performAutosave])

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

    // Handle chat visibility changes
    const handleChatVisibilityChange = (isVisible: boolean) => {
        setIsChatVisible(isVisible)
    }

    return (
        <AuthProvider>
            <SidebarProvider defaultOpen={false}>
                <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                    <Canvas onInit={setReactFlowInstance} />
                    <ChatPanel
                        projectId={projectId ?? undefined}
                        onVisibilityChange={handleChatVisibilityChange}
                    />
                    <ExportButtons isChatVisible={isChatVisible} />
                    <TaskBook />
                    <CanvasSidebar />
                    <CanvasToolbar />
                    <CanvasSidebarTrigger />
                </div>
            </SidebarProvider>
        </AuthProvider>
    )
}