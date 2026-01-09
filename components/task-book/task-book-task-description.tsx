import useTaskbookStore from '@/stores/taskbook-store';
import { SavedTask } from '@/stores/types';
import { useRef, useState, useEffect } from 'react';
import { AlignLeft } from 'lucide-react';

interface TaskBookTaskDescriptionProps {
    task: SavedTask | null;
}

export default function TaskBookTaskDescription({ task }: TaskBookTaskDescriptionProps) {
    const [value, setValue] = useState(task?.description || '');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const updateSavedTask = useTaskbookStore((state) => state.updateSavedTask);

    // Update value when task changes
    useEffect(() => {
        setValue(task?.description || '');
    }, [task?.description]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);

        // Auto-resize the textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleBlur = () => {
        if (!task) return;

        if (value !== task.description) {
            updateSavedTask(task.id, { description: value });
        }
    };

    if (!task) {
        return null;
    }

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <AlignLeft size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Description:</span>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full text-md placeholder:text-muted-foreground text-muted-foreground resize-none border border-gray-200 outline-none p-2 rounded-md"
                placeholder="Enter description..."
                maxLength={1000}
                autoComplete="off"
                spellCheck={true}
                rows={3}
                style={{ minHeight: 'auto', height: 'auto' }}
            />
        </div>
    );
}