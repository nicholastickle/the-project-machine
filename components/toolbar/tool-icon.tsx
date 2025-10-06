"use client"

import { LucideIcon } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ToolIconProps {
    icon: LucideIcon
    toolName: string
    isActive?: boolean
    onAction: () => void
}

export function ToolIcon({ icon: Icon, toolName, isActive = false, onAction }: ToolIconProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={onAction}
                        className={`
                            flex items-center justify-center w-10 h-10 rounded-lg
                            transition-all duration-200 ease-in-out
                            hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                            focus:bg-sidebar-accent focus:text-sidebar-accent-foreground
                            focus:outline-none focus:ring-2 focus:ring-sidebar-ring
                            ${isActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                : 'text-sidebar-foreground hover:shadow-sm'
                            }
                        `}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{toolName}</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-sidebar-background border-sidebar-border">
                    <p className="text-sm">{toolName}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}