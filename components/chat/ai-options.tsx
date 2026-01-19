"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type AIMode = 'ask' | 'agent'

interface AIOptionsProps {
    mode: AIMode
    onModeChange: (mode: AIMode) => void
}

export default function AIOptions({ mode, onModeChange }: AIOptionsProps) {
    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-chat-panel-foreground hover:bg-chat-panel-accent hover:text-chat-panel-foreground"
                >
                    {mode === 'ask' ? 'Ask' : 'Agent'}
                    <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24 bg-chat-panel-background border border-chat-panel-border">
                <DropdownMenuItem
                    onClick={() => onModeChange('ask')}
                    className="text-xs cursor-pointer text-chat-panel-foreground hover:bg-chat-panel-accent hover:text-chat-panel-foreground focus:bg-chat-panel-accent focus:text-chat-panel-foreground"
                >
                    <div className="flex items-center justify-between w-full">
                        <span>Ask</span>
                        {mode === 'ask' && <Check className="h-3 w-3" />}
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled
                    className={cn(
                        "text-xs cursor-not-allowed",
                        "text-muted-foreground opacity-50"
                    )}
                >
                    <div className="flex items-center justify-between w-full">
                        <span>Agent</span>
                        {mode === 'agent' && <Check className="h-3 w-3" />}
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}