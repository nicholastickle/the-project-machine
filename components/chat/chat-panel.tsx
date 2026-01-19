"use client"

import { useState, useEffect, useRef } from 'react'
import { useChatUI, type ChatMessage } from '@/hooks/use-chat-ui'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import UserMessage from './user-message'
import AIMessage from './ai-message'
import ChatInput from './chat-input'
import ChatWelcome from './chat-welcome'
import ChatHeader from './chat-header'
import RecentChats from './recent-chats'
interface ChatPanelProps {
  onVisibilityChange?: (isVisible: boolean, isDocked: boolean) => void
}

export default function ChatPanel({ onVisibilityChange }: ChatPanelProps) {
  const {
    messages,
    isVisible,
    inputValue,
    isTyping,
    toggleVisibility,
    setInputValue,
    sendMessage,
    clearMessages,
  } = useChatUI()

  // Notify parent when visibility changes (always docked now)
  useEffect(() => {
    onVisibilityChange?.(isVisible, true) // Always considered docked
  }, [isVisible, onVisibilityChange])

  // PRESERVED: Typewriter effect state for future AI messages
  // TODO: This will be used when real AI responses are integrated
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([])
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // PRESERVED: Typewriter effect for AI messages (for future use)
  // TODO: Re-enable this when real AI responses are implemented
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
        // AI message: start with empty content for typewriter effect
        setDisplayedMessages(messages.slice(0, -1).concat({ ...lastMessage, content: '' }))
      }
      setCurrentTypingIndex(0)
      setIsUserScrolling(false)
    }
  }, [messages])

  // PRESERVED: Typewriter animation for AI messages (for future use)
  // TODO: Re-enable this when real AI responses are implemented
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
      }, 30) // 30ms delay per character

      return () => clearTimeout(timer)
    }
  }, [displayedMessages, messages]) // Added displayedMessages dependency

  // Handle sending message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
    }
  }

  // Handle Enter key for sending
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle scroll behavior
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsUserScrolling(!isNearBottom)
    }
  }

  // Auto-scroll to bottom when new messages arrive (unless user is scrolling)
  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [displayedMessages, isUserScrolling])

  // Show toggle button when chat is hidden
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

  // Render as docked Sheet on the right side
  return (
    <Sheet open={isVisible} onOpenChange={toggleVisibility} modal={false}>
      <SheetContent
        side="right"
        className="w-[350px] p-0 flex flex-col border border-chat-panel-border bg-chat-panel-background gap-0"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b border-chat-panel-border bg-chat-panel-background px-3 py-2">
          <SheetTitle className="flex items-center justify-center text-sm font-medium">
            Chat
          </SheetTitle>
        </SheetHeader>

        <ChatHeader
          displayedMessages={displayedMessages}
          onClearMessages={clearMessages}
        />

        {/* Recent Chats - only show when no messages */}
        {displayedMessages.length === 0 && (
          <RecentChats
            onChatSelect={(chatId) => {
              // TODO: Load selected chat
              console.log('Loading chat:', chatId)
            }}
            onArchiveChat={(chatId) => {
              // TODO: Archive selected chat
              console.log('Archiving chat:', chatId)
            }}
          />
        )}

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className={`p-3 space-y-3 flex-1 ${displayedMessages.length > 0
            ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
            : ''
            }`}
          style={displayedMessages.length > 0 ? {
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--chat-panel-accent)) transparent'
          } : {}}
        >
          {/* Welcome screen when no messages */}
          {displayedMessages.length === 0 && (
            <ChatWelcome onSendMessage={sendMessage} inputValue={inputValue} />
          )}

          {displayedMessages.map((msg) => (
            msg.role === 'user' ? (
              <UserMessage key={msg.id} message={msg} />
            ) : (
              <AIMessage key={msg.id} message={msg} />
            )
          ))}

          {/* Typing indicator when AI is responding */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg p-3 bg-chat-panel-background text-chat-panel-foreground text-sm border border-chat-panel-border">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          inputValue={inputValue}
          isTyping={isTyping}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
        />
      </SheetContent>
    </Sheet>
  )
}