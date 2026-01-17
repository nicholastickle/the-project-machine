import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useTaskbookStore from '@/stores/taskbook-store'
import { useState } from 'react'

interface TaskBookDeleteProps {
    taskId: string | null;
    disabled?: boolean;
    onDeleteComplete?: () => void;
}

export default function TaskBookDelete({ taskId, disabled = false, onDeleteComplete }: TaskBookDeleteProps) {
    const removeTask = useTaskbookStore((state) => state.removeTask);
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteConfirm = () => {
        if (!taskId) return;

        removeTask(taskId);
        onDeleteComplete?.();
        setIsOpen(false);
    };

    const handleDeleteCancel = () => {
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled || !taskId}
                    className="bg-task-book-background text-task-book-foreground hover:bg-task-book-accent hover:text-task-book-foreground"
                >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-white" align="end">
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">
                        Delete this task?
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                        This will permanently remove it from your task book.
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleDeleteConfirm}
                            variant="destructive"
                            size="sm"
                            className="flex-1 text-foreground"
                        >
                            Yes, delete
                        </Button>
                        <Button
                            onClick={handleDeleteCancel}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-foreground"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}