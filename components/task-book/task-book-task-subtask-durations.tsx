import { useRef } from 'react';
import useTaskbookStore from '@/stores/taskbook-store';

interface TaskBookTaskSubtaskDurationProps {
    taskId: string;
    subtaskId: string;
    duration: number;
}

export default function TaskBookTaskSubtaskDurations({ taskId, subtaskId, duration }: TaskBookTaskSubtaskDurationProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const updateSubtask = useTaskbookStore((state) => state.updateSubtask);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow numbers and decimal points
        if (/^\d*\.?\d*$/.test(value)) {
            const numValue = parseFloat(value) || 0;
            updateSubtask(taskId, subtaskId, { estimatedDuration: numValue });
        }
    };

    return (
        <div className="flex items-center justify-center text-sm">
            <input
                ref={inputRef}
                type="text"
                value={duration.toString()}
                onChange={handleInputChange}
                className="w-8 text-center bg-transparent border-none outline-none text-sm"
                placeholder="0"
                maxLength={5}
                autoComplete="off"
            />
            <span>h</span>
        </div>
    );
}
