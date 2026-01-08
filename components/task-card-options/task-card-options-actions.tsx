import { TaskData } from '@/stores/types';
import TaskCardOptionsMembersAction from './task-card-options-members-action';
import TaskCardOptionsSaveAction from './task-card-options-save-action';
import TaskCardOptionsDeleteAction from './task-card-options-delete-action';

interface TaskCardOptionsActionsProps {
    nodeId: string;
    data: TaskData;
}

export default function TaskCardOptionsActions({ nodeId, data }: TaskCardOptionsActionsProps) {
    return (
        <div className="flex flex-col p-3 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions:</h3>
            <div className="flex flex-col space-y-1">
                <TaskCardOptionsMembersAction nodeId={nodeId} data={data} />
                <TaskCardOptionsSaveAction nodeId={nodeId} data={data} />
                <TaskCardOptionsDeleteAction nodeId={nodeId} data={data} />
            </div>
        </div>
    );
}