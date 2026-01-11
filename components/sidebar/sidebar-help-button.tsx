import { HelpCircle } from "lucide-react"
import SidebarHelpOptions from "@/components/sidebar/sidebar-help-options"

export default function SidebarHelpButton() {
    return (
        <SidebarHelpOptions>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 ring-sidebar-ring">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help</span>
            </button>
        </SidebarHelpOptions>
    )
}