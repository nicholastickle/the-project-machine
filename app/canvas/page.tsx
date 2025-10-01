"use client"

import Canvas from "@/components/canvas/canvas"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { CanvasSidebar } from "@/components/sidebar/canvas-sidebar"

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
        <div className="relative h-screen w-full">
            <Canvas />
            <CanvasSidebar />
            <SidebarTrigger
                className={`absolute top-2.5 z-50 bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background/90 transition-all duration-300 ${open ? 'left-[265px]' : 'left-[5px] md:left-[60px]'
                    }`}
            />
        </div>
    )
}