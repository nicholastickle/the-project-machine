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
import useProjectStore from "@/stores/project-store"
import { loadProjectCanvas } from "@/lib/canvas-sync"
import { useEffect, useRef, useState } from "react"
import type { ReactFlowInstance } from "@xyflow/react"
import type { Node, Edge } from "@/stores/types"

export default function CanvasProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const [isChatVisible, setIsChatVisible] = useState(true)
    const [isChatDocked, setIsChatDocked] = useState(false)
    const [projectId, setProjectId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const setNodes = useStore((state) => state.setNodes)
    const setEdges = useStore((state) => state.setEdges)
    const setProjectIdInStore = useStore((state) => state.setProjectId)
    const setActiveProject = useProjectStore((state) => state.setActiveProject)

    const setReactFlowInstance = (instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance
        // Center on logo without animation  
        setTimeout(() => instance.setCenter(600, 300, { zoom: 0.8 }), 0)
    }

    // Get project ID from params
    useEffect(() => {
        params.then(p => setProjectId(p.id))
    }, [params])

    // Load project data from backend
    useEffect(() => {
        if (!projectId) return

        const loadProject = async () => {
            setIsLoading(true)
            console.log('[Canvas Page] Loading project:', projectId)
            
            // Set active project in store
            setActiveProject(projectId)
            setProjectIdInStore(projectId)
            
            // Load canvas data (nodes/edges) from backend
            const { nodes, edges } = await loadProjectCanvas(projectId)
            setNodes(nodes)
            setEdges(edges)
            
            setIsLoading(false)
            console.log('[Canvas Page] Project loaded:', nodes.length, 'nodes')
        }

        loadProject()
    }, [projectId, setActiveProject, setProjectIdInStore, setNodes, setEdges])

    // Handle chat visibility changes
    const handleChatVisibilityChange = (isVisible: boolean, isDocked: boolean) => {
        setIsChatVisible(isVisible)
        setIsChatDocked(isDocked)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-muted-foreground">Loading project...</p>
            </div>
        )
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

