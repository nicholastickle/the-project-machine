import { useRef } from 'react';
import useStore from '@/stores/flow-store';

import { Task, Subtask } from '@/stores/types';

export default function SubtaskDuration({ taskId, subtaskId, duration }: { taskId: Task['id']; subtaskId: Subtask['id']; duration: Subtask['estimated_duration'] }) {

    const inputRef = useRef<HTMLInputElement>(null);
    const updateSubtask = useStore((state) => state.updateSubtask);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow numbers and decimal points
        if (/^\d*\.?\d*$/.test(value)) {
            const numValue = parseFloat(value) || 0;
            updateSubtask(taskId, subtaskId, { estimated_duration: numValue });
        }
    };

    return (
        <div className="flex items-center justify-center text-sm">
            <input
                ref={inputRef}
                type="text"
                value={duration.toString()}
                onChange={handleInputChange}
                className="w-9 text-center bg-transparent border-none outline-none text-sm"
                placeholder="0"
                maxLength={5}
                autoComplete="off"
            />
            <span>h</span>
        </div>
    );
}
