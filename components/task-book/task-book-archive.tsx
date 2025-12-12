import { Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import useTaskbookStore from '@/stores/taskbook-store'

interface TaskBookArchiveProps {
    taskId: string | null;
    disabled?: boolean;
    onArchiveComplete?: () => void;
}

export default function TaskBookArchive({ taskId, disabled = false, onArchiveComplete }: TaskBookArchiveProps) {
    const removeTask = useTaskbookStore((state) => state.removeTask);

    const handleArchive = () => {
        if (!taskId) return;

        if (confirm('Archive this task? This will permanently remove it from your task book.')) {
            removeTask(taskId);
            onArchiveComplete?.();
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
            disabled={disabled || !taskId}
            className="bg-task-book-background text-task-book-foreground hover:bg-task-book-accent hover:text-task-book-accent-foreground border-task-book-border"
        >
            <Archive size={14} className="mr-1" />
            Archive
        </Button>
    );
}