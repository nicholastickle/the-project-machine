"use client"

import { Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RecentChat {
    id: string
    title: string
    lastUsed: Date
}

// Dummy data for recent chats
const DUMMY_RECENT_CHATS: RecentChat[] = [
    {
        id: '1',
        title: 'Project planning discussion',
        lastUsed: new Date('2026-01-19T10:30:00')
    },
    {
        id: '2',
        title: 'API implementation help',
        lastUsed: new Date('2026-01-18T15:45:00')
    },
    {
        id: '3',
        title: 'Component design review',
        lastUsed: new Date('2026-01-17T09:20:00')
    }
]

interface RecentChatsProps {
    onChatSelect?: (chatId: string) => void
    onArchiveChat?: (chatId: string) => void
}

export default function RecentChats({ onChatSelect, onArchiveChat }: RecentChatsProps) {
    const formatDate = (date: Date) => {
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        } else if (diffInHours < 48) {
            return 'Yesterday'
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        }
    }

    return (
        <div className="border-b border-chat-panel-border">
            <div className="p-3 space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Recent Chats
                </h3>

                {DUMMY_RECENT_CHATS.map((chat) => (
                    <div key={chat.id} className="group">
                        <div
                            className="flex items-start justify-between gap-2 cursor-pointer hover:bg-chat-panel-accent rounded p-1"
                            onClick={() => onChatSelect?.(chat.id)}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground mt-1">•</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-foreground truncate">
                                        {chat.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {formatDate(chat.lastUsed)}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-chat-panel-accent"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onArchiveChat?.(chat.id)
                                }}
                            >
                                <Archive className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}