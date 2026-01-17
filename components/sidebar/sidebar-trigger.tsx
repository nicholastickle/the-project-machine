import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export default function CanvasSidebarTrigger() {
    const { open, isMobile } = useSidebar()

    return (
        <SidebarTrigger
            className={`absolute top-2.5 z-50 bg-background/80 hover:bg-muted-foreground/10 hover:text-current transition-all duration-300 ${!isMobile && open ? 'left-[265px]' : 'left-[5px] md:left-[60px]'} ${isMobile && !open ? 'left-[10px]' : ''}`}
        />
    )
}