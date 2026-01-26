"use client"

import Canvas from "@/components/canvas/canvas"
import ChatPanel from "@/components/chat/chat-panel"
import SidebarProvider from "@/components/ui/sidebar"
import Sidebar from "@/components/sidebar/sidebar"
import CanvasToolbar from "@/components/toolbar/canvas-toolbar"
import CanvasSidebarTrigger from "@/components/sidebar/sidebar-trigger"
import ExportButtons from "@/components/export/export-buttons"
import useStore from "@/stores/flow-store"
import useProjectStore from "@/stores/project-store"
import useChatsStore from "@/stores/chats-store"
import useTaskbookStore from "@/stores/taskbook-store"
import { loadProjectCanvas } from "@/lib/canvas-sync"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import type { ReactFlowInstance } from "@xyflow/react"
import type { Node, Edge } from "@/stores/types"

export default function CanvasProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, isLoading: authLoading } = useAuth()
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
    const [isChatVisible, setIsChatVisible] = useState(true)
    const [isChatDocked, setIsChatDocked] = useState(false)
    const [projectId, setProjectId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const setNodes = useStore((state) => state.setNodes)
    const setEdges = useStore((state) => state.setEdges)
    const setTasks = useStore((state) => state.setTasks)
    const setProjectIdInStore = useStore((state) => state.setProjectId)
    const setActiveProject = useProjectStore((state) => state.setActiveProject)
    const fetchProjects = useProjectStore((state) => state.fetchProjects)
    const { loadChatHistoryFromBackend } = useChatsStore()
    const fetchTaskbook = useTaskbookStore((state) => state.fetchTaskbook)

    // Handle invitation acceptance
    useEffect(() => {
        const inviteToken = searchParams.get('invite');
        if (inviteToken && user) {
            (async () => {
                try {
                    const response = await fetch(`/api/invite/${inviteToken}`, {
                        method: 'POST'
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        toast.success('Invitation accepted! Welcome to the project.');
                        // Refresh projects list
                        await fetchProjects();
                        // Remove invite param from URL
                        const url = new URL(window.location.href);
                        url.searchParams.delete('invite');
                        window.history.replaceState({}, '', url.toString());
                    } else {
                        toast.error(data.error || 'Failed to accept invitation');
                    }
                } catch (error) {
                    console.error('Invitation error:', error);
                    toast.error('Failed to accept invitation');
                }
            })();
        }
    }, [searchParams, user, fetchProjects]);

    // Redirect to landing if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            console.log('[Canvas Page] Not authenticated, redirecting to landing')
            router.replace('/')
        }
    }, [authLoading, user, router])

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
            
            // Load canvas data (nodes/edges/tasks) from backend
            const { nodes, edges, tasks } = await loadProjectCanvas(projectId)
            
            setNodes(nodes as any)
            setEdges(edges as any)
            setTasks(tasks)

            // Load chat history for this project
            await loadChatHistoryFromBackend(projectId)
            
            // Load taskbook templates
            await fetchTaskbook()
            
            setIsLoading(false)
            console.log('[Canvas Page] Project loaded successfully')
        }

        loadProject()
    }, [projectId, setActiveProject, setProjectIdInStore, setNodes, setEdges, setTasks, loadChatHistoryFromBackend, fetchTaskbook])

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
                <Canvas onInit={setReactFlowInstance as any} />
                <ChatPanel
                    onVisibilityChange={handleChatVisibilityChange}
                />
                <ExportButtons isChatVisible={isChatDocked} />
                <Sidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
            </div>
        </SidebarProvider>
    )
}

