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
    const inputRef = useRef<HTMLInputElement>(null)

    // Static projects for fallback (remove once store is working)
    const staticProjects = [
        {
            title: "Board 1",
            url: "#",
        },
        {
            title: "Board 2",
            url: "#",
        },
        {
            title: "Board 3",
            url: "#",
        },
    ]

    // Use project store data, fallback to static for development
    const displayProjects = projects.length > 0 ? projects : staticProjects

    const handleProjectClick = (projectId: string) => {
        if (editingProjectId === projectId) return // Don't switch if editing

        setActiveProject(projectId)
        syncWithActiveProject()
    }

    const startEditing = (item: any) => {
        // Handle both ProjectStoreData and static objects
        const projectId = 'project' in item ? item.project.id : item.title
        const projectName = 'project' in item ? item.project.name : item.title

        setEditingProjectId(projectId)
        setEditingName(projectName)
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
            // Only call rename if we have a real project ID (not static data)
            if (projects.length > 0) {
                renameProject(editingProjectId, editingName.trim())
            }
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
                                className="overflow-y-scroll"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#6b7280 transparent'
                                }}
                            >
                                <SidebarProjectsNew />

                                {displayProjects.map((item) => {
                                    // Handle both ProjectStoreData and static objects
                                    const projectId = 'project' in item ? item.project.id : item.title
                                    const projectName = 'project' in item ? item.project.name : item.title
                                    const isActive = projectId === activeProjectId
                                    const isEditing = editingProjectId === projectId

                                    return (
                                        <SidebarMenuSubItem key={projectId} className="relative group/menu-item flex items-center">
                                            <SidebarMenuSubButton
                                                asChild
                                                className={`flex-1 ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
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
                                                        className={`bg-transparent border-none outline-none w-full ${isEditing ? 'bg-background border border-border rounded px-1 cursor-text' : 'cursor-pointer'}`}
                                                    />
                                                </div>
                                            </SidebarMenuSubButton>
                                            <SidebarProjectsOptions
                                                projectId={projectId}
                                                projectName={projectName}
                                                onRename={() => startEditing(item)}
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