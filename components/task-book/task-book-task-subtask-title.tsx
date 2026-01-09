import { useRef } from 'react';
import useTaskbookStore from '@/stores/taskbook-store';

interface TaskBookTaskSubtaskTitleProps {
    taskId: string;
    subtaskId: string;
    title: string;
    isCompleted: boolean;
}

export default function TaskBookTaskSubtaskTitle({ taskId, subtaskId, title, isCompleted }: TaskBookTaskSubtaskTitleProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const updateSubtask = useTaskbookStore((state) => state.updateSubtask);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateSubtask(taskId, subtaskId, { title: e.target.value });

        // Auto-resize the textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };

    return (
        <textarea
            ref={inputRef}
            value={title || ''}
            onChange={handleInputChange}
            className={`w-full bg-transparent border-none outline-none text-sm resize-none flex items-center justify-start ${isCompleted && title ? 'line-through text-muted-foreground' : ''
                }`}
            placeholder="Enter subtask..."
            maxLength={200}
            autoComplete="off"
            spellCheck={true}
            rows={1}
            style={{ minHeight: '32px', height: '32px', lineHeight: '32px' }}
        />
    );
}
