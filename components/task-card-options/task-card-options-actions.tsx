import { Task } from '@/stores/types';
import TaskCardOptionsMembersAction from './task-card-options-members-action';
import TaskCardOptionsSaveAction from './task-card-options-save-action';
import TaskCardOptionsDeleteAction from './task-card-options-delete-action';

export default function TaskCardOptionsActions({ task }: { task: Task }) {
    return (
        <div className="flex flex-col p-3 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions:</h3>
            <div className="flex flex-col space-y-1">
                <TaskCardOptionsMembersAction task={task} />
                <TaskCardOptionsSaveAction task={task} />
                <TaskCardOptionsDeleteAction task={task} />
            </div>
        </div>
    );
}