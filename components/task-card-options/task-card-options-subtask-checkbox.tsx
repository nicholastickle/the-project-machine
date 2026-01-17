import useStore from '@/stores/flow-store';
import { Checkbox } from "@/components/ui/checkbox";

interface SubtaskCheckboxProps {
    nodeId: string;
    subtaskId: string;
    isCompleted: boolean;
}

export default function SubtaskCheckbox({ nodeId, subtaskId, isCompleted }: SubtaskCheckboxProps) {
    const updateSubtask = useStore((state) => state.updateSubtask);
    const handleCheckedChange = (checked: boolean) => {
        updateSubtask(nodeId, subtaskId, { isCompleted: checked });
    };

    return (
        <div className="flex justify-center items-center">
            <Checkbox
                checked={isCompleted}
                onCheckedChange={handleCheckedChange}
                className="cursor-pointer"
            />
        </div>
    );
}