import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip } from 'lucide-react'
import AttachmentDisplay, { type AttachmentItem } from './attachment-display'
import AIOptions from './ai-options'
import AILLMOptions from './ai-llm-options'

interface ChatInputProps {
    inputValue: string
    isTyping: boolean
    onInputChange: (value: string) => void
    onSendMessage: () => void
    onKeyPress: (e: React.KeyboardEvent) => void
}

export interface ChatInputRef {
    focus: () => void
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
    inputValue,
    onInputChange,
    onSendMessage,
    onKeyPress
}, ref) => {
    const [attachments, setAttachments] = useState<AttachmentItem[]>([])
    const [aiMode, setAiMode] = useState<'ask' | 'agent'>('ask')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleAddAttachment = () => {
        const newAttachment: AttachmentItem = {
            id: `attachment-${Date.now()}`,
            name: `Document_${attachments.length + 1}.pdf`,
            type: 'document'
        }
        setAttachments(prev => [...prev, newAttachment])
    }

    const handleRemoveAttachment = (id: string) => {
        setAttachments(prev => prev.filter(item => item.id !== id))
    }

    const handleInputChange = (value: string) => {
        onInputChange(value)
        adjustTextareaHeight()
    }

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            const maxHeight = Math.floor(window.innerHeight / 3)
            const newHeight = Math.min(textarea.scrollHeight, maxHeight)
            textarea.style.height = `${newHeight}px`
        }
    }

    useEffect(() => {
        adjustTextareaHeight()
    }, [inputValue])

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (textareaRef.current) {
                textareaRef.current.focus()
                const length = textareaRef.current.value.length
                textareaRef.current.setSelectionRange(length, length)
            }
        }
    }), [])

    return (
        <div className="border-t border-chat-panel-border bg-chat-panel-background flex-shrink-0">
            <AttachmentDisplay
                attachments={attachments}
                onRemove={handleRemoveAttachment}
            />
            <div className="p-4">
                <div className="relative flex flex-col border border-chat-panel-border rounded-md">
                    <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={onKeyPress}
                        placeholder="What can I help you with today?"
                        className="min-h-[40px] w-full resize-none bg-chat-panel-background border-none text-chat-panel-foreground placeholder:text-muted overflow-y-auto"
                        style={{ height: '40px' }}
                    />
                    <div className="flex justify-between items-center gap-1 p-1">
                        <div className="flex gap-1">
                            <AIOptions mode={aiMode} onModeChange={setAiMode} />
                            <AILLMOptions />
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-chat-panel-foreground hover:bg-chat-panel-accent"
                                onClick={handleAddAttachment}
                            >
                                <Paperclip className="h-4 w-4 text-chat-panel-foreground" />
                            </Button>
                            <Button
                                onClick={onSendMessage}
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-chat-panel-foreground bg-transparent hover:bg-chat-panel-accent"
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-4 w-4 text-chat-panel-foreground" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput