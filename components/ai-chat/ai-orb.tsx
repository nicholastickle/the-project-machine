"use client"

import { useState, useCallback } from 'react'
import './ai-orb.css'

type OrbState = 'dormant' | 'connecting' | 'speaking'

interface AIorbProps {
    initialState?: OrbState
    onConnect?: () => void
    onDisconnect?: () => void
    isConnected?: boolean
    isSpeaking?: boolean
    isConnecting?: boolean
    isMuted?: boolean
    onToggleMute?: () => void
    hasTaskNodes?: boolean
    className?: string
}

export default function AIOrb({
    initialState = 'dormant',
    onConnect,
    onDisconnect,
    isConnected = false,
    isSpeaking = false,
    isConnecting = false,
    isMuted = false,
    onToggleMute,
    hasTaskNodes = false,
    className = ''
}: AIorbProps) {
    const state: OrbState = isConnecting ? 'connecting' : isConnected ? (isSpeaking ? 'speaking' : 'speaking') : 'dormant'

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

    const containerClassName = `ai-orb-container  ${!hasTaskNodes ? 'centered' : ''}`

    return (
        <div className={containerClassName}>
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
                    if (e.key === 'm' || e.key === 'M') {
                        e.preventDefault()
                        onToggleMute?.()
                    }
                }}
                aria-label={`AI Assistant - Currently ${state}. Click to ${isConnected ? 'disconnect' : 'connect'}.`}
                title={`AI Assistant (${state})`}
            />
            {!isConnected && !isConnecting && (
                <div className="text-center whitespace-nowrap bg-transparent px-4 py-2 rounded-lg">
                    <div className="text-toolbar-foreground mb-1 font-bold">
                        Click to start
                    </div>
                    <div className="text-toolbar-foreground">
                        Tell me about your project
                    </div>
                </div>
            )}
            {isConnecting && (
                <div className="text-toolbar-foreground mb-1 font-bold">
                    Connecting...
                </div>
            )}
            {isConnected && (
                <button
                    onClick={onToggleMute}
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-background border-2 border-border hover:bg-accent hover:text-accent-foreground transition-all shadow-lg flex items-center justify-center"
                    title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                    aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                    {isMuted ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    )
}
