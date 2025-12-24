"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function NewProject({ onProjectCreated }: { onProjectCreated?: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleCreate = async () => {
        if (!name.trim()) return

        setIsSaving(true)
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || null,
                }),
            })

            if (response.ok) {
                setIsOpen(false)
                setName('')
                setDescription('')
                onProjectCreated?.()
            }
        } catch (error) {
            console.error('Error creating project:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsOpen(true)} className="w-full text-muted text-xs">
                    <Plus className="w-4 h-4" />
                    <span>Add new project</span>
                </SidebarMenuButton>
            </SidebarMenuItem>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                            Start a new planning board
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                placeholder="My Project"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleCreate()
                                    }
                                }}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="What's this project about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={!name.trim() || isSaving}>
                            {isSaving ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
