

import { Plus } from "lucide-react"
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NewProject() {
    const handleAddNewProject = () => {
        console.log("new project added")
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton onClick={handleAddNewProject} className="w-full text-muted text-xs">
                <Plus className="w-4 h-4" />
                <span>Add new project</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}