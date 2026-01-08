import { Ellipsis } from 'lucide-react';
import TaskCardOptionsPanel from '@/components/task-card-options/task-card-options-panel';
import { TaskData } from '@/stores/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TaskCardOptionsBadgeProps {
    nodeId: string;
    data: TaskData;
}

export default function TaskCardOptionsBadge({ nodeId, data }: TaskCardOptionsBadgeProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className="absolute top-[-15px] right-[-15px] w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                >
                    <Ellipsis size={20} className="text-white" />
                </div>
            </DialogTrigger>
            <DialogContent className="border-none p-0 max-w-3xl w-full h-[85vh] focus:outline-none">
                <VisuallyHidden>
                    <DialogTitle>Task Options for {data.title}</DialogTitle>
                    <DialogDescription>
                        Configure task settings, manage subtasks, and update task details
                    </DialogDescription>
                </VisuallyHidden>
                <TaskCardOptionsPanel
                    nodeId={nodeId}
                    data={data}
                />
            </DialogContent>
        </Dialog>
    );
}
