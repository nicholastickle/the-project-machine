import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SaveTaskDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    taskTitle: string;
}

export default function SaveTaskDialog({ isOpen, onOpenChange, onConfirm, taskTitle }: SaveTaskDialogProps) {
    const handleYes = () => {
        onConfirm();
        onOpenChange(false);
    };

    const handleNo = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Store this task for future use?</DialogTitle>
                    <DialogDescription>
                        This helps improve future planning.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Task: <span className="font-medium text-foreground">{taskTitle || "Untitled Task"}</span>
                    </p>
                </div>
                <DialogFooter className="flex-row gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={handleNo}
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleYes}
                    >
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
