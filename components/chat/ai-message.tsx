import { type ChatMessage } from '@/hooks/use-chat-ui'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface AIMessageProps {
    message: ChatMessage
}

export default function AIMessage({ message }: AIMessageProps) {
    return (
        <div className="flex justify-start">
            <div className="flex flex-col w-full">
                <div className="w-full rounded-lg p-2 text-sm bg-chat-panel-background text-chat-panel-foreground">
                    <div className="whitespace-pre-wrap break-words" style={{
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        minHeight: '1.2em' // Ensure minimum height to prevent layout shift
                    }}>
                        {message.content}
                    </div>
                </div>

                {/* Feedback icons - outside the speech bubble */}
                <div className="flex items-center ml-2">
                    <button
                        className="p-1 rounded hover:bg-chat-panel-accent transition-colors"
                        onClick={() => {
                            // TODO: Implement feedback functionality
                            console.log('Thumbs up feedback for message:', message.id)
                        }}
                    >
                        <ThumbsUp className="h-3 w-3 text-muted-foreground hover:text-chat-panel-foreground" />
                    </button>
                    <button
                        className="p-1 rounded hover:bg-chat-panel-accent transition-colors"
                        onClick={() => {
                            // TODO: Implement feedback functionality  
                            console.log('Thumbs down feedback for message:', message.id)
                        }}
                    >
                        <ThumbsDown className="h-3 w-3 text-muted-foreground hover:text-chat-panel-foreground" />
                    </button>
                </div>
            </div>
        </div>
    )
}