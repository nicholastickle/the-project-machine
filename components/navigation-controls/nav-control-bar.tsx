"use client"

import { useState } from "react"
import CanvasMinimap from "./minimap"
import { NavToggle } from "./nav-toggle"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useReactFlow } from "@xyflow/react"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"

export default function NavControlBar() {
    const { open, isMobile } = useSidebar()
    const [showMinimap, setShowMinimap] = useState(true)
    const { zoomIn, zoomOut, fitView } = useReactFlow()

    const handleZoomIn = () => zoomIn()
    const handleZoomOut = () => zoomOut()
    const handleFitView = () => fitView({
        duration: 1500,
        padding: 0.15,
        minZoom: 0.5,
        maxZoom: 2
    })

    const handleToggleMinimap = (isOpen: boolean) => {
        setShowMinimap(isOpen)
    }

    return (
        <div className={`absolute border rounded-md border-control-border bg-control-background bottom-[7px] left-4 z-50 flex flex-col  transition-all duration-300 ${!isMobile && open ? 'left-[263px]' : 'left-[7px] md:left-[55px]'} ${isMobile && !open ? 'left-[0px]' : ''}`}>

            <div className={`flex items-center justify-between ${ showMinimap ? 'border-b border-control-border' : ''}`}>
                
                    <div className="flex gap-3 p-1  ">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleZoomIn}
                            className="h-6 w-6 p-0 hover:bg-control-accent hover:text-control-foreground"
                        >
                            <ZoomIn className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleZoomOut}
                            className="h-6 w-6 p-0 hover:bg-control-accent hover:text-control-foreground"
                        >
                            <ZoomOut className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleFitView}
                            className="h-6 w-6 p-0 hover:bg-control-accent hover:text-control-foreground"
                        >
                            <Maximize className="h-3 w-3" />
                        </Button>
                        
                    </div>
                    {!isMobile && (
                    <NavToggle
                            isOpen={showMinimap}
                            onToggle={handleToggleMinimap}
                        />
                    )}

            </div>
            {showMinimap && !isMobile && (
                <div className="">
                    <CanvasMinimap />
                </div>
            )}
        </div>
    )
}