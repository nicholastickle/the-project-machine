import { CheckSquare } from 'lucide-react';
import { Task } from '@/stores/types';

export default function TaskCardSubtask({ subtasks }: { subtasks?: Task['subtasks'] }) {
    if (!subtasks || subtasks.length === 0) {
        return null;
    }

    const completedCount = subtasks.filter(subtask => subtask.is_completed).length;
    const totalCount = subtasks.length;

    return (
        <div className="flex items-center gap-2">
            <CheckSquare size={24} className="text-task-card-icon-foreground" />
            <span className="text-md text-task-card-foreground">
                {completedCount} / {totalCount}
            </span>
        </div>
    );
}
