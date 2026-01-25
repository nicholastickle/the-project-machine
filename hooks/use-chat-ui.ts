import { useState, useCallback, useEffect } from 'react'
import useChatsStore from '@/stores/chats-store'
import useProjectStore from '@/stores/project-store'
import type { AIChatMessage } from '@/stores/types'

export interface ChatMessage {
    id: string
    role: 'user' | 'ai'
    content: string
    timestamp: Date
}

interface UseChatUIReturn {
    messages: ChatMessage[]
    isVisible: boolean
    inputValue: string
    isTyping: boolean
    isNewChat: boolean
    currentChatTitle: string
    toggleVisibility: () => void
    setInputValue: (value: string) => void
    sendMessage: (content: string) => void
    clearMessages: () => void
    setIsNewChat: (isNew: boolean) => void
    startNewChatSession: () => void
}

const mapAIChatMessage = (msg: AIChatMessage): ChatMessage => ({
    id: msg.id,
    role: msg.role === 'assistant' ? 'ai' : 'user',
    content: msg.content,
    timestamp: new Date()
})

export function useChatUI(): UseChatUIReturn {
    const [isVisible, setIsVisible] = useState(true)
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isNewChat, setIsNewChat] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const getActiveProjectId = useCallback(() => {
        const activeProject = useProjectStore.getState().getActiveProject()
        return activeProject?.id || null
    }, [])
    const getStoredMessages = useCallback(() => {
        try {
            const storeMessages = useChatsStore.getState().getActiveMessages()
            return storeMessages.map(mapAIChatMessage)
        } catch {
            return []
        }
    }, [refreshTrigger])

    const messages = getStoredMessages()
    const getCurrentChatTitle = useCallback(() => {
        try {
            const activeThread = useChatsStore.getState().getActiveThread()
            return activeThread?.title || 'Chat'
        } catch {
            return 'Chat'
        }
    }, [refreshTrigger])

    const currentChatTitle = getCurrentChatTitle()
    useEffect(() => {
        const unsubscribe = useChatsStore.subscribe(() => {
            setRefreshTrigger(prev => prev + 1)
        })
        return unsubscribe
    }, [])

    const toggleVisibility = useCallback(() => {
        setIsVisible(prev => !prev)
    }, [])

    const sendMessage = useCallback((content: string) => {
        if (!content.trim()) return

        const activeProjectId = getActiveProjectId()

        if (activeProjectId) {
            const { getActiveThread, startNewChat, sendMessage: sendStoreMessage } = useChatsStore.getState()
            let activeThread = getActiveThread()
            let threadId = activeThread?.id
            if (!threadId || isNewChat) {
                const timestamp = new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
                threadId = startNewChat(activeProjectId, `New Chat ${timestamp}`)
                setIsNewChat(false)
            }

            sendStoreMessage(threadId, content.trim(), 'user')
            setInputValue('')

            setIsTyping(true)
            setTimeout(() => {
                const aiResponse = `I understand you're asking about "${content.trim()}". This is a placeholder response while we build out the AI integration. Real responses coming soon!`
                sendStoreMessage(threadId, aiResponse, 'assistant')
                setIsTyping(false)
            }, 1500)
        }
    }, [getActiveProjectId, isNewChat])

    const clearMessages = useCallback(() => {
        const activeProjectId = getActiveProjectId()

        if (activeProjectId) {
            const { clearChatsForProject } = useChatsStore.getState()
            clearChatsForProject(activeProjectId)
        }
    }, [getActiveProjectId])

    const startNewChatSession = useCallback(() => {
        setIsNewChat(true)
    }, [])

    return {
        messages,
        isVisible,
        inputValue,
        isTyping,
        isNewChat,
        currentChatTitle,
        toggleVisibility,
        setInputValue: setInputValue,
        sendMessage,
        clearMessages,
        setIsNewChat,
        startNewChatSession,
    }
}