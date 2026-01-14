import TaskHandles from '@/components/task-card-node-v2/task-card-handles';
import TaskCardTitle from '@/components/task-card-node-v2/task-card-title';
import TaskCardStatus from '@/components/task-card-node-v2/task-card-status';
import TaskCardDescription from '@/components/task-card-node-v2/task-card-description';
import TaskCardSubtask from '@/components/task-card-node-v2/task-card-subtask';
import TaskCardComments from '@/components/task-card-node-v2/task-card-comments';
import TaskCardMembers from '@/components/task-card-node-v2/task-card-members';
import TaskCardDurations from '@/components/task-card-node-v2/task-card-durations';
import TaskCardOptionsBadge from '@/components/task-card-node-v2/task-card-options-badge';
import { Clock } from 'lucide-react';
import { type NodeProps } from '@xyflow/react';
import useStore from '@/stores/flow-store';

export default function TaskCard({ id }: NodeProps)  {

    const task = useStore((state) => {
        const node = state.nodes.find(n => n.id === id);
        if (!node) return undefined;
        return state.tasks.find(t => t.id === node.content_id);
    });
   
    if (!task) {
        return (
            <div className="group relative w-[400px] min-h-[400px] border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center rounded-sm shadow-lg m-5">
                <span className="text-gray-500">Task not found</span>
            </div>
        );
    }
    return (
        <div
            className={`group relative w-[400px] min-h-[400px] border-2 border-task-card-border bg-task-card-background flex flex-col rounded-sm shadow-lg m-5`}
        >
            <TaskCardOptionsBadge task={task} />
            <div className="border flex flex-col flex-[5] ml-3 mr-3 mt-3 bg-task-card-accent ">
                <div className="flex flex-row flex-[0.1] gap-2 justify-start items-center px-3">
                    <Clock size={24} className="text-task-card-icon-foreground" />
                    <TaskCardDurations estimatedHours={task.estimated_hours} />
                </div>
                <div className="h-full w-full flex flex-[9] justify-center items-center text-center">
                    <TaskCardTitle task={task} />
                </div>
            </div>
            <div className="flex flex-row flex-[5] items-center px-3 gap-4">
                <TaskCardStatus status={task.status} />
                <TaskCardDescription description={task.description} />
                <TaskCardSubtask subtasks={task.subtasks} />
                <TaskCardComments comments={task.comments} />
                <TaskCardMembers members={task.members} />
            </div>



            <TaskHandles />
        </div>
    );
}
