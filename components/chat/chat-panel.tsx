"use client"

import { useState, useEffect, useRef } from 'react'
import { useChatUI } from '@/hooks/use-chat-ui'
import useChatsStore from '@/stores/chats-store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { MessageSquare } from 'lucide-react'
import UserMessage from './user-message'
import AIMessage from './ai-message'
import ChatInput, { type ChatInputRef } from './chat-input'
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
    isNewChat,
    currentChatTitle,
    toggleVisibility,
    setInputValue,
    sendMessage,
    clearMessages,
    setIsNewChat,
    startNewChatSession,
  } = useChatUI()


  useEffect(() => {
    onVisibilityChange?.(isVisible, true)
  }, [isVisible, onVisibilityChange])

  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<ChatInputRef>(null)

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue)
      // Focus the input after sending message to keep cursor active
      // Try immediate focus
      chatInputRef.current?.focus()
      // Also try with requestAnimationFrame as backup
      requestAnimationFrame(() => {
        chatInputRef.current?.focus()
      })
    }
  }


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsUserScrolling(!isNearBottom)
    }
  }


  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isUserScrolling])

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
          displayedMessages={messages}
          onClearMessages={clearMessages}
          onBack={startNewChatSession}
          showBackButton={!isNewChat}
          currentChatTitle={currentChatTitle}
        />


        {isNewChat && (
          <RecentChats
            maxChats={3}
            onChatSelect={(chatId) => {

              const { openChat } = useChatsStore.getState()
              openChat(chatId)
              setIsNewChat(false)
            }}
            onArchiveChat={(chatId) => {
              const { deleteChat } = useChatsStore.getState()
              deleteChat(chatId)
            }}
          />
        )}

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className={`p-3 space-y-3 flex-1 ${!isNewChat && messages.length > 0
            ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
            : ''
            }`}
          style={!isNewChat && messages.length > 0 ? {
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--chat-panel-accent)) transparent'
          } : {}}
        >

          {isNewChat && (
            <ChatWelcome
              onSendMessage={(content) => {
                sendMessage(content)
              }}
              inputValue={inputValue}
            />
          )}

          {!isNewChat && messages.map((msg) => (
            msg.role === 'user' ? (
              <UserMessage key={msg.id} message={msg} />
            ) : (
              <AIMessage key={msg.id} message={msg} />
            )
          ))}

          {!isNewChat && isTyping && (
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
          ref={chatInputRef}
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