"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { ChevronRight, FolderKanban, ListTodo, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

type SidebarContextType = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider')
    }
    return context
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = useIsMobile()

    // Keyboard shortcut: Ctrl+B to toggle sidebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const contextValue = { isOpen, setIsOpen, isMobile }

    return (
        <SidebarContext.Provider value={contextValue}>
            {children}
        </SidebarContext.Provider>
    )
}

export default function CanvasSidebar() {
    const { isOpen, setIsOpen } = useSidebar()

    return (
        <>
            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed top-1/2 -translate-y-1/2 z-50 h-12 w-8 rounded-r-lg rounded-l-none p-0 transition-all",
                    "bg-sidebar-background border border-sidebar-border border-l-0",
                    "hover:bg-sidebar-accent",
                    isOpen ? "left-64" : "left-0"
                )}
            >
                <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                )} />
            </Button>

            {/* Sidebar Panel */}
            <div className={cn(
                "fixed left-0 top-0 h-full w-64 bg-sidebar-background border-r border-sidebar-border z-40 transition-transform",
                "flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-sidebar-border">
                    <h2 className="text-lg font-semibold text-sidebar-foreground">Project Machine</h2>
                    <p className="text-xs text-sidebar-foreground/60 mt-1">Ctrl+B to toggle</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                        <FolderKanban className="h-5 w-5" />
                        <span>Projects</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                        <ListTodo className="h-5 w-5" />
                        <span>Tasks</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                        <HelpCircle className="h-5 w-5" />
                        <span>Help</span>
                    </button>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-sidebar-border">
                    <p className="text-xs text-sidebar-foreground/60">
                        Voice-first project planning
                    </p>
                </div>
            </div>
        </>
    )
}
