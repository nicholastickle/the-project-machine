"use client"

import {
    BookOpen,
    MessageSquare,

} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    useSidebar,
} from "@/components/ui/sidebar"

interface OptionsHelpProps {
    children: React.ReactNode
}

export function OptionsHelp({ children }: OptionsHelpProps) {
    const { isMobile } = useSidebar()

    const handleUserManual = () => {
        console.log("User Manual clicked")
    }

    const handleFeedback = () => {
        console.log("Feedback clicked")
    }

    const handleLegalSummary = () => {
        console.log("Legal Summary clicked")
    }

    const handleManageCookies = () => {
        console.log("Manage Cookies clicked")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={`w-48 rounded-lg bg-sidebar-options-background shadow-md border border-sidebar-border  ${!isMobile ? 'translate-x-2.5 -translate-y-4' : ''} text-foreground`}
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
            >
                <DropdownMenuItem onClick={handleUserManual} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <BookOpen className="text-muted-foreground" />
                    <span>User Manual</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFeedback} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <MessageSquare className="text-muted-foreground" />
                    <span>Feedback</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem onClick={handleLegalSummary} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <span>Legal Summary</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleManageCookies} className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <span>Manage Cookies</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}