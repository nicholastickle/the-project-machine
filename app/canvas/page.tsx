"use client"

import Canvas from "@/components/canvas/canvas"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { CanvasSidebar } from "@/components/sidebar/canvas-sidebar"
import AIOrb from "@/components/ai-chat/ai-orb";

export default function CanvasPage() {
    return (
        <SidebarProvider defaultOpen={false}>
            <CanvasPageContent />
        </SidebarProvider>
    )
}

function CanvasPageContent() {
    const { open } = useSidebar()

    return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden">
            <Canvas />
            <AIOrb />
            <CanvasSidebar />
            <SidebarTrigger
                className={`absolute top-2.5 z-50 bg-background/80 hover:bg-muted-foreground/10 hover:text-current transition-all duration-300 ${open ? 'left-[265px]' : 'left-[5px] md:left-[60px]'
                    }`}
            />
        </div>
    )
}