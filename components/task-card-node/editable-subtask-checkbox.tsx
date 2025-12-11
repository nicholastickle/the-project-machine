import useStore from '@/stores/flow-store';
import { Checkbox } from "@/components/ui/checkbox";

interface EditableSubtaskCheckboxProps {
    nodeId: string;
    subtaskId: string;
    isCompleted: boolean;
}

export default function EditableSubtaskCheckbox({ nodeId, subtaskId, isCompleted }: EditableSubtaskCheckboxProps) {
    const updateSubtask = useStore((state) => state.updateSubtask);

    const handleCheckedChange = (checked: boolean) => {
        updateSubtask(nodeId, subtaskId, { isCompleted: checked });
    };

    return (
        <Checkbox
            checked={isCompleted}
            onCheckedChange={handleCheckedChange}
            className="cursor-pointer"
        />
    );
}