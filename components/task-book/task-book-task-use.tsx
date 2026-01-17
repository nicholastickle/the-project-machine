import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { SavedTask } from '@/stores/types'
import useStore from '@/stores/flow-store'
import useTaskbookStore from '@/stores/taskbook-store'

interface TaskBookUseProps {
    selectedTask: SavedTask | null;
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
            status: "Backlog",
            estimatedHours: selectedTask.estimatedHours || 0,
            timeSpent: selectedTask.timeSpent || 0,
            subtasks: selectedTask.subtasks || [],
        });
        const now = new Date().toLocaleString();
        updateSavedTask(selectedTask.id, { lastUsed: now });
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