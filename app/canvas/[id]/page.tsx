"use client"

import Canvas from "@/components/canvas/canvas"
import ChatPanel from "@/components/chat/chat-panel"
import SidebarProvider from "@/components/ui/sidebar"
import Sidebar from "@/components/sidebar/sidebar"
import CanvasToolbar from "@/components/toolbar/canvas-toolbar"
import CanvasSidebarTrigger from "@/components/sidebar/sidebar-trigger"
import ExportButtons from "@/components/export/export-buttons"
import TaskBook from "@/components/task-book/task-book"
import useStore from "@/stores/flow-store"
import { useEffect, useRef, useState } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

export default function CanvasProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const [isChatVisible, setIsChatVisible] = useState(true)
    const [isChatDocked, setIsChatDocked] = useState(false)
    const [projectId, setProjectId] = useState<string | null>(null)
    
    // TODO: Sprint 3 - Re-enable after wiring Nick's services to backend
    // const loadProject = useStore((state) => state.loadProject)
    // const subscribeToRealtime = useStore((state) => state.subscribeToRealtime)

    const setReactFlowInstance = (instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance
        // Center on logo without animation  
        setTimeout(() => instance.setCenter(600, 300, { zoom: 0.8 }), 0)
    }

    // Get project ID from params
    useEffect(() => {
        params.then(p => setProjectId(p.id))
    }, [params])

    // TODO: Sprint 3 - Re-enable after backend integration
    // useEffect(() => {
    //     if (!projectId) return
    //     console.log('[Canvas Page] Loading project:', projectId)
    //     loadProject(projectId)
    //     const unsubscribe = subscribeToRealtime()
    //     return () => {
    //       console.log('[Canvas Page] Cleaning up realtime subscription')
    //       unsubscribe()
    //     }
    // }, [projectId, loadProject, subscribeToRealtime])

    // Handle chat visibility changes
    const handleChatVisibilityChange = (isVisible: boolean, isDocked: boolean) => {
        setIsChatVisible(isVisible)
        setIsChatDocked(isDocked)
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                <Canvas onInit={setReactFlowInstance} />
                <ChatPanel
                    onVisibilityChange={handleChatVisibilityChange}
                />
                <ExportButtons isChatVisible={isChatDocked} />
                <TaskBook />
                <Sidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
            </div>
        </SidebarProvider>
    )
}

