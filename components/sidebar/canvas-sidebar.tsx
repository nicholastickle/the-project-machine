"use client"

import { useEffect, useState } from "react"
import { LayoutDashboard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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

interface Project {
    id: string
    name: string
    description?: string | null
}

export default function CanvasSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // Get user
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUser({
                    name: data.user.email?.split('@')[0] || 'User',
                    email: data.user.email || '',
                    avatar: data.user.user_metadata?.avatar_url || '/images/avatars/robert-fox.png'
                })
            }
        })

        // Fetch projects
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data.projects || [])
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Failed to load projects:', err)
                setIsLoading(false)
            })
    }, [])

    const projectsNav = [
        {
            title: "Projects",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
            items: isLoading 
                ? [{ title: "Loading...", url: "#" }]
                : projects.length > 0
                ? projects.map(p => ({
                    title: p.name,
                    url: `/canvas/${p.id}`
                  }))
                : [{ title: "No projects yet", url: "/test-canvas" }]
        }
    ]

    return (
        <Sidebar collapsible="icon" className="z-40" {...props}>
            <SidebarHeader>
                <ProjectMachineLogo size="md" href="/" />
            </SidebarHeader>
            <SidebarContent>
                <NavProjects items={projectsNav} />
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between w-full">
                    {user ? (
                        <NavUser user={user} />
                    ) : (
                        <NavUser user={{
                            name: "Loading...",
                            email: "",
                            avatar: "/images/avatars/robert-fox.png"
                        }} />
                    )}
                    <NavHelp />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
