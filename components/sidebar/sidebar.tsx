import SidebarProjectsDropdown from "@/components/sidebar/sidebar-projects-dropdown"
import SidebarUsers from "@/components/sidebar/sidebar-users"
import SidebarHelpButton from "@/components/sidebar/sidebar-help-button"
import { ProjectMachineLogo } from "@/components/logo/project-machine-logo"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

    
export default function CanvasSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" className="z-40" {...props}>
            <SidebarHeader>
                <ProjectMachineLogo size="md" href="/" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarProjectsDropdown />
                
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between w-full">
                    <SidebarUsers />
                    <SidebarHelpButton />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
