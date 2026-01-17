import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';
import { MessageSquare } from 'lucide-react';
import TaskCardOptionsCommentsNew from './task-card-options-comments-new';
import TaskCardOptionsCommentsExisting from './task-card-options-comments-existing';

interface TaskCardOptionsCommentsProps {
    nodeId: string;
    comments?: TaskData['comments'];
}

export default function TaskCardOptionsComments({ nodeId, comments }: TaskCardOptionsCommentsProps) {
    const node = useStore((state) => state.nodes.find(n => n.id === nodeId));

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Comments:</span>
            </div>

            <div className="space-y-4">
                <TaskCardOptionsCommentsNew nodeId={nodeId} comments={comments} />
                <TaskCardOptionsCommentsExisting nodeId={nodeId} comments={comments} />
            </div>
        </div>
    );
}
