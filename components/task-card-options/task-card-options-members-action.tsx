import { Users, Check } from 'lucide-react';
import { Task, ProjectMember } from '@/stores/types';
import useStore from '@/stores/flow-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskCardOptionsMembersAction({ task }: { task: Task }) {
    const updateTask = useStore((state) => state.updateTask);

    // Dummy users
    const availableMembers = [
        {
            memberId: 'nicholas-tickle',
            memberName: 'Nicholas Tickle',
        },
        {
            memberId: 'brighton-tandabantu',
            memberName: 'Brighton Tandabantu',
        }
    ];

    const currentMembers = task.members || [];

    const isMemberSelected = (memberId: string) => {
        return currentMembers.some(member =>
            member.user_id === memberId
        );
    };

    const handleMemberToggle = (member: typeof availableMembers[0]) => {
        let updatedMembers = [...currentMembers];

        if (isMemberSelected(member.memberId)) {
            // Remove member from the task
            updatedMembers = updatedMembers.filter(m => m.user_id !== member.memberId);
        } else {
            // Add member to the task
            const newMember: ProjectMember = {
                project_id: task.project_id,
                user_id: member.memberId,
                name: member.memberName,
                role: 'editor'
            };
            updatedMembers.push(newMember);
        }

        updateTask(task.id, { members: updatedMembers });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100 border">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-left">Members</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white text-foreground">
                <DropdownMenuGroup>
                    {availableMembers.map((member) => (
                        <DropdownMenuItem
                            key={member.memberId}
                            onClick={() => handleMemberToggle(member)}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <div className="flex items-center justify-center w-4 h-4">
                                {isMemberSelected(member.memberId) && (
                                    <Check className="w-4 h-4" />
                                )}
                            </div>
                            <span>{member.memberName}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
