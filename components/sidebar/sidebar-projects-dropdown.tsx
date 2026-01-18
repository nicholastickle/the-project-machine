import { ChevronRight, LayoutDashboard, LucideIcon } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import SidebarProjectsNew from "@/components/sidebar/sidebar-projects-new"
import SidebarProjectsOptions from "@/components/sidebar/sidebar-projects-options"
import useProjectStore from "@/stores/project-store"
import useStore from "@/stores/flow-store"

export default function SidebarProjectsDropdown() {
    // Project store integration
    const { projects, activeProjectId, setActiveProject, renameProject } = useProjectStore()
    const { syncWithActiveProject } = useStore()

    // Inline editing state
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState('')
    const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleProjectClick = (projectId: string) => {
        if (editingProjectId === projectId) return // Don't switch if editing

        setActiveProject(projectId)
        syncWithActiveProject()
    }

    const startEditing = (item: any) => {
        setEditingProjectId(item.project.id)
        setEditingName(item.project.name)
    }

    // Auto-focus input when editing starts
    useEffect(() => {
        if (editingProjectId && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select() // Select all text for easy replacement
        }
    }, [editingProjectId])

    const saveEdit = () => {
        if (editingProjectId && editingName.trim()) {
            renameProject(editingProjectId, editingName.trim())
        }
        setEditingProjectId(null)
        setEditingName('')
    }

    const cancelEdit = () => {
        setEditingProjectId(null)
        setEditingName('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            saveEdit()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            cancelEdit()
        }
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden border-t border-sidebar-border">

            <SidebarMenu>
                <Collapsible
                    key="Projects"
                    asChild
                    defaultOpen={true}
                    className="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip="Projects">
                                <LayoutDashboard />
                                <span>Projects</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub
                                className="overflow-y-auto"
                                style={{
                                    height: 'calc(100vh - 170px)',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'hsl(var(--muted)) hsl(var(--sidebar-background))'
                                }}
                            >
                                <SidebarProjectsNew />

                                {projects.map((item) => {
                                    const projectId = item.project.id
                                    const projectName = item.project.name
                                    const isActive = projectId === activeProjectId
                                    const isEditing = editingProjectId === projectId

                                    return (
                                        <SidebarMenuSubItem
                                            key={projectId}
                                            className="relative flex items-center"
                                            onMouseEnter={() => setHoveredProjectId(projectId)}
                                            onMouseLeave={() => setHoveredProjectId(null)}
                                        >
                                            <SidebarMenuSubButton
                                                asChild
                                                className={`flex-1 ${isActive ? 'bg-sidebar-accent text-foreground' : 'text-muted-foreground hover:bg-sidebar-background hover:text-foreground'} `}
                                            >
                                                <div
                                                    className="flex items-center w-full cursor-pointer"
                                                    onClick={() => !isEditing && handleProjectClick(projectId)}
                                                >
                                                    <input
                                                        ref={isEditing ? inputRef : null}
                                                        readOnly={!isEditing}
                                                        value={isEditing ? editingName : projectName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        onDoubleClick={() => !isEditing && startEditing(item)}
                                                        onBlur={saveEdit}
                                                        onKeyDown={handleKeyDown}
                                                        className={`bg-transparent border-none outline-none w-full  ${isEditing ? 'bg-background border border-border rounded px-1 cursor-text' : 'cursor-pointer'}`}
                                                    />
                                                </div>
                                            </SidebarMenuSubButton>
                                            <SidebarProjectsOptions
                                                projectId={projectId}
                                                projectName={projectName}
                                                onRename={() => startEditing(item)}
                                                isVisible={hoveredProjectId === projectId}
                                            />
                                        </SidebarMenuSubItem>
                                    )
                                })}

                            </SidebarMenuSub>

                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    )
}