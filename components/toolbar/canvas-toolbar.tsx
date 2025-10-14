"use client"

import { useState } from "react"
import { MousePointer, Hand, Plus, RotateCcw } from "lucide-react"
import { ToolIcon } from "./tool-icon"
import { useSidebar } from "@/components/ui/sidebar"
import useStore from '@/stores/flow-store'

type ToolType = 'select' | 'pan' | 'add'

export function CanvasToolbar() {
    const [activeTool, setActiveTool] = useState<ToolType>('select')
    const { open, isMobile } = useSidebar()
    const addTaskNode = useStore(state => state.addTaskNode)
    const resetCanvas = useStore(state => state.resetCanvas)

    const handleSelectTool = () => {
        setActiveTool('select')
        console.log('Selection tool activated')
    }

    const handlePanTool = () => {
        setActiveTool('pan')
        console.log('Pan tool activated')
    }

    const handleAddTask = () => {
        setActiveTool('select')
        addTaskNode({
            title: 'New Task'
        })
    }

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the canvas? This will clear all your work.')) {
            resetCanvas()
            setActiveTool('select')
        }
    }


    return (
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${!isMobile && open ? 'left-[263px]' : 'left-[7px] md:left-[55px]'} ${isMobile && !open ? 'left-[0px]' : ''}`}>
            <div className="flex flex-col items-center gap-2 px-2 py-3 bg-toolbar-background border border-toolbar-border rounded-full shadow-md ">
                <ToolIcon
                    icon={MousePointer}
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
                <div className="w-6 h-px bg-toolbar-border my-1" />
                <ToolIcon
                    icon={Plus}
                    toolName="Add New Task"
                    onAction={handleAddTask}
                />
                {process.env.NODE_ENV === 'development' && (
                <ToolIcon
                    icon={RotateCcw}
                    toolName="Reset Canvas"
                    onAction={handleReset}
                />
                )}  
            </div>
        </div>
    )
}