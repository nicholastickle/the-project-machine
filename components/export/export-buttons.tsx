"use client"

import { FileSpreadsheet, Clock, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useStore from "@/stores/flow-store"

interface ExportButtonsProps {
  isChatVisible?: boolean
}

export default function ExportButtons({ isChatVisible = true }: ExportButtonsProps) {
    const resetCanvas = useStore((state) => state.resetCanvas)

    const exportToExcel = () => {
        // Sprint 2: Show alert instead of actual export
        alert('Excel export coming soon! This will export tasks with estimates, status, and dependencies.')
    }

    const exportTimesheet = () => {
        // Sprint 2: Show alert instead of actual export
        alert('Timesheet export coming soon! This will export time tracking data for billing.')
    }

    const handleResetDemo = () => {
        if (confirm('Reset demo? This will clear all tasks and restart the conversation.')) {
            resetCanvas()
            // Reload page to reset chat state
            window.location.reload()
        }
    }

    return (
        <TooltipProvider>
            <div 
                className={`absolute top-4 z-50 flex gap-2 transition-all duration-500 ${
                    isChatVisible ? 'right-[420px]' : 'right-4'
                }`}
            >
                {/* Excel Export */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={exportToExcel}
                            className="bg-background/95 backdrop-blur-sm hover:bg-accent"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Export to Excel</p>
                    </TooltipContent>
                </Tooltip>

                {/* Timesheet Export */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={exportTimesheet}
                            className="bg-background/95 backdrop-blur-sm hover:bg-accent"
                        >
                            <Clock className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Export Timesheet</p>
                    </TooltipContent>
                </Tooltip>

                {/* Reset Demo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleResetDemo}
                            className="bg-background/95 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reset Demo</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
