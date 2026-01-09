import { Users, Check } from 'lucide-react';
import { TaskData } from '@/stores/types';
import useStore from '@/stores/flow-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardOptionsMembersActionProps {
    nodeId: string;
    data: TaskData;
}

export default function TaskCardOptionsMembersAction({ nodeId, data }: TaskCardOptionsMembersActionProps) {
    const updateNodeData = useStore((state) => state.updateNodeData);

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

    const currentMembers = data.members || [];

    const isMemberSelected = (memberId: string) => {
        return currentMembers.some(member =>
            member.memberId === memberId && !member.removedDate
        );
    };

    const handleMemberToggle = (member: typeof availableMembers[0]) => {
        const currentTime = new Date().toISOString();
        let updatedMembers = [...currentMembers];

        if (isMemberSelected(member.memberId)) {
            updatedMembers = updatedMembers.map(m =>
                m.memberId === member.memberId
                    ? { ...m, removedDate: currentTime }
                    : m
            );
        } else {
            const existingMemberIndex = updatedMembers.findIndex(
                m => m.memberId === member.memberId
            );

            if (existingMemberIndex !== -1) {
                updatedMembers[existingMemberIndex] = {
                    ...updatedMembers[existingMemberIndex],
                    removedDate: undefined
                };
            } else {
                updatedMembers.push({
                    memberId: member.memberId,
                    memberName: member.memberName,
                    addedDate: currentTime,
                });
            }
        }

        updateNodeData(nodeId, { members: updatedMembers });
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
