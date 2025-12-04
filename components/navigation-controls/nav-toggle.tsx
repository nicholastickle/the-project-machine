
import { Toggle } from "@/components/ui/toggle"
import { ChevronDown, ChevronRight } from "lucide-react"

interface NavToggleProps {
    isOpen: boolean
    onToggle: (open: boolean) => void
}

export function NavToggle({ isOpen, onToggle }: NavToggleProps) {
    return (
        <Toggle
            pressed={isOpen}
            onPressedChange={onToggle}
            aria-label={isOpen ? "Hide minimap" : "Show minimap"}
            className="h-6 w-6 rounded-md bg-control-background hover:bg-control-accent hover:text-control-foreground data-[state=on]:bg-control-background data-[state=on]:text-control-foreground data-[state=on]:hover:bg-control-accent"
        >
            {isOpen ? (
                <ChevronDown className="h-3 w-3" />
            ) : (
                <ChevronRight className="h-3 w-3" />
            )}
        </Toggle>
    )
}