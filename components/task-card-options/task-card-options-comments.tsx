import { Task } from '@/stores/types';
import { MessageSquare } from 'lucide-react';
import TaskCardOptionsCommentsNew from './task-card-options-comments-new';
import TaskCardOptionsCommentsExisting from './task-card-options-comments-existing';


export default function TaskCardOptionsComments({ task }: { task: Task }) {

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Comments:</span>
            </div>

            <div className="space-y-4">
                <TaskCardOptionsCommentsNew task={task} />
                <TaskCardOptionsCommentsExisting task={task} />
            </div>
        </div>
    );
}
