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
                            onClick={handleNo}
                            className="min-w-[100px]"
                        >
                            No
                        </Button>
                        <Button
                            onClick={handleYes}
                            className="min-w-[100px]"
                        >
                            Yes (recommended)
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
