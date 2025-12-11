"use client"

import { useState, useEffect, useRef } from 'react'
import { useChatScript } from '@/hooks/use-chat-script'
import { INITIAL_MESSAGE } from '@/components/chat/chat-script'
import { Button } from '@/components/ui/button'
import { Send, Check } from 'lucide-react'

interface ChatPanelProps {
  onConfirm?: () => void
}

export default function ChatPanel({ onConfirm }: ChatPanelProps) {
  const {
    messages,
    isCentered,
    sendInitialMessage,
    confirmPlan,
    canSend,
    canConfirm,
  } = useChatScript()

  // Typewriter effect state for the last AI message
  const [displayedMessages, setDisplayedMessages] = useState<typeof messages>([])
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Handle typewriter effect for AI messages only
  useEffect(() => {
    if (messages.length === 0) {
      setDisplayedMessages([])
      return
    }

    const lastMessage = messages[messages.length - 1]
    const lastDisplayed = displayedMessages[displayedMessages.length - 1]

    // Add any new message (user or AI)
    if (lastMessage.id !== lastDisplayed?.id) {
      // User messages appear instantly, AI messages start typewriter
      if (lastMessage.role === 'user') {
        setDisplayedMessages(messages)
      } else {
        // AI message: start with empty content
        setDisplayedMessages(messages.slice(0, -1).concat({ ...lastMessage, content: '' }))
      }
      setCurrentTypingIndex(0)
      setIsUserScrolling(false) // Reset scroll lock when new message arrives
    }
  }, [messages])

  // Typewriter animation for AI messages only
  useEffect(() => {
    if (displayedMessages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    const lastDisplayed = displayedMessages[displayedMessages.length - 1]

    if (!lastMessage || !lastDisplayed) return
    if (lastMessage.role === 'user') return // Only typewrite AI messages
    if (lastDisplayed.content === lastMessage.content) return

    const fullContent = lastMessage.content
    const currentLength = lastDisplayed.content.length

    if (currentLength < fullContent.length) {
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...lastDisplayed,
            content: fullContent.slice(0, currentLength + 1)
          }
          return updated
        })
        setCurrentTypingIndex(currentLength + 1)
      }, 30) // Slowed down from 20ms to 30ms per character

      return () => clearTimeout(timer)
    }
  }, [displayedMessages, messages, currentTypingIndex])

  // Auto-scroll to bottom only if user isn't manually scrolling
  useEffect(() => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [displayedMessages, isUserScrolling])

  // Detect user scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
    
    // If user scrolls up, disable auto-scroll
    if (!isAtBottom) {
      setIsUserScrolling(true)
    } else {
      setIsUserScrolling(false)
    }
  }

  const handleConfirm = () => {
    confirmPlan()
    onConfirm?.()
  }

  return (
    <div
      className={`
        fixed z-50 transition-all duration-500 ease-in-out
        ${isCentered 
          ? 'bottom-12 left-1/2 -translate-x-1/2 w-[600px]' 
          : 'top-0 right-0 h-screen w-[400px] border-l border-border'
        }
      `}
    >
      <div className={`
        bg-background/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden
        ${isCentered ? 'border border-border' : 'h-full rounded-none border-none'}
      `}>
        {/* Header */}
        <div className="bg-accent/50 px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
        </div>

        {/* Messages - with visible scrollbar */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className={`
            overflow-y-scroll p-4 space-y-4
            ${isCentered ? 'max-h-[500px]' : 'h-[calc(100vh-180px)]'}
            scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent
          `}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--border)) transparent'
          }}
        >
          {displayedMessages.length === 0 ? (
            // Initial state: show pre-filled message
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center mb-4">
                Start by telling me about your project
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{INITIAL_MESSAGE}</p>
              </div>
            </div>
          ) : (
            // Show conversation messages
            displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={`
                  flex
                  ${msg.role === 'user' ? 'justify-end' : 'justify-start'}
                  ${msg.role === 'user' ? 'animate-in fade-in slide-in-from-right-4 duration-700' : ''}
                `}
              >
                <div
                  className={`
                    max-w-[85%] rounded-lg p-3 text-sm
                    ${msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-accent border border-border'
                    }
                    ${msg.hasRisk ? 'ring-2 ring-orange-500/50' : ''}
                  `}
                >
                  <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                    {msg.content.split('\n').map((line, i) => {
                      // Bold text: **text**
                      const boldPattern = /\*\*(.+?)\*\*/g
                      const parts = line.split(boldPattern)
                      
                      return (
                        <p key={i} className={i > 0 ? 'mt-1' : ''}>
                          {parts.map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer with action buttons */}
        <div className="p-4 border-t border-border bg-background">
          {canSend && (
            <Button
              onClick={sendInitialMessage}
              className="w-full gap-2"
              size="lg"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          )}
          
          {canConfirm && (
            <Button
              onClick={handleConfirm}
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Check className="w-4 h-4" />
              Confirm & Add to Canvas
            </Button>
          )}

          {!canSend && !canConfirm && (
            <div className="text-xs text-muted-foreground text-center py-2">
              {isCentered 
                ? 'AI is thinking...' 
                : 'Tasks added to canvas. You can continue editing.'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
