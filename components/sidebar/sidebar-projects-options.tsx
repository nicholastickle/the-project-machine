import {
    MoreHorizontal, Trash2
} from "lucide-react"
import { useState } from "react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
    SidebarMenuAction,
    useSidebar,
} from "@/components/ui/sidebar"
import useProjectStore from "@/stores/project-store"
import useStore from "@/stores/flow-store"

interface OptionsProjectProps {
    projectId: string
    projectName: string
    onRename: () => void
}

export default function SidebarProjectsOptions({ projectId, projectName, onRename }: OptionsProjectProps) {
    const { isMobile } = useSidebar()
    const { duplicateProject, deleteProject } = useProjectStore()
    const { syncWithActiveProject } = useStore()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const handleRenameProject = () => {
        onRename()
    }

    const handleDuplicateProject = () => {
        duplicateProject(projectId, `${projectName} (copy)`)
    }

    const handleDeleteConfirm = () => {
        deleteProject(projectId)
        syncWithActiveProject()
        setIsDeleteOpen(false)
    }

    const handleDeleteCancel = () => {
        setIsDeleteOpen(false)
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
                <DropdownMenuItem onClick={handleRenameProject} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicateProject} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen} modal={true}>
                    <PopoverTrigger asChild>
                        <DropdownMenuItem
                            className="focus:bg-sidebar-accent focus:text-foreground text-xs"
                            onSelect={(e) => {
                                e.preventDefault();
                                setIsDeleteOpen(true);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 bg-white" align="start" side="right">
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-foreground">
                                Delete this project?
                            </div>
                            <div className="text-xs text-muted-foreground">
                                This action cannot be undone. All tasks and progress will be lost.
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleDeleteConfirm}
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1 text-foreground"
                                >
                                    Yes, delete
                                </Button>
                                <Button
                                    onClick={handleDeleteCancel}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-foreground"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}