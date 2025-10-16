"use client"

import { useState, useCallback } from 'react'
import './ai-orb.css'

type OrbState = 'dormant' | 'speaking'

interface AIorbProps {
    initialState?: OrbState
    onStateChange?: (state: OrbState) => void
    className?: string
}

export default function AIOrb({
    initialState = 'dormant',
    onStateChange,
    className = ''
}: AIorbProps) {
    const [state, setState] = useState<OrbState>(initialState)

  const handleClick = useCallback(() => {
    const newState = state === 'dormant' ? 'speaking' : 'dormant'
    setState(newState)
    onStateChange?.(newState)
}, [state, onStateChange])

const getOrbClassName = useCallback(() => {
    let baseClass = 'ai-orb'
    baseClass += state === 'speaking' ? ' speaking' : ' listening'
    if (className) baseClass += ` ${className}`
    return baseClass
}, [state, className])

    return (
        <div className="ai-orb-container">
            <div
                className={getOrbClassName()}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleClick()
                    }
                }}
                aria-label={`AI Assistant - Currently ${state === 'speaking' ? 'speaking' : 'dormant'}. Click to ${state === 'speaking' ? 'stop' : 'activate'}.`}
                title={`AI Assistant (${state})`}
            />
        </div>
    )
}
