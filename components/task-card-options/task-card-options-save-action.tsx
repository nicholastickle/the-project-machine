import { Save } from 'lucide-react';
import { TaskData } from '@/stores/types';
import useTaskbookStore from '@/stores/taskbook-store';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TaskCardOptionsSaveActionProps {
    nodeId: string;
    data: TaskData;
}

export default function TaskCardOptionsSaveAction({ nodeId, data }: TaskCardOptionsSaveActionProps) {
    const addSavedTask = useTaskbookStore((state) => state.addSavedTask);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSaveClick = () => {
        setIsDialogOpen(true);
    };

    const handleSaveConfirm = () => {
        // Convert comments array to array of formatted strings
        const convertCommentsToString = (comments: TaskData['comments']) => {
            if (!comments || comments.length === 0) return '';

            return comments.map(comment => {
                const dateToUse = comment.editedDate || comment.createdDate;
                const date = new Date(dateToUse).toLocaleDateString();
                return `${comment.memberName}: ${comment.comment} - ${date}`;
            }).join('\n\n'); // Double newline creates a space between comments
        };

        // Convert TaskData to SavedTask format
        const savedTask = {
            title: data.title && data.title.trim() ? data.title : "New saved task",
            status: data.status,
            timeSpent: data.timeSpent || 0,
            estimatedHours: data.estimatedHours,
            description: data.description,
            comments: convertCommentsToString(data.comments), // Now a string instead of array
            subtasks: data.subtasks
        };

        addSavedTask(savedTask);
        setIsDialogOpen(false);
    };

    const handleSaveCancel = () => {
        setIsDialogOpen(false);
    };

    return (
        <>
            <button
                onClick={handleSaveClick}
                className="flex items-center space-x-2 p-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100 border "
            >
                <Save className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-left">Save to task book</span>
            </button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md bg-task-card-status-dialog-background text-task-card-status-dialog-foreground border border-task-card-status-dialog-border">
                    <div className="flex flex-col gap-6 py-2">
                        {/* Row 1: Question */}
                        <div className="text-center">
                            <DialogTitle className="text-lg font-semibold">Store this task for future use?</DialogTitle>
                        </div>

                        {/* Row 2: Subtext */}
                        <div className="text-center">
                            <DialogDescription className="text-sm text-muted-foreground">
                                This helps improve future planning.
                            </DialogDescription>
                        </div>

                        {/* Row 3: Buttons */}
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={handleSaveCancel}
                                className="min-w-[100px] border border-task-card-status-dialog-border text-task-card-status-dialog-foreground bg-task-card-status-dialog-background hover:bg-task-card-status-dialog-accent hover:text-task-card-status-dialog-foreground"
                            >
                                No
                            </Button>
                            <Button
                                onClick={handleSaveConfirm}
                                className="min-w-[100px]"
                            >
                                Yes (recommended)
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
