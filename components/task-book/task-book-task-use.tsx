import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { SavedTask } from '@/stores/types'
import useStore from '@/stores/flow-store'

interface TaskBookUseProps {
    selectedTask: SavedTask | null;
    onClose?: () => void;
}

export default function TaskBookUse({ selectedTask, onClose }: TaskBookUseProps) {
    const addTaskNode = useStore((state) => state.addTaskNode);

    const handleUse = () => {
        if (!selectedTask) return;

        addTaskNode({
            title: selectedTask.title,
            description: selectedTask.description || "",
            status: selectedTask.status || "Backlog",
            estimatedHours: selectedTask.estimatedHours || 0,
            timeSpent: selectedTask.timeSpent || 0,
            subtasks: selectedTask.subtasks || [],
        });

        // Close the dialog after adding the task
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