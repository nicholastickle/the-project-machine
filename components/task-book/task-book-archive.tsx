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
        >
            <Archive size={14} className="mr-1" />
            Archive
        </Button>
    );
}