"use client"

import { useState } from "react"
import { Mouse, Hand, Plus } from "lucide-react"
import { ToolIcon } from "./tool-icon"

type ToolType = 'select' | 'pan' | 'add'

export function CanvasToolbar() {
    const [activeTool, setActiveTool] = useState<ToolType>('select')

    const handleSelectTool = () => {
        setActiveTool('select')
        console.log('Selection tool activated')
    }

    const handlePanTool = () => {
        setActiveTool('pan')
        console.log('Pan tool activated')
    }

    const handleAddTool = () => {
        setActiveTool('add')
        console.log('Add task tool activated')
    }

    return (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
            <div className="flex flex-col items-center gap-2 p-3 bg-sidebar-background border border-sidebar-border rounded-full shadow-lg backdrop-blur-md">
                <ToolIcon
                    icon={Mouse}
                    toolName="Selection Tool"
                    isActive={activeTool === 'select'}
                    onAction={handleSelectTool}
                />
                <ToolIcon
                    icon={Hand}
                    toolName="Pan Canvas"
                    isActive={activeTool === 'pan'}
                    onAction={handlePanTool}
                />
                <div className="w-6 h-px bg-sidebar-border my-1" />
                <ToolIcon
                    icon={Plus}
                    toolName="Add New Task"
                    isActive={activeTool === 'add'}
                    onAction={handleAddTool}
                />
            </div>
        </div>
    )
}