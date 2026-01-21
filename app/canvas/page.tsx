"use client"

import Canvas from "@/components/canvas/canvas"
import ChatPanel from "@/components/chat/chat-panel"
import SidebarProvider from "@/components/ui/sidebar"
import CanvasSidebar from "@/components/sidebar/sidebar"
import CanvasToolbar from "@/components/toolbar/canvas-toolbar"
import CanvasSidebarTrigger from "@/components/sidebar/sidebar-trigger"
import ExportButtons from "@/components/export/export-buttons"
import useStore from "@/stores/flow-store"
import { useEffect, useRef, useState } from "react"
import type { ReactFlowInstance } from "@xyflow/react"
import type { Node, Edge } from "@/stores/types"

export default function CanvasPage() {
    const reactFlowInstance = useRef<ReactFlowInstance<Node, Edge> | null>(null)
    const [isChatVisible, setIsChatVisible] = useState(true)
    const [isChatDocked, setIsChatDocked] = useState(true) // Default to docked
    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)


    const setReactFlowInstance = (instance: ReactFlowInstance<Node, Edge>) => {
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

    // Handle chat visibility changes
    const handleChatVisibilityChange = (isVisible: boolean, isDocked: boolean) => {
        setIsChatVisible(isVisible)
        setIsChatDocked(isDocked)
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                <Canvas onInit={setReactFlowInstance} />
                <ChatPanel onVisibilityChange={handleChatVisibilityChange} />
                <ExportButtons isChatVisible={isChatVisible && isChatDocked} />
                <CanvasSidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
            </div>
        </SidebarProvider>
    )
}