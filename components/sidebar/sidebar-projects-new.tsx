import { Plus } from "lucide-react"
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import useProjectStore from "@/stores/project-store"

export default function SidebarProjectsNew() {
    const { addProject } = useProjectStore()

    const handleAddNewProject = () => {
        addProject("New Project")
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton onClick={handleAddNewProject} className="w-full text-muted text-xs hover:text-muted hover:bg-transparent hover:underline">
                <Plus className="w-4 h-4" />
                <span>Add new project</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}