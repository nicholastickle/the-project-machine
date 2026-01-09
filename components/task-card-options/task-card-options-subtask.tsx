import { TaskData } from '@/stores/types';
import { CheckSquare } from 'lucide-react';
import SubtaskTable from '@/components/task-card-options/task-card-options-subtask-table';



interface TaskCardOptionsSubtasksProps {
    nodeId: string;
    subtasks?: TaskData['subtasks'];
}

export default function TaskCardOptionsSubtasks({ nodeId, subtasks }: TaskCardOptionsSubtasksProps) {
    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <CheckSquare size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Subtasks:</span>
            </div>
            <div className='border border-gray-200 outline-none rounded-md bg-white'>
                < SubtaskTable nodeId={nodeId} subtasks={subtasks || []} />
            </div>
        </div >
    );
}
