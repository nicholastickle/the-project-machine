import { Save } from 'lucide-react';
import { Task } from '@/stores/types';
import useTaskbookStore from '@/stores/taskbook-store';
import { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


export default function TaskCardOptionsSaveAction({ task }: { task: Task }) {
    const addSavedTask = useTaskbookStore((state) => state.addSavedTask);
    const [isOpen, setIsOpen] = useState(false);

    const handleSaveConfirm = () => {

        const convertCommentsToString = (comments: Task['comments']) => {
            if (!comments || comments.length === 0) return '';

            return comments.map(comment => {
                const dateToUse = comment.updated_at || comment.created_at;
                const date = new Date(dateToUse).toLocaleDateString();
                return `${comment.user_name}: ${comment.content} - ${date}`;
            }).join('\n\n'); // Double newline creates a space between comments
        };

        const savedTask = {
            user_id: 'u1', // TODO: Replace with actual current user ID
            title: task.title && task.title.trim() ? task.title : "New saved task",
            description: task.description,
            category: undefined, // Optional field
            comments: convertCommentsToString(task.comments),
            subtasks: task.subtasks,
            usage_count: 0
        };

        addSavedTask(savedTask);
        setIsOpen(false);
    };

    const handleSaveCancel = () => {
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <PopoverTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100 border">
                    <Save className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-left">Save to task library</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-white" align="start">
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">
                        Store this task for future use?
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                        This helps improve future planning.
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSaveConfirm}
                            size="sm"
                            className="flex-1 text-foreground"
                        >
                            Yes (recommended)
                        </Button>
                        <Button
                            onClick={handleSaveCancel}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-foreground"
                        >
                            No
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
