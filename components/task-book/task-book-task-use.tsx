import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { TaskbookEntry } from '@/stores/types'
import useStore from '@/stores/flow-store'
import useTaskbookStore from '@/stores/taskbook-store'

interface TaskBookUseProps {
    selectedTask: TaskbookEntry | null;
    onClose?: () => void;
}

export default function TaskBookUse({ selectedTask, onClose }: TaskBookUseProps) {
    const addTaskNode = useStore((state) => state.addTaskNode);
    const updateSavedTask = useTaskbookStore((state) => state.updateSavedTask);

    const handleUse = () => {
        if (!selectedTask) return;

        addTaskNode({
            title: selectedTask.title,
            description: selectedTask.description || "",
            status: "backlog",
            estimated_hours: 0, // Default value since TaskbookEntry doesn't have this
            time_spent: 0, // Default value since TaskbookEntry doesn't have this
            subtasks: selectedTask.subtasks || [],
        });
        const now = new Date().toISOString();
        updateSavedTask(selectedTask.id, { used_at: now, usage_count: (selectedTask.usage_count || 0) + 1 });
        onClose?.();
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleUse}
            disabled={!selectedTask}
            className="bg-task-book-background text-task-book-foreground hover:bg-task-book-accent hover:text-task-book-foreground"
        >
            <Play size={14} className="mr-1" />
            Use
        </Button>
    );
}