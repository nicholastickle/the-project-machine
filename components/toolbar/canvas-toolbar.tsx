"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Undo2, Redo2, ClipboardPlus, MousePointer, Hand, HelpCircle } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useStore from "@/stores/flow-store"
import { useSidebar } from "@/components/ui/sidebar"
import SidebarHelpOptions from "@/components/sidebar/sidebar-help-options"

export default function CanvasToolbar() {

    const undo = useStore((state) => state.undo)
    const redo = useStore((state) => state.redo)
    const addTaskNode = useStore((state) => state.addTaskNode)
    const historyIndex = useStore((state) => state.historyIndex)
    const history = useStore((state) => state.history)
    const cursorMode = useStore((state) => state.cursorMode)
    const setCursorMode = useStore((state) => state.setCursorMode)
    const { open, isMobile } = useSidebar()

    const canUndo = historyIndex > 0 && history.length > 1
    const canRedo = historyIndex < history.length - 1

    const handleAddTask = async () => {
        await addTaskNode()
    }

    const handleSelectMode = () => {
        setCursorMode('select')
    }

    const handlePanMode = () => {
        setCursorMode('pan')
    }

    // Handle ESC key to return to select mode
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCursorMode('select')
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [setCursorMode])

    return (
        <TooltipProvider>
            <div className={`absolute top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2  ${!isMobile && open ? 'left-[263px]' : 'left-[7px] md:left-[55px]'} ${isMobile && !open ? 'left-[0px]' : ''}`}>

                <div className="flex flex-col gap-1 bg-toolbar-background border border-toolbar-border rounded-full px-1 py-2 shadow-sm">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="lg"
                                variant="ghost"
                                onClick={handleSelectMode}
                                className={`h-10 w-10 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground ${cursorMode === 'select' ? 'bg-toolbar-accent text-toolbar-foreground' : ''
                                    }`}
                            >
                                <MousePointer className="h-10 w-10" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Select</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="lg"
                                variant="ghost"
                                onClick={handlePanMode}
                                className={`h-10 w-10 p-0 hover:bg-toolbar-accent focus:outline-none hover:text-toolbar-foreground ${cursorMode === 'pan' ? 'bg-toolbar-accent  text-toolbar-foreground' : ''
                                    }`}
                            >
                                <Hand className="h-10 w-10" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Pan</p>
                        </TooltipContent>
                    </Tooltip>



                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="lg"
                                variant="ghost"
                                onClick={handleAddTask}
                                className="h-10 w-10 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground"
                            >
                                <ClipboardPlus className="h-10 w-10" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Add New Task</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="h-px w-10 bg-toolbar-border" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarHelpOptions>
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="h-10 w-10 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground"
                                >
                                    <HelpCircle className="h-10 w-10" />
                                </Button>
                            </SidebarHelpOptions>
                        </TooltipTrigger>

                        <TooltipContent side="right">
                            <p>Help</p>
                        </TooltipContent>
                    </Tooltip>




                </div>
                <div className="flex flex-col gap-1 bg-toolbar-background border border-toolbar-border rounded-full px-1 py-2 shadow-sm">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="lg"
                                variant="ghost"
                                onClick={() => undo()}
                                disabled={!canUndo}
                                className="h-10 w-10 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground disabled:opacity-30"
                            >
                                <Undo2 className="h-10 w-10" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Undo (Ctrl+Z)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="lg"
                                variant="ghost"
                                onClick={() => redo()}
                                disabled={!canRedo}
                                className="h-10 w-10 p-0 hover:bg-toolbar-accent hover:text-toolbar-foreground disabled:opacity-30"
                            >
                                <Redo2 className="h-10 w-10" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Redo (Ctrl+Y)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider >
    )
}
