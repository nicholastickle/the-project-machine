import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Paperclip } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { type ChatMessage } from '@/hooks/use-chat-ui'
import useStore from '@/stores/flow-store'

interface ChatHeaderProps {
    displayedMessages: ChatMessage[]
    onClearMessages: () => void
    onBack?: () => void
    showBackButton?: boolean
    currentChatTitle?: string
    fileRefreshTrigger?: number
}

interface ProjectFile {
    id: string
    filename: string
    summary: string | null
}

export default function ChatHeader({ onBack, showBackButton = false, currentChatTitle = 'Chat', fileRefreshTrigger = 0 }: ChatHeaderProps) {
    const projectId = useStore((state) => state.projectId)
    const [files, setFiles] = useState<ProjectFile[]>([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (projectId && isOpen) {
            fetch(`/api/projects/${projectId}/files`)
                .then(res => res.json())
                .then(data => {
                    // Only show confirmed files (user-reviewed summaries)
                    const confirmedFiles = data.files?.filter((f: any) => f.confirmed_at) || []
                    setFiles(confirmedFiles)
                })
                .catch(err => console.error('Failed to load files:', err))
        }
    }, [projectId, isOpen, fileRefreshTrigger])

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
            <span className="text-sm text-chat-panel-foreground flex-1 truncate text-center">
                {currentChatTitle}
            </span>
            {projectId && files.length > 0 && (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-chat-panel-accent text-chat-panel-foreground"
                        >
                            <Paperclip className="h-3 w-3 mr-1" />
                            {files.length}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Context Files Available:</p>
                            {files.map((file) => (
                                <div key={file.id} className="p-2 rounded bg-muted text-xs">
                                    <p className="font-medium">{file.filename}</p>
                                    {file.summary && (
                                        <p className="text-muted-foreground mt-1 line-clamp-2">{file.summary}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}