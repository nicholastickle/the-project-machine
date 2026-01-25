"use client"

import { Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useChatsStore from '@/stores/chats-store'
import useProjectStore from '@/stores/project-store'

interface RecentChatsProps {
    maxChats?: number
    onChatSelect?: (chatId: string) => void
    onArchiveChat?: (chatId: string) => void
}

export default function RecentChats({ maxChats = 10, onChatSelect, onArchiveChat }: RecentChatsProps) {
    const { getActiveProject } = useProjectStore()
    const { getChatsForProject, deleteChat, openChat } = useChatsStore()

    const activeProject = getActiveProject()
    const recentChats = activeProject
        ? getChatsForProject(activeProject.project.id)
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, maxChats)
        : []

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
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

    const handleChatSelect = (chatId: string) => {
        openChat(chatId)
        onChatSelect?.(chatId)
    }

    const handleArchiveChat = (chatId: string) => {
        deleteChat(chatId)
        onArchiveChat?.(chatId)
    }

    if (!activeProject) {
        return (
            <div className="border-b border-chat-panel-border">
                <div className="p-3 space-y-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Recent Chats
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Please select a project to view chats.
                    </p>
                </div>
            </div>
        )
    }

    if (recentChats.length === 0) {
        return (
            <div className="border-b border-chat-panel-border">
                <div className="p-3 space-y-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Recent Chats
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        No recent chats. Start a conversation!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="border-b border-chat-panel-border">
            <div className="p-3 space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Recent Chats
                </h3>

                {recentChats.map((chat) => (
                    <div key={chat.id} className="group">
                        <div
                            className="flex items-start justify-between gap-2 cursor-pointer hover:bg-chat-panel-accent rounded p-1"
                            onClick={() => handleChatSelect(chat.id)}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-muted-foreground mt-1">•</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-foreground truncate">
                                        {chat.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {formatDate(chat.updated_at)}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-chat-panel-accent"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleArchiveChat(chat.id)
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