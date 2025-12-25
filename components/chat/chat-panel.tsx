"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Send, Paperclip, MessageSquare } from 'lucide-react'
import useStore from '@/stores/flow-store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

interface ChatPanelProps {
  projectId?: string
  onVisibilityChange?: (isVisible: boolean) => void
}


export default function ChatPanel({ projectId, onVisibilityChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey! What are you planning today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [showCommandConfirm, setShowCommandConfirm] = useState(false)
  const [pendingCommand, setPendingCommand] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onVisibilityChange?.(isVisible)
  }, [isVisible, onVisibilityChange])

  // Parse AI response for commands
  const parseCommand = (response: string): any | null => {
    const commandMatch = response.match(/\[COMMAND:([\s\S]*?)\]/)
    if (!commandMatch) return null

    try {
      return JSON.parse(commandMatch[1])
    } catch {
      return null
    }
  }

  // Execute confirmed command
  const executeCommand = (command: any) => {
    const { addTaskNode, updateNodeData, deleteNode, nodes } = useStore.getState()

    switch (command.action) {
      case 'addTask':
        addTaskNode({
          title: command.title,
          status: command.status || 'Not started',
          description: command.description || '',
          subtasks: command.subtasks || [],
          position: command.position
        })
        break

      case 'updateTask':
        const nodeToUpdate = nodes.find(n => 
          typeof n.data.title === 'string' && 
          n.data.title.toLowerCase().includes(command.taskName?.toLowerCase())
        )
        if (nodeToUpdate) {
          updateNodeData(nodeToUpdate.id, command.updates)
        }
        break

      case 'deleteTask':
        const nodeToDelete = nodes.find(n => 
          typeof n.data.title === 'string' &&
          n.data.title.toLowerCase().includes(command.taskName?.toLowerCase())
        )
        if (nodeToDelete) {
          deleteNode(nodeToDelete.id)
        }
        break
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get current canvas state
      const { nodes, edges } = useStore.getState()
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          message: userMessage.content,
          history: messages,
          currentSnapshot: { nodes, edges }
        })
      })

      const data = await response.json()

      // Check if API returned an error
      if (!response.ok || data.error) {
        console.error('[Chat] API error:', data)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.error === 'OpenAI API key not configured' 
            ? 'The AI service is not configured yet. Please add your OpenAI API key.'
            : `Error: ${data.error || 'Unknown error'}${data.details ? ' - ' + data.details : ''}`
        }
        setMessages(prev => [...prev, errorMessage])
        return
      }

      // Check for embedded commands
      const command = parseCommand(data.response)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response?.replace(/\[COMMAND:[\s\S]*?\]/, '').trim() || 'Sorry, I encountered an error.',
        sources: data.sources
      }

      setMessages(prev => [...prev, aiMessage])

      // Show confirmation dialog for commands
      if (command) {
        setPendingCommand(command)
        setShowCommandConfirm(true)
      }
    } catch (error) {
      console.error('[Chat] Network error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
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

  // Docked chat panel on right side
  return (
    <Sheet open={isVisible} onOpenChange={toggleVisibility} modal={false}>
      <SheetContent
        side="right"
        className="w-[350px] p-0 flex flex-col border border-chat-panel-border bg-chat-panel-background"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader className="bg-chat-panel-background px-3 py-2 border-b border-chat-panel-border">
          <SheetTitle className="flex items-center justify-center text-sm font-medium">
            AI Assistant
          </SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="overflow-y-auto p-3 space-y-3 flex-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--chat-panel-accent)) transparent'
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-lg p-2.5 text-sm
                  ${msg.role === 'user'
                    ? 'bg-chat-panel-accent text-chat-panel-foreground border border-chat-panel-border'
                    : 'bg-chat-panel-background text-chat-panel-foreground'
                  }
                `}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-chat-panel-border text-xs opacity-70">
                    Sources: {msg.sources.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-chat-panel-background text-chat-panel-foreground rounded-lg p-2.5 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Command Confirmation Dialog */}
        <Dialog open={showCommandConfirm} onOpenChange={setShowCommandConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                The AI wants to modify your canvas:
              </DialogDescription>
            </DialogHeader>
            
            {pendingCommand && (
              <div className="p-3 rounded-lg bg-muted text-sm">
                <strong>{pendingCommand.action}:</strong>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(pendingCommand, null, 2)}
                </pre>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCommandConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (pendingCommand) executeCommand(pendingCommand)
                setShowCommandConfirm(false)
                setPendingCommand(null)
              }}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Input Area */}
        <div className="p-3 border-t border-chat-panel-border bg-chat-panel-background flex-shrink-0">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your plan..."
              disabled={isLoading}
              className="flex-1 min-h-[60px] max-h-[120px] resize-none text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
