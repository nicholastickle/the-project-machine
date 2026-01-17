import { useState, useEffect } from 'react';
import useTaskbookStore from '@/stores/taskbook-store';
import { TaskbookEntry } from '@/stores/types';

interface TaskBookTaskTitleProps {
    task: TaskbookEntry | null;
}

export default function TaskBookTaskTitle({ task }: TaskBookTaskTitleProps) {
    const [value, setValue] = useState(task?.title || '');
    const updateSavedTask = useTaskbookStore((state) => state.updateSavedTask);

    useEffect(() => {
        setValue(task?.title || '');
    }, [task?.title]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        if (!task) return;
        const trimmedValue = value.trim();

        if (trimmedValue !== task.title && trimmedValue.length > 0) {
            updateSavedTask(task.id, { title: trimmedValue });
        } else if (trimmedValue.length === 0) {
            setValue(task.title || '');
            updateSavedTask(task.id, { title: task.title || '' });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    if (!task) {
        return null;
    }

    return (
        <textarea
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent resize-none overflow-hidden border-none outline-none text-task-book-foreground font-semibold"
            placeholder="Enter task title..."
            maxLength={200}
            autoComplete="off"
            spellCheck={true}
            rows={1}
            style={{ fieldSizing: "content", height: 'auto' }}
        />
    );
}
