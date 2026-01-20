import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AttachmentItem {
    id: string
    name: string
    type: 'file' | 'image' | 'document'
}

interface AttachmentDisplayProps {
    attachments: AttachmentItem[]
    onRemove: (id: string) => void
}

export default function AttachmentDisplay({ attachments, onRemove }: AttachmentDisplayProps) {
    if (attachments.length === 0) return null

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-chat-panel-accent/20 border-b border-chat-panel-border">
            {attachments.map((attachment) => (
                <div
                    key={attachment.id}
                    className="flex items-center gap-1 px-2 py-1 bg-chat-panel-background rounded border border-chat-panel-border text-xs"
                >
                    <span className="text-chat-panel-foreground truncate max-w-[80px]">
                        {attachment.name}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-destructive/20"
                        onClick={() => onRemove(attachment.id)}
                    >
                        <X className="h-2 w-2" />
                    </Button>
                </div>
            ))}
        </div>
    )
}