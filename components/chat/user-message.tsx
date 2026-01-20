import { type ChatMessage } from '@/hooks/use-chat-ui'

interface UserMessageProps {
    message: ChatMessage
}

export default function UserMessage({ message }: UserMessageProps) {
    return (
        <div className="flex justify-end animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="max-w-[85%] rounded-lg p-3 text-sm bg-chat-panel-accent text-chat-panel-foreground border border-chat-panel-border">
                <div className="whitespace-pre-wrap break-words hyphens-auto" style={{ wordBreak: 'break-word', hyphens: 'auto' }}>
                    {message.content}
                </div>
            </div>
        </div>
    )
}