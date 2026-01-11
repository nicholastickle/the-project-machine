"use client"

import {
    LayoutDashboard,
} from "lucide-react"

import { NavProjects } from "@/components/sidebar/nav-projects"

import { NavUser } from "@/components/sidebar/nav-user"
import { NavHelp } from "@/components/sidebar/nav-help"
import { ProjectMachineLogo } from "@/components/logo/project-machine-logo"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    user: {
        name: "Project User",
        email: "user@projectmachine.com",
        avatar: "/images/avatars/robert-fox.png",
    },

    projects: [
        {
            title: "Projects",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
            items: [
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
            ],
        },
    ],
    
}

export default function CanvasSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" className="z-40" {...props}>
            <SidebarHeader>
                <ProjectMachineLogo size="md" href="/" />
            </SidebarHeader>
            <SidebarContent>
                <NavProjects items={data.projects} />
                
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between w-full">
                    <NavUser user={data.user} />
                    <NavHelp />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
