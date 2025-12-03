"use client"

import { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'
import useStore from '@/stores/flow-store'

interface EditableEstimateProps {
    nodeId: string
    estimatedHours?: number
}

export default function EditableEstimate({ nodeId, estimatedHours = 0 }: EditableEstimateProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(estimatedHours?.toString() || '0')
    const inputRef = useRef<HTMLInputElement>(null)
    const updateNodeData = useStore((state) => state.updateNodeData)

    useEffect(() => {
        setValue(estimatedHours?.toString() || '0')
    }, [estimatedHours])

    const handleDoubleClick = () => {
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
                <Clock className="w-3 h-3 text-indigo-600" />
                <span className="text-xs text-gray-700">Est:</span>
                <input
                    ref={inputRef}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="w-12 px-1 text-xs bg-white/80 border border-indigo-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    step="0.5"
                    min="0"
                />
                <span className="text-xs text-gray-700">h</span>
            </div>
        )
    }

    return (
        <div 
            className="flex items-center gap-1 cursor-pointer hover:bg-indigo-100/60 px-2 py-1 rounded-lg transition-colors bg-white/60 shadow-sm"
            onDoubleClick={handleDoubleClick}
            title="Double-click to edit estimate"
        >
            <Clock className="w-3 h-3 text-indigo-600" />
            <span className="text-xs font-semibold text-gray-800">Est: {estimatedHours || 0}h</span>
        </div>
    )
}
