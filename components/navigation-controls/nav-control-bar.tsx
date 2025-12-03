"use client"

import { Button } from "@/components/ui/button"
import { useReactFlow } from "@xyflow/react"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"

export default function NavControlBar() {
    const { zoomIn, zoomOut, fitView } = useReactFlow()

    return (
        <div className="absolute border rounded-md border-control-border bg-control-background bottom-[7px] left-[7px] z-50 flex flex-col">
            <div className="flex gap-3 p-1">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => zoomIn()}
                    className="h-6 w-6 p-0 hover:bg-control-accent hover:text-control-foreground"
                >
                    <ZoomIn className="h-3 w-3" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => zoomOut()}
                    className="h-6 w-6 p-0 hover:bg-control-accent hover:text-control-foreground"
                >
                    <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => fitView({ duration: 1500, padding: 0.15, minZoom: 0.5, maxZoom: 2 })}
                    className="h-6 w-6 p-0 hover:bg-control-accent hover:text-control-foreground"
                >
                    <Maximize className="h-3 w-3" />
                </Button>
            </div>
        </div>
    )
}