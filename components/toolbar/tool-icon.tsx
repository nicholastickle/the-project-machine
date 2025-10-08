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
                            flex items-center justify-center w-8 h-8 rounded-lg 
                            hover:bg-toolbar-accent
                            
                            ${isActive
                                ? 'bg-toolbar-accent text-toolbar-foreground/70'
                                : 'text-toolbar-foreground/50'
                            }
                        `}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{toolName}</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-toolbar border-toolbar-border text-toolbar-foreground/60">
                    <p className="text-sm">{toolName}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}