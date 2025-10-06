"use client"

import { Plus } from "lucide-react"
import {
    SidebarMenuButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NewTask() {
    const handleAddNewTask = () => {
        console.log("Add New Task clicked")
    }

    return (
        <SidebarMenuSubItem>
            <SidebarMenuButton onClick={handleAddNewTask} className="w-full text-muted text-xs">
                <Plus className="h-4 w-4" />
                <span>Add new favorite task</span>
            </SidebarMenuButton>
        </SidebarMenuSubItem>
    )
}