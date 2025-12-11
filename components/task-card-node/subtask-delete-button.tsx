import { Trash2 } from 'lucide-react';
import useStore from '@/stores/flow-store';

interface SubtaskDeleteButtonProps {
    nodeId: string;
    subtaskId: string;
}

export default function SubtaskDeleteButton({ nodeId, subtaskId }: SubtaskDeleteButtonProps) {
    const deleteSubtask = useStore((state) => state.deleteSubtask);

    const handleDelete = () => {
        deleteSubtask(nodeId, subtaskId);
    };

    return (
        <button
            onClick={handleDelete}
            className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-500 transition-colors opacity-60 hover:opacity-100"
            title="Delete subtask"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}