import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import useProjectStore from "@/stores/project-store"

export default function SidebarProjectsNew() {
    const router = useRouter()
    const { createProject, setActiveProject } = useProjectStore()
    const [isCreating, setIsCreating] = useState(false)

    const handleAddNewProject = async () => {
        if (isCreating) return // Prevent double-click
        
        setIsCreating(true)
        const projectId = await createProject("New Project")
        if (projectId) {
            setActiveProject(projectId)
            router.push(`/canvas/${projectId}`)
        }
        setIsCreating(false)
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton 
                onClick={handleAddNewProject} 
                disabled={isCreating}
                className="w-full text-muted text-xs hover:text-muted hover:bg-transparent hover:underline disabled:opacity-50"
            >
                <Plus className="w-4 h-4" />
                <span>{isCreating ? 'Creating...' : 'Add new project'}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}