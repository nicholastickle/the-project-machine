import { Check } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    useSidebar,
} from "@/components/ui/sidebar"

interface ThemeChangerProps {
    children: React.ReactNode
}

export default function SidebarThemeChanger({ children }: ThemeChangerProps) {
    const { theme, setTheme } = useTheme()
    const { isMobile } = useSidebar()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-25 rounded-lg bg-sidebar-options-background shadow-md border border-sidebar-border text-foreground"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "center"}
            >
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault()
                        setTheme("light")
                    }}
                    className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground text-xs"
                >
                    <div className="w-4 h-4 flex items-center justify-center">
                        {theme === "light" && <Check className="h-3 w-3" />}
                    </div>
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault()
                        setTheme("dark")
                    }}
                    className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground text-xs"
                >
                    <div className="w-4 h-4 flex items-center justify-center">
                        {theme === "dark" && <Check className="h-3 w-3" />}
                    </div>
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault()
                        setTheme("system")
                    }}
                    className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground text-xs"
                >
                    <div className="w-4 h-4 flex items-center justify-center">
                        {theme === "system" && <Check className="h-3 w-3" />}
                    </div>
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}