import { SavedTask } from '@/stores/types';
import { CheckSquare } from 'lucide-react';
import TaskBookTaskSubtaskTable from '@/components/task-book/task-book-task-subtask-table';

interface TaskBookTaskSubtaskProps {
    task: SavedTask | null;
}

export default function TaskBookTaskSubtask({ task }: TaskBookTaskSubtaskProps) {

    if (!task) {
        return null;
    }

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <CheckSquare size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Subtasks:</span>
            </div>
            <div className='border border-gray-200 outline-none rounded-md bg-white'>
                <TaskBookTaskSubtaskTable taskId={task.id} subtasks={task.subtasks || []} />
                
            </div>
        </div>
    );
}