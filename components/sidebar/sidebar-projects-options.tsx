import {
    MoreHorizontal
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
}

export default function SidebarProjectsOptions({ projectName }: OptionsProjectProps) {
    const { isMobile } = useSidebar()

    const handleRenameProject = () => {
        console.log(`Rename Project clicked: ${projectName}`)
    }

    const handleDuplicateProject = () => {
        console.log(`Duplicate Project clicked: ${projectName}`)
    }

    const handleDeleteProject = () => {
        console.log(`Delete Project clicked: ${projectName}`)
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
                className="w-24 rounded-lg bg-sidebar-options-background shadow-md border border-sidebar-border text-foreground"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
            >
                <DropdownMenuItem onClick={handleRenameProject}  className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicateProject} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem onClick={handleDeleteProject} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}