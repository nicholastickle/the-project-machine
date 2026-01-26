"use client"

import { useState, useEffect } from "react"
import { Share2, HelpCircle, ChevronDown, Check, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import useProjectStore from "@/stores/project-store"
import { toast } from "sonner"

type Role = "editor" | "viewer"

export default function ShareButton() {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<Role>("editor")
    const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    
    const { 
        getActiveProject, 
        getProjectMembers, 
        getPendingInvitations,
        fetchProjectMembers, 
        inviteCollaborator, 
        removeCollaborator 
    } = useProjectStore();
    
    const activeProject = getActiveProject();
    const projectId = activeProject?.id;
    
    const members = projectId ? getProjectMembers(projectId) : [];
    const pendingInvitations = projectId ? getPendingInvitations(projectId) : [];

    // Fetch current user and members when popover opens
    useEffect(() => {
        if (projectId) {
            fetchProjectMembers(projectId);
            
            // Get current user ID from auth
            fetch('/api/get-session-info')
                .then(res => res.json())
                .then(data => setCurrentUserId(data.user?.id || null))
                .catch(() => setCurrentUserId(null));
        }
    }, [projectId, fetchProjectMembers]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSendInvite = async () => {
        if (!projectId) {
            toast.error('No active project selected');
            return;
        }

        setEmailError(null)

        if (!email.trim()) {
            setEmailError("Please enter an email address")
            return
        }

        if (!validateEmail(email.trim())) {
            setEmailError("Please enter a valid email address")
            return
        }

        const existingMember = members.find(
            (m) => m.name?.toLowerCase() === email.trim().toLowerCase()
        )
        if (existingMember) {
            setEmailError("This email is already a project member")
            return
        }

        setIsLoading(true);
        const success = await inviteCollaborator(projectId, email.trim(), selectedRole);
        setIsLoading(false);

        if (success) {
            toast.success(`Invitation sent to ${email.trim()}`);
            setEmail("");
        } else {
            toast.error('Failed to send invitation. Please try again.');
        }
    }

    const handleDeleteMember = async (userId: string) => {
        if (!projectId) return;

        setIsLoading(true);
        const success = await removeCollaborator(projectId, userId);
        setIsLoading(false);

        if (success) {
            toast.success('Member removed from project');
        } else {
            toast.error('Failed to remove member');
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-canvas-buttons-background text-muted-foreground hover:bg-canvas-buttons-accent hover:text-canvas-buttons-accent-foreground border-canvas-buttons-border gap-2 p-2 text-sm"
                >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-sidebar-options-background border border-sidebar-border rounded-md" align="end">
                {/* Title Row */}
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-md font-semibold text-foreground">Share this project</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href="https://alkaline-apple-00d.notion.site/Project-Machine-User-Manual-121aa4c8ef4d4fac8976882a65642716" target="_blank" rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <HelpCircle className="size-4" />
                                    <span className="sr-only">Learn more about sharing</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>Learn more about sharing</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Email Input Row */}
                <div className="flex flex-row gap-3 mb-3">
                    <Input
                        type="email"
                        placeholder="Enter email..."
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            if (emailError) setEmailError(null)
                        }}
                        className={cn("flex-1", emailError && "border-destructive", "text-foreground outline-none focus:border-none")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendInvite()
                            }
                        }}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-1 min-w-24 text-foreground bg-sidebar-accent">
                                {selectedRole}
                                <ChevronDown className="size-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-sidebar-options-background border border-sidebar-border rounded-md text-foreground">
                            <DropdownMenuItem onClick={() => setSelectedRole("editor")}>
                                {selectedRole === "editor" && <Check className="size-4 mr-2" />}
                                <span className={selectedRole !== "editor" ? "ml-6" : ""}>
                                    Editor
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="text-muted-foreground opacity-50">
                                <span className="ml-6">Viewer</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {emailError && (
                    <p className="text-xs text-destructive mb-3">{emailError}</p>
                )}

                {/* Send Invite Button */}
                <Button 
                    onClick={handleSendInvite} 
                    disabled={isLoading || !projectId}
                    className="w-full mb-4 text-foreground bg-sidebar-accent hover:bg-sidebar-accent"
                >
                    {isLoading ? 'Sending...' : 'Send Invite'}
                </Button>

                {/* Project Members Section */}
                <div className="border-t border-sidebar-border">
                    <h4 className="text-sm font-medium my-2 text-foreground underline">Project members</h4>
                    <div className="space-y-1">
                        {members.map((member) => {
                            const isCurrentUser = member.user_id === currentUserId;
                            const displayName = member.name || member.user_id;
                            
                            return (
                                <div
                                    key={member.user_id}
                                    className="flex items-center justify-between py-1 px-2 -mx-2 rounded-md text-foreground transition-colors"
                                    onMouseEnter={() => setHoveredMemberId(member.user_id)}
                                    onMouseLeave={() => setHoveredMemberId(null)}
                                >
                                    <div className="flex flex-row gap-1">
                                        <span className="text-sm">
                                            {displayName}
                                            {isCurrentUser && (
                                                <span className="text-muted-foreground"> (you)</span>
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground justify-center items-center flex">
                                            {member.role}
                                        </span>
                                    </div>
                                    <div
                                        className={cn(
                                            "transition-opacity",
                                            hoveredMemberId === member.user_id ? "opacity-100" : "opacity-0"
                                        )}
                                    >
                                        {!isCurrentUser && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8" disabled={isLoading}>
                                                        <MoreHorizontal className="size-3" />
                                                        <span className="sr-only">Member options</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-sidebar-options-background border border-sidebar-border rounded-md text-foreground">
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteMember(member.user_id)}
                                                        className="text-foreground focus:text-foreground bg-sidebar-options-background" 
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 className="size-4 mr-2" />
                                                        Remove from project
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Show pending invitations */}
                        {pendingInvitations.map((invitation) => (
                            <div
                                key={invitation.id}
                                className="flex items-center justify-between py-1 px-2 -mx-2 rounded-md text-foreground transition-colors opacity-60"
                            >
                                <div className="flex flex-row gap-1">
                                    <span className="text-sm">
                                        {invitation.invited_email}
                                        <span className="text-muted-foreground text-xs ml-2">
                                            (pending)
                                        </span>
                                    </span>
                                    <span className="text-xs text-muted-foreground justify-center items-center flex">
                                        {invitation.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
