import { Task } from '@/stores/types';

export default function TaskCardMembersIcons({ members }: { members?: Task['members'] }) {


    if (members?.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2">
                {members?.map((member, index) => (
                    <div
                        key={member.user_id}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium shadow-sm"
                        style={{ zIndex: members.length - index }}
                        title={member.name || 'Member'}
                    >
                        {(member.name || 'M').charAt(0).toUpperCase()}
                    </div>
                ))}
            </div>
        </div>
    );
}