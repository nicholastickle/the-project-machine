"use client"

import Canvas from "@/components/canvas/canvas"
import ChatPanel from "@/components/chat/chat-panel"
import SidebarProvider from "@/components/ui/sidebar"
import CanvasSidebar from "@/components/sidebar/canvas-sidebar"
import CanvasToolbar from "@/components/toolbar/canvas-toolbar"
import CanvasSidebarTrigger from "@/components/sidebar/sidebar-trigger"
import ExportButtons from "@/components/export/export-buttons"
import TaskBook from "@/components/task-book/task-book"
import { bridgeDesignTasks } from "@/components/chat/chat-mock-data"
import useStore from "@/stores/flow-store"
import { useEffect, useRef, useState } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

export default function CanvasPage() {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const [isChatVisible, setIsChatVisible] = useState(true)
    const [isChatDocked, setIsChatDocked] = useState(false)
    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)
    const addTaskNode = useStore((state) => state.addTaskNode)
    const nodes = useStore((state) => state.nodes)
    const projectId = useStore((state) => state.projectId)
    
    // Sprint 3: Backend sync methods
    const loadProject = useStore((state) => state.loadProject)
    const subscribeToRealtime = useStore((state) => state.subscribeToRealtime)

    const setReactFlowInstance = (instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance
        // Center on logo without animation
        instance.setCenter(600, 300, { zoom: 0.8 })
    }

    // Sprint 3: Auto-load first project with backend sync
    useEffect(() => {
        const loadFirstProject = async () => {
            try {
                // Fetch user's first project
                const response = await fetch('/api/projects')
                if (!response.ok) {
                    console.error('[Canvas Page] Failed to fetch projects')
                    return
                }
                
                const { projects } = await response.json()
                if (projects && projects.length > 0) {
                    const firstProject = projects[0]
                    console.log('[Canvas Page] Loading first project:', firstProject.id)
                    await loadProject(firstProject.id)
                } else {
                    console.log('[Canvas Page] No projects found - working in local mode')
                }
            } catch (error) {
                console.error('[Canvas Page] Error loading project:', error)
            }
        }
        
        loadFirstProject()
    }, [loadProject])

    // Sprint 3: Subscribe to realtime updates when project is loaded
    useEffect(() => {
        if (!projectId) return
        
        console.log('[Canvas Page] Setting up realtime subscription for project:', projectId)
        const unsubscribe = subscribeToRealtime()
        
        return () => {
            console.log('[Canvas Page] Cleaning up realtime subscription')
            unsubscribe()
        }
    }, [projectId, subscribeToRealtime])

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
        const scriptedTasks = bridgeDesignTasks

        // Add tasks sequentially with animation (one at a time)
        scriptedTasks.forEach((task, index) => {
            setTimeout(() => {
                addTaskNode(task)

                // Fit view after last task is added
                if (index === scriptedTasks.length - 1) {
                    setTimeout(() => {
                        if (reactFlowInstance.current) {
                            reactFlowInstance.current.fitView({
                                padding: 0.3,
                                duration: 1000,
                                maxZoom: 0.8,
                            })
                        }
                    }, 200)
                }
            }, index * 400) // 400ms delay between each task
        })
    }

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
                    onConfirm={handleChatConfirm}
                    onVisibilityChange={handleChatVisibilityChange}
                />
                <ExportButtons isChatVisible={isChatDocked} />
                <TaskBook />
                <CanvasSidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
            </div>
        </SidebarProvider>
    )
}