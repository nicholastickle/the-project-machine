import { useState, useEffect, useCallback } from 'react'
import { CHAT_SCRIPT, type ChatMessage } from '@/components/chat/chat-script'

interface UseChatScriptReturn {
  messages: ChatMessage[]
  currentStep: number
  isComplete: boolean
  isCentered: boolean
  sendInitialMessage: () => void
  confirmPlan: () => void
  canSend: boolean
  canConfirm: boolean
}

export function useChatScript(): UseChatScriptReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isCentered, setIsCentered] = useState(true)

  // Check if we can show Send button (step 0, no messages yet)
  const canSend = currentStep === 0 && messages.length === 0

  // Check if we can show Confirm button (all messages shown, last one needs confirmation)
  const canConfirm = 
    !isComplete && 
    currentStep === CHAT_SCRIPT.length && 
    messages.length === CHAT_SCRIPT.length &&
    (CHAT_SCRIPT[CHAT_SCRIPT.length - 1]?.needsConfirmation ?? false)

  // Send the initial pre-filled message
  const sendInitialMessage = useCallback(() => {
    if (currentStep !== 0) return

    // Add user's message immediately
    const userMessage = CHAT_SCRIPT[0]
    setMessages([userMessage])
    setCurrentStep(1)
  }, [currentStep])

  // Auto-play next message (handles both AI and user messages in sequence)
  useEffect(() => {
    if (currentStep === 0 || currentStep >= CHAT_SCRIPT.length) return

    const nextMessage = CHAT_SCRIPT[currentStep]
    const delay = nextMessage.delay || (nextMessage.role === 'user' ? 800 : 1000)
    
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, nextMessage])
      setCurrentStep(prev => prev + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [currentStep])

  // Confirm the plan and move chat to sidebar
  const confirmPlan = useCallback(() => {
    if (!canConfirm) return

    setIsComplete(true)
    setIsCentered(false)
  }, [canConfirm])

  return {
    messages,
    currentStep,
    isComplete,
    isCentered,
    sendInitialMessage,
    confirmPlan,
    canSend,
    canConfirm,
  }
}
