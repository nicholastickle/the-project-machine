"use client"

import { useState } from 'react'
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

    const handleClick = () => {
        const newState = state === 'dormant' ? 'speaking' : 'dormant'
        setState(newState)
        onStateChange?.(newState)
    }

    const getOrbClassName = () => {
        let baseClass = 'ai-orb'

        if (state === 'speaking') {
            baseClass += ' speaking'
        } else {
            baseClass += ' listening'
        }

        if (className) {
            baseClass += ` ${className}`
        }

        return baseClass
    }

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
