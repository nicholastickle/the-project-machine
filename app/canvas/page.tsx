import Canvas from "@/components/canvas/canvas"
import AIOrb from "@/components/ai-chat/ai-orb";
import { SidebarProvider } from "@/components/ui/sidebar"
import { CanvasSidebar } from "@/components/sidebar/canvas-sidebar"
import { CanvasToolbar } from "@/components/toolbar/canvas-toolbar"
import { CanvasSidebarTrigger } from "@/components/sidebar/sidebar-trigger"

export default function CanvasPage() {
    return (
        <SidebarProvider defaultOpen={false}>
            <div className="fixed inset-0 h-screen w-screen overflow-hidden">
                <Canvas />
                <AIOrb />
                <CanvasSidebar />
                <CanvasToolbar />
                <CanvasSidebarTrigger />
            </div>
        </SidebarProvider>
    )
}