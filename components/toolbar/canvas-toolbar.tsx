"use client"

import { Button } from "@/components/ui/button"
import { Undo2, Redo2, RotateCcw, ClipboardPlus } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useStore from "@/stores/flow-store"
import { useSidebar } from "@/components/ui/sidebar"

export default function CanvasToolbar() {

    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)
    const addTaskNode = useStore((state) => state.addTaskNode)
    const resetCanvas = useStore((state) => state.resetCanvas)
    const historyIndex = useStore((state) => state.historyIndex)
    const history = useStore((state) => state.history)
    const { open, isMobile } = useSidebar()

    const canUndo = historyIndex > 0 && history.length > 1
    const canRedo = historyIndex < history.length - 1

    const handleAddTask = () => {
        addTaskNode()
    }

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the canvas? This will clear all your work.')) {
            resetCanvas()
        }
    }

    return (
        <TooltipProvider>
            <div className={`absolute top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 bg-toolbar-background border border-toolbar-border rounded-full px-1 py-2 shadow-sm ${!isMobile && open ? 'left-[275px]' : 'left-[55px]'}`}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleAddTask}
                            className="h-8 w-8 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground"
                        >
                            <ClipboardPlus className="h-12 w-12" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Add New Task</p>
                    </TooltipContent>
                </Tooltip>

                {process.env.NODE_ENV === 'development' && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleReset}
                                className="h-8 w-8 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Reset Canvas</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                <div className="h-px w-8 bg-toolbar-border my-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => undo()}
                            disabled={!canUndo}
                            className="h-8 w-8 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground disabled:opacity-30"
                        >
                            <Undo2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Undo (Ctrl+Z)</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => redo()}
                            disabled={!canRedo}
                            className="h-8 w-8 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground disabled:opacity-30"
                        >
                            <Redo2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Redo (Ctrl+Y)</p>
                    </TooltipContent>
                </Tooltip>








            </div>
        </TooltipProvider>
    )
}
