"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useProjectStore from "@/stores/project-store"

export default function CanvasPage() {
    const router = useRouter()
    const { projects, activeProjectId, fetchProjects, isLoading } = useProjectStore()

    useEffect(() => {
        // Fetch projects on mount
        fetchProjects()
    }, [fetchProjects])

    useEffect(() => {
        // Redirect to first project once loaded
        if (!isLoading && projects.length > 0) {
            const targetProjectId = activeProjectId || projects[0].id
            router.replace(`/canvas/${targetProjectId}`)
        }
    }, [isLoading, projects, activeProjectId, router])

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-muted-foreground">Loading projects...</p>
        </div>
    )
}