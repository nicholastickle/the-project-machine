import { Trash2 } from 'lucide-react';
import { Task } from '@/stores/types';
import useStore from '@/stores/flow-store';
import { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


export default function TaskCardOptionsDeleteAction({ task }: { task: Task }) {
    const deleteNode = useStore((state) => state.deleteNode);
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteConfirm = () => {
        deleteNode(task.node_id);
        setIsOpen(false);
    };

    const handleDeleteCancel = () => {
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100 border">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-left">Delete</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-white" align="start">
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">
                        Delete this task?
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
