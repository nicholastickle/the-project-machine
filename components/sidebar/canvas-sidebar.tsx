"use client"

import { useEffect, useState } from "react"
import { LayoutDashboard } from "lucide-react"

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
import useStore from "@/stores/flow-store"

type Project = {
    id: string
    name: string
    description: string | null
}

export default function CanvasSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = useState<User | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const setProjectId = useStore((state) => state.setProjectId)

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

    const loadProjects = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/projects')
            if (response.ok) {
                const data = await response.json()
                setProjects(data.projects || [])
            }
        } catch (error) {
            console.error('[CanvasSidebar] Error loading projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            loadProjects()
        }
    }, [user])

    // Extract name from email (before @)
    const userName = user?.email?.split('@')[0] || 'User'

    // Format projects for NavProjects component
    const projectsData = [
        {
            title: "Projects",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
            items: projects.map(project => ({
                id: project.id,
                title: project.name,
                url: "#",
            })),
        },
    ]

    return (
        <Sidebar collapsible="icon" className="z-40" {...props}>
            <SidebarHeader>
                <ProjectMachineLogo size="md" href="/" />
            </SidebarHeader>
            <SidebarContent>
                <NavProjects 
                    items={projectsData} 
                    onProjectClick={(projectId) => setProjectId(projectId)}
                    onProjectCreated={loadProjects}
                />
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
