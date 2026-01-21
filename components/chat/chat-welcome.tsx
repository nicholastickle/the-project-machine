import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatWelcomeProps {
    onSendMessage: (message: string) => void
    inputValue?: string
}

export default function ChatWelcome({ onSendMessage, inputValue = '' }: ChatWelcomeProps) {
    const suggestions = [
        "Doing a beginning of day planning session",
        "Doing an end of day planning session",
        "Planning out new work",
        "Get an overall summary of where the project is at"
    ]

    const handleSuggestionClick = (suggestion: string) => {
        onSendMessage(suggestion)
    }

    return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="mb-2">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            </div>

            <div className="mb-2">
                <p className="text-muted-foreground text-sm">
                    Ask about your project or Build with your agent
                </p>
            </div>

            <div className="mb-4">
                <p className="text-muted-foreground text-xs">
                    AI responses may be inaccurate
                </p>
            </div>

            {!inputValue.trim() && (
                <>
                    <div className="mb-3 w-full max-w-[280px]">
                        <p className="text-muted-foreground text-sm text-left">
                            Try:
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full max-w-[280px]">
                        {suggestions.map((suggestion, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="text-xs p-3 h-auto text-left text-muted-foreground justify-start whitespace-normal border-chat-panel-border bg-chat-panel-background hover:bg-chat-panel-background hover:text-chat-panel-foreground outline-none focus:ring-none"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}