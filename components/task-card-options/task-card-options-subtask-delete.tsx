import { Trash2 } from 'lucide-react';
import useStore from '@/stores/flow-store';
import { Task, Subtask } from '@/stores/types';

export default function SubtaskDelete({ taskId, subtaskId }: { taskId: Task['id']; subtaskId: Subtask['id'] }) {
    const deleteSubtask = useStore((state) => state.deleteSubtask);
    const handleDelete = () => {
        deleteSubtask(taskId, subtaskId);
    };

    return (
        <button
            onClick={handleDelete}
            className="flex items-center justify-center w-6 h-6 text-muted hover:text-red-500 transition-colors opacity-60 hover:opacity-100"
            title="Delete subtask"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}