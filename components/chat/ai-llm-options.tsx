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

interface AILLMOptionsProps {
    // No props needed since we only have one option
}

export default function AILLMOptions({ }: AILLMOptionsProps) {
    const [open, setOpen] = useState(false)
    const selectedModel = 'GPT-4'

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-chat-panel-foreground hover:bg-chat-panel-accent hover:text-chat-panel-foreground"
                >
                    {selectedModel}
                    <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-20 bg-chat-panel-background border border-chat-panel-border">
                <DropdownMenuItem
                    className="text-xs cursor-default text-chat-panel-foreground hover:bg-chat-panel-accent hover:text-chat-panel-foreground focus:bg-chat-panel-accent focus:text-chat-panel-foreground"
                >
                    <div className="flex items-center justify-between w-full">
                        <span>GPT-4</span>
                        <Check className="h-3 w-3" />
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}