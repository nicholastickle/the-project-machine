import { useState, useCallback } from 'react'

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
  toggleVisibility: () => void
  setInputValue: (value: string) => void
  sendMessage: (content: string) => void
  clearMessages: () => void
}

export function useChatUI(): UseChatUIReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isVisible, setIsVisible] = useState(true) // Default open
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Toggle chat visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  // Send a user message (for now, just adds to local state)
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // TODO: Future AI integration will go here
    // For now, just simulate AI typing response
    setIsTyping(true)
    
    // Placeholder AI response (remove when real AI is integrated)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: 'I understand you need help with that. Real AI responses will be implemented soon!',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
  }, [])

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isVisible,
    inputValue,
    isTyping,
    toggleVisibility,
    setInputValue,
    sendMessage,
    clearMessages,
  }
}