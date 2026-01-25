"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useProjectStore from "@/stores/project-store"
import { useAuth } from "@/components/auth/auth-provider"

export default function CanvasPage() {
    const router = useRouter()
    const { user, loading } = useAuth()
    const { projects, activeProjectId, fetchProjects, isLoading } = useProjectStore()

    // Redirect to landing if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/')
        }
    }, [loading, user, router])

    useEffect(() => {
        // Fetch projects on mount (only if authenticated)
        if (!loading && user) {
            fetchProjects()
        }
    }, [fetchProjects, loading, user])

    useEffect(() => {
        // Redirect to first project once loaded
        if (!loading && user && !isLoading && projects.length > 0) {
            const targetProjectId = activeProjectId || projects[0].id
            router.replace(`/canvas/${targetProjectId}`)
        }
    }, [loading, user, isLoading, projects, activeProjectId, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-muted-foreground">Checking authentication...</p>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-muted-foreground">Loading projects...</p>
        </div>
    )
}