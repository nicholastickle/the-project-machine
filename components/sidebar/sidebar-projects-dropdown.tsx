import { ChevronRight, LayoutDashboard, LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import SidebarProjectsNew from "@/components/sidebar/sidebar-projects-new"
import SidebarProjectsOptions from "@/components/sidebar/sidebar-projects-options"

export default function SidebarProjectsDropdown() {

    const projects = [
                    {
                        title: "Board 1",
                        url: "#",
                    },
                    {
                        title: "Board 2",
                        url: "#",
                    },
                    {
                        title: "Board 3",
                        url: "#",
                    },
                ]
    
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">

            <SidebarMenu>
                    <Collapsible
                        key="Projects"
                        asChild
                        defaultOpen={true}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip="Projects">
                                    <LayoutDashboard />
                                    <span>Projects</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarProjectsNew />

                                    {projects.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title} className="relative group/menu-item flex items-center">
                                            <SidebarMenuSubButton asChild className="flex-1">
                                                <a href={subItem.url}>
                                                    <span>{subItem.title}</span>
                                                </a>
                                            </SidebarMenuSubButton>
                                            <SidebarProjectsOptions projectName={subItem.title} />
                                        </SidebarMenuSubItem>
                                    ))}

                                </SidebarMenuSub>

                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    )
}