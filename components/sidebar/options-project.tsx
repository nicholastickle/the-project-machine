import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenuAction,
    useSidebar,
} from "@/components/ui/sidebar"

interface OptionsProjectProps {
    projectName: string
    projectId?: string
}

export function OptionsProject({ projectName, projectId }: OptionsProjectProps) {
    const { isMobile } = useSidebar()

    const handleViewProject = () => {
        console.log(`View Project clicked: ${projectName}`)
    }

    const handleShareProject = () => {
        console.log(`Share Project clicked: ${projectName}`)
    }

    const handleDeleteProject = async () => {
        if (!projectId) return
        
        if (confirm(`Delete project "${projectName}"? This cannot be undone.`)) {
            try {
                const response = await fetch(`/api/projects/${projectId}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    window.location.reload() // Reload to refresh project list
                }
            } catch (error) {
                console.error('Error deleting project:', error)
            }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-48 rounded-lg bg-sidebar-options-background shadow-md border border-sidebar-border text-foreground"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
            >
                <DropdownMenuItem onClick={handleViewProject}  className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareProject} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem onClick={handleDeleteProject} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}