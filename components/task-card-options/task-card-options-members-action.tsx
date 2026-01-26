import { Users, Check } from 'lucide-react';
import { Task, ProjectMember } from '@/stores/types';
import useStore from '@/stores/flow-store';
import useProjectStore from '@/stores/project-store';
import { useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskCardOptionsMembersAction({ task }: { task: Task }) {
    const updateTask = useStore((state) => state.updateTask);
    const { getProjectMembers, fetchProjectMembers } = useProjectStore();
    
    const availableMembers = getProjectMembers(task.project_id);
    
    // Fetch members when component mounts
    useEffect(() => {
        fetchProjectMembers(task.project_id);
    }, [task.project_id, fetchProjectMembers]);

    const currentMembers = task.members || [];

    const isMemberSelected = (userId: string) => {
        return currentMembers.some(member =>
            member.user_id === userId
        );
    };

    const handleMemberToggle = async (member: ProjectMember) => {
        let updatedMembers = [...currentMembers];

        if (isMemberSelected(member.user_id)) {
            // Remove member from the task
            updatedMembers = updatedMembers.filter(m => m.user_id !== member.user_id);
            
            // Call backend to remove assignment
            try {
                await fetch(`/api/tasks/${task.id}/assignments?userId=${member.user_id}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Failed to remove assignment:', error);
            }
        } else {
            // Add member to the task
            updatedMembers.push(member);
            
            // Call backend to create assignment
            try {
                await fetch(`/api/tasks/${task.id}/assignments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: member.user_id, role: 'assignee' })
                });
            } catch (error) {
                console.error('Failed to create assignment:', error);
            }
        }

        updateTask(task.id, { members: updatedMembers });
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100 border">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-left">Members</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white text-foreground">
                <DropdownMenuGroup>
                    {availableMembers.length === 0 ? (
                        <DropdownMenuItem disabled className="text-muted-foreground">
                            No project members yet
                        </DropdownMenuItem>
                    ) : (
                        availableMembers.map((member) => (
                            <DropdownMenuItem
                                key={member.user_id}
                                onClick={() => handleMemberToggle(member)}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <div className="flex items-center justify-center w-4 h-4">
                                    {isMemberSelected(member.user_id) && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </div>
                                <span>{member.name || member.user_id}</span>
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
