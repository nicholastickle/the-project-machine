"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, Plus, FolderOpen, Clock } from 'lucide-react'
import useStore from '@/stores/flow-store'

type Project = {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export default function ProjectSelector() {
  const { projectId, setProjectId, lastSavedAt } = useStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const currentProject = projects.find(p => p.id === projectId)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      console.log('[ProjectSelector] Fetching projects...')
      const response = await fetch('/api/projects')
      console.log('[ProjectSelector] Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('[ProjectSelector] Projects loaded:', {
          count: data.projects?.length || 0,
          projects: data.projects
        })
        setProjects(data.projects || [])
        
        // Auto-select first project if none selected
        if (!projectId && data.projects?.length > 0) {
          console.log('[ProjectSelector] Auto-selecting first project:', data.projects[0].id)
          setProjectId(data.projects[0].id)
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error' }))
        console.error('[ProjectSelector] Failed to load projects:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
      }
    } catch (error) {
      console.error('[ProjectSelector] Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    try {
      setIsSaving(true)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDescription.trim() || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProjects([data.project, ...projects])
        setProjectId(data.project.id)
        setIsNewProjectModalOpen(false)
        setNewProjectName('')
        setNewProjectDescription('')
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Not saved yet'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm border rounded-lg">
        <div className="text-sm text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Project Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 min-w-[200px] justify-between"
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span className="truncate">
                  {currentProject?.name || 'Select Project'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px]">
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => setProjectId(project.id)}
                className="flex flex-col items-start gap-1 p-2"
              >
                <div className="font-medium">{project.name}</div>
                {project.description && (
                  <div className="text-xs text-muted-foreground truncate w-full">
                    {project.description}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsNewProjectModalOpen(true)}
              className="text-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Last Saved Indicator */}
        {currentProject && (
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground bg-background/60 rounded border">
            <Clock className="w-3 h-3" />
            <span>{formatTimestamp(lastSavedAt)}</span>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start a new planning board for your next big thing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="My Amazing Project"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleCreateProject()
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this project about?"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewProjectModalOpen(false)
                setNewProjectName('')
                setNewProjectDescription('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || isSaving}
            >
              {isSaving ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
