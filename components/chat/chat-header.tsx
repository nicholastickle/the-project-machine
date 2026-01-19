import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { type ChatMessage } from '@/hooks/use-chat-ui'

interface ChatHeaderProps {
    displayedMessages: ChatMessage[]
    onClearMessages: () => void
    onBack?: () => void
    showBackButton?: boolean
    currentChatTitle?: string
}

export default function ChatHeader({ onBack, showBackButton = false, currentChatTitle = 'Chat' }: ChatHeaderProps) {

    if (!showBackButton) return null

    return (
        <div className="flex items-center px-3 py-1 border-b border-chat-panel-border bg-chat-panel-background">
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-chat-panel-accent text-chat-panel-foreground hover:text-chat-panel-foreground"
                onClick={onBack}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-chat-panel-foreground w-full truncate text-center">
                {currentChatTitle}
            </span>
        </div>
    )
}