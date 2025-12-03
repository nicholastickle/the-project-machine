"use client"

import { useState, useCallback } from 'react'
import './ai-orb.css'

type OrbState = 'dormant' | 'speaking'

interface AIorbProps {
    initialState?: OrbState
    onConnect?: () => void
    onDisconnect?: () => void
    isConnected?: boolean
    isSpeaking?: boolean
    className?: string
}

export default function AIOrb({
    initialState = 'dormant',
    onConnect,
    onDisconnect,
    isConnected = false,
    isSpeaking = false,
    className = ''
}: AIorbProps) {
    const state = isConnected ? (isSpeaking ? 'speaking' : 'speaking') : 'dormant'

    const handleClick = useCallback(() => {
        if (isConnected) {
            onDisconnect?.()
        } else {
            onConnect?.()
        }
    }, [isConnected, onConnect, onDisconnect])

const getOrbClassName = useCallback(() => {
    let baseClass = 'ai-orb'
    baseClass += state === 'speaking' ? ' speaking' : ' listening'
    if (className) baseClass += ` ${className}`
    return baseClass
}, [state, className])

    return (
        <div className="ai-orb-container shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)]">
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
