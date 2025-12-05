"use client"

import { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'
import useStore from '@/stores/flow-store'

interface EditableEstimateProps {
    nodeId: string
    estimatedHours?: number
    backgroundColor?: string
}

export default function EditableEstimate({ nodeId, estimatedHours = 0, backgroundColor = '' }: EditableEstimateProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(estimatedHours?.toString() || '0')
    const inputRef = useRef<HTMLInputElement>(null)
    const updateNodeData = useStore((state) => state.updateNodeData)

    useEffect(() => {
        setValue(estimatedHours?.toString() || '0')
    }, [estimatedHours])

    const handleClick = () => {
        setIsEditing(true)
        setTimeout(() => inputRef.current?.select(), 0)
    }

    const handleBlur = () => {
        setIsEditing(false)
        const numValue = parseFloat(value) || 0
        if (numValue !== estimatedHours) {
            updateNodeData(nodeId, { estimatedHours: numValue })
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur()
        } else if (e.key === 'Escape') {
            setValue(estimatedHours?.toString() || '0')
            setIsEditing(false)
        }
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-1">
                <Clock className="w-5 h-5 text-task-card-foreground" />
                <span className="text-sm text-task-card-foreground">Estimated hours:</span>
                <input
                    ref={inputRef}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="w-12 px-1 text-sm bg-task-card-background border border-task-card-border rounded text-task-card-foreground focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    step="0.5"
                    min="0"
                />
                <span className="text-sm text-task-card-foreground">h</span>
            </div>
        )
    }

    return (
        <div
            className={`flex items-center gap-1 cursor-pointer hover:bg-task-card-accent px-2 py-1 rounded-lg transition-colors bg-${backgroundColor}`}
            onClick={handleClick}
            title="Click to edit estimate"
        >
            <Clock className="w-5 h-5 text-task-card-foreground" />
            <span className="text-sm text-task-card-foreground">Estimated hours: {estimatedHours || 0}h</span>
        </div>
    )
}
