"use client"

import { useEffect, useState } from "react"
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
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const data = {
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
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const supabase = createClient()

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Extract name from email (before @)
    const userName = user?.email?.split('@')[0] || 'User'

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
                    <NavUser user={{
                        name: userName,
                        email: user?.email || 'loading...',
                        avatar: '/images/avatars/robert-fox.png'
                    }} />
                    <NavHelp />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
