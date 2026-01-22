import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import useProjectStore from "@/stores/project-store"

export default function SidebarProjectsNew() {
    const router = useRouter()
    const { createProject, setActiveProject } = useProjectStore()

    const handleAddNewProject = async () => {
        const projectId = await createProject("New Project")
        if (projectId) {
            setActiveProject(projectId)
            router.push(`/canvas/${projectId}`)
        }
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