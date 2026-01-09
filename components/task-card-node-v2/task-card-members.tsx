import { TaskData } from '@/stores/types';

export default function TaskCardMembers({ members }: { members?: TaskData['members'] }) {
  const activeMembers = members?.filter(member => !member.removedDate) || [];
  
  if (activeMembers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {activeMembers.map((member, index) => (
          <div
            key={member.memberId}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium shadow-sm"
            style={{ zIndex: activeMembers.length - index }}
            title={member.memberName}
          >
            {member.memberName.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
