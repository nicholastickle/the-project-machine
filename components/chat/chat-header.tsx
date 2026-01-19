import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { type ChatMessage } from '@/hooks/use-chat-ui'

interface ChatHeaderProps {
    displayedMessages: ChatMessage[]
    onClearMessages: () => void
}

export default function ChatHeader({ displayedMessages, onClearMessages }: ChatHeaderProps) {
    // Only show when there are messages
    if (displayedMessages.length === 0) return null

    return (
        <div className="flex items-center px-3 py-1 border-b border-chat-panel-border bg-chat-panel-background">
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-chat-panel-accent text-chat-panel-foreground hover:text-chat-panel-foreground"
                onClick={onClearMessages}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-chat-panel-foreground w-full truncate text-center">
                ***Heading of current chat***
            </span>
        </div>
    )
}