import useTaskbookStore from '@/stores/taskbook-store';
import { SavedTask } from '@/stores/types';
import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface TaskBookTaskCommentsProps {
    task: SavedTask | null;
}

export default function TaskBookTaskComments({ task }: TaskBookTaskCommentsProps) {
    const [value, setValue] = useState(task?.description || '');
    const updateSavedTask = useTaskbookStore((state) => state.updateSavedTask);

    useEffect(() => {
        setValue(task?.comments || '');
    }, [task?.comments]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        if (!task) return;
        if (value !== task.comments) {
            updateSavedTask(task.id, { comments: value });
        }
    };

    if (!task) {
        return null;
    }

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Comments & Notes:</span>
            </div>
            <textarea
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full text-md placeholder:text-muted-foreground text-muted-foreground resize-none overflow-hidden border border-gray-200 outline-none p-2 rounded-md"
                placeholder="Enter comments or notes..."
                maxLength={1000}
                autoComplete="off"
                spellCheck={true}
                rows={3}
                style={{ fieldSizing: "content", minHeight: '100px', height: 'auto' }}
            />
        </div>
    );
}