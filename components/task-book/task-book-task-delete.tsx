import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import useTaskbookStore from '@/stores/taskbook-store'

interface TaskBookDeleteProps {
    taskId: string | null;
    disabled?: boolean;
    onDeleteComplete?: () => void;
}

export default function TaskBookDelete({ taskId, disabled = false, onDeleteComplete }: TaskBookDeleteProps) {
    const removeTask = useTaskbookStore((state) => state.removeTask);

    const handleDelete = () => {
        if (!taskId) return;

        if (confirm('Delete this task? This will permanently remove it from your task book.')) {
            removeTask(taskId);
            onDeleteComplete?.();
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={disabled || !taskId}
            className="bg-task-book-background text-task-book-foreground hover:bg-task-book-accent hover:text-task-book-foreground"
        >
            <Trash2 size={14} className="mr-1" />
            Delete
        </Button>
    );
}