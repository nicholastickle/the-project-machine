import {
    BookOpen,
    MessageSquare,

} from "lucide-react"

import Link from "next/link"

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

export default function SidebarHelpOptions({ children }: OptionsHelpProps) {
    const { isMobile } = useSidebar()

    const handleUserManual = () => {
        console.log("User Manual clicked")
    }

    return (
        <DropdownMenu modal={false}>
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

                    <Link href="https://alkaline-apple-00d.notion.site/Project-Machine-User-Manual-121aa4c8ef4d4fac8976882a65642716" target="_blank" rel="noopener noreferrer">User Manual</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <MessageSquare className="text-muted-foreground" />
                    <Link href="https://www.featurebase.app/" target="_blank" rel="noopener noreferrer">Give feedback</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem className="focus:bg-sidebar-accent focus:text-foreground text-xs">
                    <Link href="https://alkaline-apple-00d.notion.site/Legal-Summary-2e9227fa135b800d8c29ff19c850f961" target="_blank" rel="noopener noreferrer">Legal Summary</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}