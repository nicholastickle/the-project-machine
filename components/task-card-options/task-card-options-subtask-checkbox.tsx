import useStore from '@/stores/flow-store';
import { Checkbox } from "@/components/ui/checkbox";
import { Task, Subtask } from '@/stores/types';


export default function SubtaskCheckbox({ taskId, subtaskId, isCompleted }: { taskId: Task['id']; subtaskId: Subtask['id']; isCompleted: Subtask['is_completed'] }) {

    const updateSubtask = useStore((state) => state.updateSubtask);
    const handleCheckedChange = (checked: boolean) => {
        updateSubtask(taskId, subtaskId, { is_completed: checked });
    };

    return (
        <div className="flex justify-center items-center">
            <Checkbox
                checked={isCompleted || false}
                onCheckedChange={handleCheckedChange}
                className="cursor-pointer"
            />
        </div>
    );
}