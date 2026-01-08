import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';

interface TaskCardOptionsSubtasksProps {
    nodeId: string;
    subtasks?: TaskData['subtasks'];
}

export default function TaskCardOptionsSubtasks({ nodeId, subtasks }: TaskCardOptionsSubtasksProps) {
    const node = useStore((state) => state.nodes.find(n => n.id === nodeId));
    const addSubtask = useStore((state) => state.addSubtask);
    const updateSubtask = useStore((state) => state.updateSubtask);
    const deleteSubtask = useStore((state) => state.deleteSubtask);

    const completedCount = subtasks?.filter(subtask => subtask.isCompleted).length || 0;
    const totalCount = subtasks?.length || 0;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="flex flex-col flex-1 mt-1">
            <div className="flex items-center mb-1">Checklist</div>
            <div className="flex items-center mb-2">{progressPercentage}% Complete</div>
            <div className="flex-1 overflow-y-auto">
                {subtasks?.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 mb-1 text-sm">
                        <input
                            type="checkbox"
                            checked={subtask.isCompleted}
                            onChange={(e) => updateSubtask(nodeId, subtask.id, { isCompleted: e.target.checked })}
                        />
                        <span className={subtask.isCompleted ? 'line-through text-gray-500' : ''}>
                            {subtask.title}
                        </span>
                    </div>
                )) || <div className="text-sm text-gray-500">No subtasks</div>}
            </div>
            <button
                onClick={() => addSubtask(nodeId)}
                className="text-sm text-blue-500 hover:text-blue-700 mt-2"
            >
                + Add subtask
            </button>
        </div>
    );
}
