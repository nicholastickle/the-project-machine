"use client"

import { useState } from "react"
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

type Role = "Editor" | "Viewer"

interface Member {
    id: string
    name: string
    email: string
    role: Role
    isCurrentUser?: boolean
    isPending?: boolean
}

const initialMembers: Member[] = [
    { id: "1", name: "You", email: "you@example.com", role: "Editor", isCurrentUser: true },
    { id: "2", name: "John Doe", email: "john@example.com", role: "Editor" },
    { id: "3", name: "Jane Smith", email: "jane@example.com", role: "Viewer" },
]

export default function ShareButton() {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<Role>("Editor")
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null)

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSendInvite = () => {
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
            (m) => m.email.toLowerCase() === email.trim().toLowerCase()
        )
        if (existingMember) {
            setEmailError("This email is already a project member")
            return
        }

        const newMember: Member = {
            id: Date.now().toString(),
            name: email.split("@")[0],
            email: email.trim(),
            role: selectedRole,
            isPending: true,
        }

        setMembers([...members, newMember])
        setEmail("")
        setEmailError(null)
    }

    const handleDeleteMember = (memberId: string) => {
        setMembers(members.filter((m) => m.id !== memberId))
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
                            <DropdownMenuItem onClick={() => setSelectedRole("Editor")}>
                                {selectedRole === "Editor" && <Check className="size-4 mr-2" />}
                                <span className={selectedRole !== "Editor" ? "ml-6" : ""}>
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
                <Button onClick={handleSendInvite} className="w-full mb-4 text-foreground bg-sidebar-accent hover:bg-sidebar-accent">
                    Send Invite
                </Button>

                {/* Project Members Section */}
                <div className="border-t border-sidebar-border">
                    <h4 className="text-sm font-medium my-2 text-foreground underline">Project members</h4>
                    <div className="space-y-1">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between py-1 px-2 -mx-2 rounded-md text-foreground transition-colors"
                                onMouseEnter={() => setHoveredMemberId(member.id)}
                                onMouseLeave={() => setHoveredMemberId(null)}
                            >
                                <div className="flex flex-row gap-1">
                                    <span className="text-sm">
                                        {member.name}
                                        {member.isCurrentUser && (
                                            <span className="text-muted-foreground"> (you)</span>
                                        )}
                                        {member.isPending && (
                                            <span className="text-muted-foreground text-xs ml-2 items-center">
                                                (pending)
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-xs text-muted-foreground justify-center items-center flex">
                                        {member.role}
                                    </span>
                                </div>
                                <div
                                    className={cn(
                                        "transition-opacity",
                                        hoveredMemberId === member.id ? "opacity-100" : "opacity-0"
                                    )}
                                >
                                    {!member.isCurrentUser && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreHorizontal className="size-3" />
                                                    <span className="sr-only">Member options</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-sidebar-options-background border border-sidebar-border rounded-md text-foreground">
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    className="text-foreground focus:text-foreground bg-sidebar-options-background" 
                                                >
                                                    <Trash2 className="size-4 mr-2" />
                                                    Remove from project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
