"use client"

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

        {/* Messages */}
        <div className={`
          overflow-y-auto p-4 space-y-4
          ${isCentered ? 'max-h-[500px]' : 'h-[calc(100vh-180px)]'}
        `}>
          {messages.length === 0 ? (
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
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`
                  flex
                  ${msg.role === 'user' ? 'justify-end' : 'justify-start'}
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
                      // Bold text: **text** or text in CAPS with :
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
