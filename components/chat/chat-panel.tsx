"use client"

import { useState, useEffect, useRef } from 'react'
import { useChatScript } from '@/hooks/use-chat-script'
import { INITIAL_MESSAGE } from '@/components/chat/chat-script'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Send, Check, Paperclip, X, MessageSquare } from 'lucide-react'

interface ChatPanelProps {
  onConfirm?: () => void
  onVisibilityChange?: (isVisible: boolean) => void
}

export default function ChatPanel({ onConfirm, onVisibilityChange }: ChatPanelProps) {
  const {
    messages,
    isCentered,
    isVisible,
    sendInitialMessage,
    confirmPlan,
    toggleVisibility,
    canSend,
    canConfirm,
  } = useChatScript()

  // Notify parent when visibility changes
  useEffect(() => {
    onVisibilityChange?.(isVisible)
  }, [isVisible, onVisibilityChange])

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

  // Floating toggle button when chat is hidden
  if (!isVisible) {
    return (
      <Button
        onClick={toggleVisibility}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  // When centered, render as floating card
  if (isCentered) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[500px] z-10 bg-chat-panel-background rounded-full border border-chat-panel-border flex flex-col">

        {/* Input Area */}

        {canSend && (
          <div className="flex items-start items-center">
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className=" p-3 ml-3 hover:bg-chat-panel-accent rounded-full"
                onClick={() => {
                  alert('Soon you\'ll be able to attach additional context like:\n\n• Old project plans from Excel\n• Reference documents\n• Previous estimates\n• Client requirements\n\nThis will help me create a more accurate plan tailored to your needs!')
                }}
              >
                <Paperclip className="h-8 w-8 text-chat-panel-foreground" />
              </Button>
            </div>
            <Textarea
              value={INITIAL_MESSAGE}
              readOnly
              className="flex-1 min-h-[80px] bg-chat-panel-background border-none cursor-not-allowed resize-none"
            />
            <div className="">
              <Button
                onClick={sendInitialMessage}
                size="icon"
                className="rounded-full bg-orange-600 hover:bg-orange-700 animate-pulse mr-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
          <div className="flex items-start gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 mt-1"
              disabled
            >
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Textarea
              placeholder="Conversation in progress..."
              disabled
              className="flex-1 min-h-[80px] resize-none"
            />
            <Button
              size="icon"
              className="flex-shrink-0 mt-1"
              disabled
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>


    )
  }

  // When docked, render as shadcn Sheet on the right side
  return (
    <Sheet open={isVisible} onOpenChange={toggleVisibility} modal={false}>
      <SheetContent
        side="right"
        className="w-[350px] p-0 flex flex-col border border-chat-panel-border bg-chat-panel-background"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader className="bg-chat-panel-background px-3 py-2">
          <SheetTitle className="flex items-center justify-center text-sm font-medium">
            Chat
          </SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="overflow-y-scroll p-2 space-y-2 flex-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--chat-panel-accent)) transparent'
          }}
        >
          {displayedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`
                flex
                ${msg.role === 'user' ? 'justify-end' : 'justify-start'}
                ${msg.role === 'user' ? 'animate-in fade-in slide-in-from-right-4 duration-[1500ms]' : ''}
              `}
            >
              <div
                className={`
                  max-w-[90%] rounded-lg p-2  text-chat-panel-foreground
                  ${msg.role === 'user'
                    ? 'bg-chat-panel-accent text-sm border border-chat-panel-border'
                    : 'bg-chat-panel-background text-xs leading-5'
                  }
                  
                `}
              >
                <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                  {msg.content.split('\n').map((line, i) => {
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
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background flex-shrink-0">
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

          {!canConfirm && (
            <div className="flex items-start gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 mt-1"
                disabled
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Textarea
                placeholder="Conversation in progress..."
                disabled
                className="flex-1 min-h-[80px] resize-none"
              />
              <Button
                size="icon"
                className="flex-shrink-0 mt-1"
                disabled
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
