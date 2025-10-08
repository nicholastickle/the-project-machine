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
                                ? 'bg-toolbar-accent text-toolbar-foreground/90'
                                : 'text-toolbar-foreground/90'
                            }
                        `}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{toolName}</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    className="border-none bg-popover text-popover-foreground"
                    sideOffset={12}
                >

                    <p className="text-xs">{toolName}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}